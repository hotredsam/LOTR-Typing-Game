# Multi-Agent Orchestration Architecture

**Version:** 1.0
**Last Updated:** 2025-02-10
**Compliance Status:** ✅ Reviewed

---

## System Overview

This project uses a **multi-agent orchestration model** where:
- **Gemini CLI** acts as the strategic project manager
- **Local LLMs** (Ollama/LMStudio) act as worker agents
- **Local image models** (SD/ComfyUI) act as asset generators
- **Scheduled callbacks** provide sync checkpoints
- **Human oversight** maintains quality and compliance
````
┌─────────────────────────────────────────────────────┐
│                   HUMAN STRATEGIST                   │
│            (Reviews, Approves, Directs)              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              GEMINI CLI ORCHESTRATOR                 │
│   (Planning, Task Assignment, Quality Review)        │
└──────┬──────────────────────┬───────────────────────┘
       │                      │
       ▼                      ▼
┌─────────────────┐    ┌─────────────────────────┐
│  LOCAL LLM      │    │  IMAGE GENERATION       │
│  AGENTS         │    │  AGENTS                 │
│  (Ollama/LM)    │    │  (ComfyUI/SD)           │
│                 │    │                         │
│  - Code gen     │    │  - Sprite generation    │
│  - Content gen  │    │  - Background art       │
│  - Testing      │    │  - UI elements          │
└─────────────────┘    └─────────────────────────┘
       │                      │
       └──────────┬───────────┘
                  ▼
        ┌──────────────────┐
        │  OUTPUTS/        │
        │  DELIVERABLES/   │
        │  (Quarantine)    │
        └──────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  HUMAN REVIEW    │
        │  & APPROVAL      │
        └──────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  INTEGRATION     │
        │  /src/ /assets/  │
        └──────────────────┘
````

---

## Agent Roles and Responsibilities

### 1. Gemini CLI Orchestrator (Strategic Layer)

**Capabilities:**
- High-level project planning
- Architecture decisions
- Code review and refactoring
- Task decomposition
- Quality assurance

**Responsibilities:**
- Read project state from `/docs/` and `/logs/`
- Decompose features into executable tasks
- Write task prompts for local agents
- Review agent outputs against quality standards
- Update project documentation
- Generate new task queues

**Invocation Pattern:**
- Manual: Developer runs `gemini-cli` with orchestrator prompt
- Scheduled: Cron job triggers callback every 6 hours
- On-demand: When local agents complete critical tasks

**Constraints:**
- ❌ Does NOT execute tasks directly (delegates to local agents)
- ❌ Does NOT write production code (reviews and guides)
- ❌ Does NOT train local models (compliance requirement)
- ✅ DOES provide strategic direction
- ✅ DOES ensure quality and coherence

---

### 2. Local LLM Agents (Execution Layer)

**Examples:**
- Ollama with llama3.2:3b
- LMStudio with Mistral-7B
- llama.cpp server

**Capabilities:**
- Code generation from specifications
- Content generation (words, quests, lore)
- Unit test generation
- Documentation drafting
- Prompt generation for image models

**Responsibilities:**
- Monitor `/tasks/queue.json` for assigned work
- Execute tasks independently (no Gemini context needed)
- Output results to `/outputs/agent_deliverables/`
- Log work to `/logs/agent_llm_DATE.md`
- Update task status in queue

**Execution Pattern:**
````bash
# Automated worker loop
while true; do
    python tools/agent_worker.py --agent=llm
    sleep 300  # Check every 5 minutes
done
````

**Constraints:**
- ❌ Does NOT access Gemini outputs (Zero-Training Rule)
- ❌ Does NOT make strategic decisions
- ❌ Does NOT integrate own work (human approval required)
- ✅ DOES execute well-defined prompts
- ✅ DOES log all work transparently

---

### 3. Image Generation Agents (Asset Layer)

**Examples:**
- ComfyUI (port 8188)
- Automatic1111 (port 7860)
- InvokeAI

**Capabilities:**
- Pixel art sprite generation
- Background layer creation
- UI element generation
- Icon and logo creation

**Responsibilities:**
- Monitor `/tasks/queue.json` for image tasks
- Generate assets from prompt templates
- Save outputs with consistent naming to `/outputs/agent_deliverables/`
- Log generation parameters to `/logs/agent_image_DATE.md`
- Maintain style consistency across assets

**Execution Pattern:**
````python
# Image generation worker
def process_image_task(task):
    prompt = task['prompt']
    style = "pixel art, 32x32, top-down, retro game, clean lines"
    
    # Call local SD model
    image = comfyui_api.generate(
        prompt=f"{prompt}, {style}",
        width=32,
        height=32,
        steps=20,
        seed=task.get('seed', -1)
    )
    
    # Save with metadata
    save_image(image, task['output_path'], metadata={
        'prompt': prompt,
        'generated_at': datetime.now(),
        'model': 'SD1.5',
        'human_approved': False
    })
