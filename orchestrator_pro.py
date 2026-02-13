import os, json, time, requests, concurrent.futures
from datetime import datetime

# --- CONFIGURATION ---
OLLAMA_API = "http://localhost:11434/api/generate"
ORCHESTRATOR = "qwen2.5-coder:7b" # Stays on GPU
WORKER = "llama3.2:3b"            # Pushed to CPU
MAX_WORKERS = 4                   # Parallel tasks on your 7950X
DROP_DIR = "./sams_instructions_drop/"

def call_ollama_api(model, prompt, system_prompt="", is_json=False):
    payload = {
        "model": model,
        "prompt": prompt,
        "system": system_prompt,
        "stream": False,
        "options": {"temperature": 0}
    }
    if is_json: payload["format"] = "json"
    
    try:
        response = requests.post(OLLAMA_API, json=payload)
        return response.json().get("response", "")
    except Exception as e:
        return f"Error: {e}"

def worker_thread(task):
    """The 'Pumping' Logic: Processes one coding task."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] CPU Worker: Starting {task['id']}")
    
    # Send task to Llama 3.2
    code_output = call_ollama_api(WORKER, task['prompt'], 
                                 system_prompt="You are a Senior TypeScript Dev. Output code only.")
    
    # Save to your deliverables folder
    with open(f"outputs/agent_deliverables/{task['id']}.ts", "w") as f:
        f.write(code_output)
    
    task['status'] = "complete"
    return task

def run_factory():
    print("--- LOTR TYPING GAME FACTORY: ONLINE ---")
    while True:
        # 1. LOAD & SYNC STATE
        try:
            with open("tasks/queue.json", "r") as f: 
                queue = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            queue = {"tasks": [], "backlog": []}

        # 2. ORCHESTRATE (GPU) - Refill if low
        pending_tasks = [t for t in queue.get('tasks', []) if t.get('status') == 'pending']
        
        if len(pending_tasks) < 5:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Orchestrator (GPU): Refilling queue...")
            refill_prompt = f"Current Queue: {json.dumps(queue)}. Add 10 Phase 1 coding tasks. JSON ONLY."
            
            # The System Prompt is critical for schema enforcement
            system_instruction = "Output ONLY JSON. Each task must have: 'id', 'prompt', and 'status': 'pending'."
            new_tasks_raw = call_ollama_api(ORCHESTRATOR, refill_prompt, system_prompt=system_instruction, is_json=True)
            
            try:
                queue = json.loads(new_tasks_raw)
                # Validation Pass: Ensure every task has a status
                for t in queue.get('tasks', []):
                    if 'status' not in t: t['status'] = 'pending'
            except Exception as e:
                print(f"Orchestrator returned invalid JSON: {e}")

        # 3. EXECUTE (CPU - Parallel)
        pending = [t for t in queue.get('tasks', []) if t.get('status') == 'pending']
        if pending:
            with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                completed_tasks = list(executor.map(worker_thread, pending[:MAX_WORKERS]))
                
                # Sync results back to queue
                for completed in completed_tasks:
                    for original in queue['tasks']:
                        if original['id'] == completed['id']:
                            original['status'] = 'complete'

        # 4. SAVE STATE
        with open("tasks/queue.json", "w") as f: 
            json.dump(queue, f, indent=4)
        
        time.sleep(10)
if __name__ == "__main__":
    run_factory()