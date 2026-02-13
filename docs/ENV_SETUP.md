# Environment setup for orchestration

This guide gets your machine ready so **Gemini** can orchestrate and **local models** can run tasks (code, content, images) without cloud APIs.

---

## 1. Local LLM (Ollama)

Workers use Ollama for code generation, content generation, and test drafting.

### Install

1. Download and install from [https://ollama.com](https://ollama.com).
2. Start Ollama (it usually runs as a service; or run `ollama serve` in a terminal).
3. Pull at least one model. From project root:

   ```powershell
   ollama pull llama3.2:3b
   ```

   Optional, for heavier work:

   ```powershell
   ollama pull llama3.2:7b
   ```

### Verify

- API: `http://localhost:11434/api/tags` should return a list of models.
- Or run the project health check (see below).

---

## 2. Image generation (Automatic1111 or ComfyUI)

Asset tasks need a local image model. Two options:

### Option A: Automatic1111 (recommended for this setup)

1. Install [Stable Diffusion WebUI (A1111)](https://github.com/AUTOMATIC1111/stable-diffusion-webui).
2. Start the web UI with the **API** flag so the image worker can call it:

   ```bash
   python launch.py --api
   ```

3. Default URL: `http://localhost:7860`. The image worker uses `/sdapi/v1/txt2img` with your task prompt plus a fixed style suffix (e.g. pixel art, 32x32, retro game).
4. Set in environment (optional): `IMAGE_BACKEND=a1111` (this is the default in `tools/image_worker.ps1`).

### Option B: ComfyUI

1. Install and run [ComfyUI](https://github.com/comfyanonymous/ComfyUI) (default port **8188**).
2. The image worker does **not** include a built-in ComfyUI workflow. To use ComfyUI you would need to add a workflow that accepts a text prompt and export it in API format, then integrate it in `tools/image_worker.ps1`. For a quick start, use Automatic1111 (option A).
3. Health check pings `http://localhost:8188/` to see if ComfyUI is up.

---

## 3. Health check

From the **project root**:

```powershell
.\tools\health_check.ps1
```

This script:

- Pings Ollama at `http://localhost:11434/api/tags`
- Pings ComfyUI at `http://localhost:8188/` (or only Ollama if you use A1111 for images)
- Writes **`logs/env_status.json`** with `ollama` and `comfyui` set to `"ok"` or `"down"`

Gemini (and the callback script) use this file to know what’s available before assigning tasks.

---

## 4. Worker configuration (optional)

- **LLM model:** Edit `tools/agent_config.json` and set `"model": "llama3.2:3b"` (or another model name). You can also set the env var `OLLAMA_MODEL`.
- **Image backend:** Set env var `IMAGE_BACKEND=a1111` (default) for Automatic1111. ComfyUI is not fully wired in the script; see option B above.

---

## 5. Running workers

From project root:

- **LLM worker:**  
  `.\tools\agent_worker.ps1`  
  (reads `tasks/queue.json`, runs tasks for `local_llm_agent`, writes to `outputs/agent_deliverables/` and updates `logs/agent_status.json`)

- **Image worker:**  
  `.\tools\image_worker.ps1`  
  (runs tasks for `image_gen_agent`; requires Automatic1111 with `--api` on port 7860 by default)

Run each in a separate terminal, or use a runner that starts both. When the main queue is empty, the LLM worker pulls from the **backlog** so it can keep working until the next Gemini callback.

---

## 6. Callback (invoking Gemini)

To trigger an orchestrator review:

```powershell
.\tools\gemini_callback.ps1
```

This builds **`logs/callback_context.md`** (and **`logs/callback_prompt_arg.txt`**), then invokes **Gemini CLI** by piping that prompt into the command. Default: `gemini -y`. Override the executable with `$env:GEMINI_CLI_CMD` (e.g. a full path to `gemini`) if needed.

---

## 7. Using generated assets in the game

After image tasks complete, copy files into the web app so the game can load them:

```powershell
.\tools\copy_assets_to_public.ps1
```

This copies everything under **`outputs/agent_deliverables/`** into **`public/assets/`** (sprites, backgrounds, ui, particles, icons, tiles). The game’s BootScene preloads these; MainScene uses them for parallax, ground tiles, and word-complete particles when present.

**Optional sound effects:** place `.mp3` (or `.ogg`) files in **`public/sounds/`** with these names to enable in-game audio:

- `word_complete.mp3` – typing a word correctly  
- `combo.mp3` – combo multiplier  
- `game_over.mp3` – game over  
- `miss.mp3` – wrong key  

If files are missing, the game still runs; sound calls are no-ops.

---

**Last updated:** 2025-02-10