````

**Constraints:**
- ❌ Does NOT modify existing approved assets
- ❌ Does NOT make stylistic decisions (follows prompts exactly)
- ✅ DOES maintain generation logs for reproducibility
- ✅ DOES use consistent style parameters

---

## Task Queue System

### Queue Structure
File: `/tasks/queue.json`
````json
{
  "meta": {
    "version": "1.0",
    "last_updated": "2025-02-10T14:00:00Z",
    "updated_by": "gemini_orchestrator"
  },
  "tasks": [
    {
      "id": "task_001",
      "type": "content_generation",
      "assigned_to": "local_llm_agent",
      "priority": 1,
      "status": "pending",
      "created_at": "2025-02-10T10:00:00Z",
      "prompt": "Generate 50 original fantasy location names with harsh consonants and mystical feel. Output as JSON array with format: [{name: string, description: string}]. Avoid common fantasy clichés like '-shire', '-garde', '-helm'.",
      "output_path": "/outputs/agent_deliverables/location_names.json",
      "validation": {
        "schema": "location_names_schema.json",
        "min_items": 50,
        "uniqueness_check": true
      },
      "callback_when": "complete",
      "estimated_duration_minutes": 5
    },
    {
      "id": "task_002",
      "type": "asset_generation",
      "assigned_to": "image_gen_agent",
      "priority": 2,
      "status": "pending",
      "created_at": "2025-02-10T10:05:00Z",
      "prompt": "warrior character standing, front view, simple geometric shapes, heroic pose",
      "output_path": "/outputs/agent_deliverables/sprites/warrior_32x32.png",
      "parameters": {
        "width": 32,
        "height": 32,
        "style": "pixel art, retro game, clean lines, limited palette",
        "seed": 42
      },
      "callback_when": "complete",
      "estimated_duration_minutes": 3
    }
  ]
}
````

### Task Lifecycle
````
┌─────────────┐
│   PENDING   │  (Created by Gemini, waiting for agent)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ IN_PROGRESS │  (Agent picked up task)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  COMPLETE   │  (Agent finished, output in /outputs/)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│HUMAN_REVIEW │  (Awaiting human approval)
└──────┬──────┘
       │
       ├─✅─► APPROVED    (Integrated to /src/ or /assets/)
       │
       ├─⚠️─► REVISION   (New task created with feedback)
       │
       └─❌─► REJECTED   (Discarded, logged as failed)
````

---

## Callback Protocol

### Trigger Conditions
Gemini callback is triggered when:
1. **Scheduled time reached** (every 6 hours via cron)
2. **Critical task completed** (agent sets `callback_when: "immediate"`)
3. **Human manually invokes** (`./tools/gemini_callback.sh`)
4. **Error threshold exceeded** (3+ failed tasks)

### Callback Procedure

