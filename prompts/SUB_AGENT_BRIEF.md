# Sub-Agent Brief – Run Aggressively

When running as a **local LLM agent** or **image generation agent**, use this brief.

## Your job

1. **Read** `tasks/queue.json`. Take all tasks where `assigned_to` matches your role (`local_llm_agent` or `image_gen_agent`) and `status` is `pending`.
2. **For each task:** Execute the `prompt` exactly. Output to the path in `output_path` (create directories if needed). Do not include reasoning—only the deliverable (code, JSON, or image file).
3. **Style:** For any visual or written content, follow `docs/ART_STYLE_GUIDE.md` (Terraria / Type Night quality, pixel art, readability).
4. **When your queue slice is empty:** Pull from `backlog` and process backlog items the same way. Log completions so the orchestrator can reconcile.
5. **Update** task `status` to `complete` and set `completed_at` when done. Append a one-line summary to `logs/agent_status.json`.

## Image agents only

- Use the `parameters` field (width, height, style) when calling your image API.
- Every image prompt must include: "pixel art, Terraria style, limited palette, no anti-aliasing, crisp pixels" unless the prompt already does.

## LLM agents only

- Output only valid JSON when the task asks for JSON. No markdown, no explanation.
- Output only code when the task asks for code. No preamble.

## Run order

Work in `priority` order (lower number first). Process as many tasks as you can in one run; then the next callback will refill the queue.