**Step 1: Context Loading**
````bash
# Gemini reads these files on callback
/tasks/queue.json           # Current task statuses
/logs/agent_status.json     # What agents did since last callback
/outputs/agent_deliverables/*  # Actual outputs
/docs/TASKS.md              # Current project state
/logs/human_reviews.md      # Previous approvals
````

**Step 2: Quality Review**
Gemini evaluates each completed task against:
- `/docs/QUALITY_STANDARDS.md` (correctness, style, completeness)
- `/docs/LEGAL_COMPLIANCE.md` (no copyright violations)
- Original task requirements (meets specifications)

**Step 3: Human Handoff**
Gemini generates:
````markdown
# Callback Report - 2025-02-10 14:00

## Completed Tasks Requiring Review

### task_001: Location Names ✅ RECOMMEND APPROVAL
- Output: 50 unique names generated
- Quality: High - creative, thematic, no clichés
- Compliance: ✅ No copyright issues
- **Action Required:** Human review and approve

### task_002: Warrior Sprite ⚠️ RECOMMEND REVISION
- Output: 32x32 PNG generated
- Issue: Too detailed for pixel art aesthetic
- **Action Required:** Create simpler version
- **Next Task:** task_002_rev1 (already drafted)
````

**Step 4: Human Review**
Human (you) reviews report and:
- Approves task_001 → Moves file to `/src/data/locations.json`
- Requests revision task_002 → Approves Gemini's revision task

**Step 5: Integration**
After human approval, Gemini:
- Updates `/docs/TASKS.md` with progress
- Generates new tasks for next phase
- Updates `/tasks/queue.json`
- Logs decisions to `/logs/gemini_decisions.md`

---

## Offline Autonomous Work

### Continuous Loop (When Gemini Not Running)
````bash
# tools/agent_worker.sh (runs continuously)

#!/bin/bash
while true; do
    # Check for new tasks
    TASK=$(python tools/get_next_task.py --agent=llm)
    
    if [ -n "$TASK" ]; then
        echo "Processing $TASK"
        
        # Execute task
        python tools/execute_task.py --task_id="$TASK"
        
        # Log completion
        python tools/log_completion.py --task_id="$TASK"
        
        # Check if callback needed
        if [ -f "/tmp/callback_requested" ]; then
            echo "Callback requested - agents pausing"
            break
        fi
    fi
    
    sleep 300  # Check every 5 minutes
done
````

### Task Queue Management
Local agents:
- **DO** check queue every 5 minutes
- **DO** pick up tasks matching their capability (`assigned_to`)
- **DO** execute tasks independently
- **DO** log all work
- **DO NOT** modify queue (read-only for agents)
- **DO NOT** integrate outputs (human approval required)

---

## Communication Channels

### Gemini → Local Agents
- **Medium:** Task prompts in `/tasks/queue.json`
- **Format:** Standalone, self-contained prompts
- **Constraint:** No Gemini reasoning or outputs included (Zero-Training Rule)

### Local Agents → Gemini
- **Medium:** Status updates in `/logs/agent_status.json`
- **Format:** Structured logs with task_id, status, output_path
- **Constraint:** Factual reporting only, no strategic input

### Gemini → Human
- **Medium:** Callback reports in `/logs/callback_reports/`
- **Format:** Markdown with recommendations
- **Constraint:** Clear approve/revise/reject options

### Human → Gemini
- **Medium:** Approval decisions in `/logs/human_reviews.md`
- **Format:** Structured review log
- **Constraint:** Explicit approval required for integration

---

## Error Handling

### Agent Failures
If local agent fails a task:
1. Agent logs error to `/logs/agent_errors.json`
2. Agent retries up to 3 times with exponential backoff
3. After 3 failures, marks task as `failed` in queue
4. Triggers immediate Gemini callback for review

### Gemini Unavailable
If Gemini callback fails:
- Local agents continue processing queue
- Completed tasks accumulate in `/outputs/`
- Human can manually review and approve
- Next successful callback catches up on all pending reviews

### Claude API Fallback
If local LLM unavailable AND task critical:
1. Check `/claude_key.txt` exists
2. Log fallback usage to `/logs/claude_usage.json`
3. Cache result aggressively (24-hour TTL)
4. Alert human to install/fix local LLM
5. Track budget: stop if >$8 spent (keep $2 buffer)

---

## Performance Optimization

### Task Batching
Gemini creates tasks in batches:
- Similar tasks grouped (all sprite generation together)
- Dependencies respected (base code before tests)
- Priority ordering (critical path first)

### Caching Strategy
````json
// /cache/responses.json
{
  "prompt_hash_abc123": {
    "response": "...",
    "created_at": "2025-02-10T10:00:00Z",
    "ttl_hours": 24,
    "source": "local_llm"
  }
}
````

### Parallel Execution
- Multiple local agents can run simultaneously
- Image generation doesn't block code generation
- Queue supports concurrent task pickup

---

## Security Considerations

### API Key Protection
````bash
# claude_key.txt permissions
chmod 600 claude_key.txt
# Never commit to git
echo "claude_key.txt" >> .gitignore
````

### Output Sanitization
Before integration, scan for:
- Hardcoded secrets or keys
- Personal information (PII)
- Copyrighted content patterns
- Malicious code patterns

### Network Isolation
- Local agents use `localhost` only
- No external API calls except Claude fallback
- Firewall rules restrict agent network access

---

## Monitoring and Observability

### Key Metrics
Track in `/logs/metrics.json`:
````json
{
  "tasks_completed_24h": 47,
  "tasks_failed_24h": 2,
  "average_task_duration_minutes": 4.2,
  "gemini_callbacks_24h": 4,
  "human_reviews_pending": 3,
  "claude_api_calls_total": 0,
  "claude_api_cost_total": 0.00
}
````

### Health Checks
````bash
# tools/health_check.sh
curl -s http://localhost:11434/api/tags  # Ollama
curl -s http://localhost:8188/system_stats  # ComfyUI
````

---

## Appendix: File Structure
````
/
├── docs/
│   ├── ORCHESTRATION.md (this file)
│   ├── LEGAL_COMPLIANCE.md
│   ├── AGENT_PROTOCOLS.md
│   ├── WORKFLOWS.md
│   ├── QUALITY_STANDARDS.md
│   └── TASKS.md
├── tasks/
│   └── queue.json
├── outputs/
│   └── agent_deliverables/
├── logs/
│   ├── agent_llm_YYYY-MM-DD.md
│   ├── agent_image_YYYY-MM-DD.md
│   ├── agent_status.json
│   ├── human_reviews.md
│   └── gemini_decisions.md
├── tools/
│   ├── agent_worker.sh
│   ├── gemini_callback.sh
│   └── compliance_check.sh
└── prompts/
    └── gemini_orchestrator_v1.md
````

**END OF ORCHESTRATION DOCUMENTATION**