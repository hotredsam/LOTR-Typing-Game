\# Workflows and Procedures



\*\*Version:\*\* 1.0

\*\*Last Updated:\*\* 2025-02-10

\*\*Compliance:\*\* ✅ All workflows human-approved



---



\## Overview



This document contains step-by-step procedures for common scenarios in the multi-agent development system.



---



\## Workflow 1: Initial Project Setup



\### Prerequisites

\- Personal computer (NOT KPMG equipment)

\- Personal internet connection (NOT KPMG network)

\- Git installed

\- Node.js 18+ installed



\### Step-by-Step



\*\*1. Repository Initialization\*\*

```bash

\# Clone or create repository

git clone <your-repo> fantasy-typing-game

cd fantasy-typing-game



\# Verify personal hardware

hostname  # Should NOT be KPMG hostname

whoami    # Should be personal account



\# Create initial structure

mkdir -p docs logs tasks outputs/agent\_deliverables tools prompts src assets

```



\*\*2. Install Dependencies\*\*

```bash

npm init -y

npm install vite react react-dom phaser zustand idb

npm install -D typescript @types/react @types/react-dom tailwindcss

npm install -D eslint prettier vitest

```



\*\*3. API Key Setup (Anthropic Fallback)\*\*

```bash

\# Create API key file

touch key.txt

chmod 600 key.txt



\# Add your Anthropic API key (get from: https://console.anthropic.com/)

echo "sk-ant-api03-..." > key.txt



\# CRITICAL: Never commit this file

echo "key.txt" >> .gitignore

echo "claude\_key.txt" >> .gitignore  # Legacy name support



\# Verify permissions

ls -l key.txt  # Should show: -rw------- (600)

```



\*\*4. Documentation Setup\*\*

```bash

\# Copy all .md files from this prompt into /docs/

cp LEGAL\_COMPLIANCE.md docs/

cp ORCHESTRATION.md docs/

cp AGENT\_PROTOCOLS.md docs/

cp WORKFLOWS.md docs/

cp QUALITY\_STANDARDS.md docs/

cp TASKS.md docs/



\# Initialize authorship log

cat > logs/authorship\_log.md << 'EOF'

\# Authorship Log - Fantasy Typing Game



\## Human Creative Contributions



\### Game Concept (100% Human)

\- \*\*Author:\*\* \[Your Name]

\- \*\*Date:\*\* 2025-02-10

\- \*\*Contribution:\*\* Original game concept, multi-agent orchestration system design



\### Master Prompts (Human-Authored)

All prompts directing Gemini and local agents are human-written strategic instructions.



EOF



\# Initialize human review log

cat > logs/human\_reviews.md << 'EOF'

\# Human Review Log



\## Instructions

After each Gemini callback, log your review decisions here.



Format:

```

\## Review Session: YYYY-MM-DD HH:MM

\*\*Reviewer:\*\* \[Your Name]

\*\*Agent Outputs Reviewed:\*\* \[count]



\### Approvals

\- ✅ task\_id: description (action taken)



\### Revisions Requested

\- ⚠️ task\_id: description (reason)



\### Rejections

\- ❌ task\_id: description (reason)

```



EOF

```



\*\*5. Initial Compliance Check\*\*

```bash

\# Run compliance verification

bash tools/compliance\_check.sh



\# Should output:

\# ✅ No KPMG references found

\# ✅ API key secured

\# ✅ Documentation present

\# ✅ Compliance checks passed

```



\*\*6. Commit Initial Setup\*\*

```bash

git add .

git commit -m "Initial project setup - human authored"

git push origin main



\# Tag this commit for legal record

git tag -a v0.1.0-setup -m "Initial setup by \[Your Name]"

git push origin v0.1.0-setup

```



---



\## Workflow 2: Local AI Setup (Phase 0)



\### Objective

Install and configure local LLM and image generation models.



\### Step 1: LLM Installation (Choose One)



\*\*Option A: Ollama (Recommended)\*\*

```bash

\# Install Ollama

curl -fsSL https://ollama.com/install.sh | sh



\# Pull a lightweight model

ollama pull llama3.2:3b



\# Verify installation

ollama list

curl http://localhost:11434/api/tags



\# Expected output: JSON with available models

```



\*\*Option B: LM Studio\*\*

```bash

\# Download from https://lmstudio.ai/

\# Install application

\# Load model: llama-3.2-3b-instruct

\# Start local server (default port: 1234)



\# Verify

curl http://localhost:1234/v1/models

```



\*\*Option C: llama.cpp\*\*

```bash

git clone https://github.com/ggerganov/llama.cpp

cd llama.cpp

make



\# Download a GGUF model

./models/download-ggml-model.sh 7B



\# Run server

./server -m models/7B/ggml-model-q4\_0.gguf --port 8080



\# Verify

curl http://localhost:8080/health

```



\### Step 2: Image Model Installation (Optional)



\*\*Option A: ComfyUI (Recommended)\*\*

```bash

\# Clone ComfyUI

git clone https://github.com/comfyanonymous/ComfyUI

cd ComfyUI



\# Install dependencies

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

pip install -r requirements.txt



\# Download Stable Diffusion 1.5 model

\# Place in: ComfyUI/models/checkpoints/

wget https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.ckpt



\# Start ComfyUI

python main.py



\# Access at: http://localhost:8188

```



\*\*Option B: Automatic1111\*\*

```bash

\# Clone repository

git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui

cd stable-diffusion-webui



\# Run installation script

./webui.sh  # Linux/Mac

\# OR

webui-user.bat  # Windows



\# Access at: http://localhost:7860

```



\### Step 3: Configuration File



Create `.env` file:

```bash

cat > .env << 'EOF'

\# Local AI Configuration

LOCAL\_LLM\_URL=http://localhost:11434

LOCAL\_LLM\_TYPE=ollama

LOCAL\_LLM\_MODEL=llama3.2:3b



\# Image Generation (optional)

LOCAL\_IMAGE\_URL=http://localhost:8188

LOCAL\_IMAGE\_TYPE=comfyui



\# Anthropic Fallback

ANTHROPIC\_KEY\_FILE=./key.txt

ANTHROPIC\_MAX\_BUDGET\_USD=10.00



\# Project Settings

PROJECT\_NAME=fantasy-typing-game

ENVIRONMENT=development

EOF



\# Never commit .env

echo ".env" >> .gitignore

```



\### Step 4: Verify Setup

```bash

\# Run verification script

node tools/verify\_ai\_setup.js



\# Expected output:

\# ✅ Ollama detected at http://localhost:11434

\# ✅ Model llama3.2:3b available

\# ✅ ComfyUI detected at http://localhost:8188

\# ✅ Anthropic key file found at ./key.txt

\# ✅ All systems operational

```



---



\## Workflow 3: Starting a Development Session



\### When to Use

\- Beginning a new work session

\- After completing local AI setup

\- After human approves previous work



\### Procedure



\*\*1. Update Project State\*\*

```bash

\# Pull latest changes (if collaborative)

git pull origin main



\# Review current phase

cat docs/TASKS.md



\# Check for pending reviews

cat logs/human\_reviews.md

```



\*\*2. Start Local Agents\*\*

```bash

\# Terminal 1: LLM Agent

./tools/agent\_worker.sh --agent=llm



\# Terminal 2: Image Agent (if needed)

./tools/agent\_worker.sh --agent=image



\# Terminal 3: Status monitor

watch -n 5 'cat logs/agent\_status.json | jq .'

```



\*\*3. Invoke Gemini Orchestrator\*\*

```bash

\# Run Gemini with orchestrator prompt

gemini-cli --prompt prompts/gemini\_orchestrator\_v1.md



\# OR if using Google AI Studio API:

curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent \\

&nbsp; -H "Content-Type: application/json" \\

&nbsp; -H "x-goog-api-key: $GEMINI\_API\_KEY" \\

&nbsp; -d @prompts/gemini\_orchestrator\_request.json

```



\*\*4. Gemini Initial Actions\*\*

Gemini should:

\- Read all `/docs/\*.md` files

\- Check `/logs/agent\_status.json`

\- Review `/tasks/queue.json`

\- Read `/docs/TASKS.md` for current phase

\- Generate new tasks if queue empty

\- Create callback schedule



\*\*5. Monitor Progress\*\*

```bash

\# Watch task queue

watch -n 10 'cat tasks/queue.json | jq .tasks'



\# Watch agent logs

tail -f logs/agent\_llm\_$(date +%Y-%m-%d).md

tail -f logs/agent\_image\_$(date +%Y-%m-%d).md



\# Check for errors

cat logs/agent\_errors.json | jq .

```



---



\## Workflow 4: Scheduled Callback (Every 6 Hours)



\### Trigger

\- Cron job runs `./tools/gemini\_callback.sh`

\- OR manual invocation when agents complete critical tasks



\### Procedure



\*\*1. Pre-Callback Preparation (Automated)\*\*

```bash

\#!/bin/bash

\# tools/gemini\_callback.sh



echo "Preparing Gemini callback..."



\# Pause local agents

touch /tmp/callback\_requested

killall -SIGUSR1 agent\_worker  # Graceful pause



\# Wait for agents to finish current tasks

sleep 30



\# Generate context package

python tools/generate\_callback\_context.py



\# Outputs:

\# - /logs/callback\_context.json (consolidated status)

\# - /logs/review\_requests/request\_$(date +%Y-%m-%d\_%H-%M).md



echo "Context prepared. Invoking Gemini..."

```



\*\*2. Gemini Callback Execution\*\*

```bash

\# Gemini is invoked with callback context

gemini-cli --prompt prompts/gemini\_callback\_v1.md \\

&nbsp;          --context logs/callback\_context.json



\# Gemini performs:

\# 1. Read callback\_context.json

\# 2. Review all completed task outputs in /outputs/

\# 3. Evaluate against QUALITY\_STANDARDS.md

\# 4. Generate review request for human

\# 5. Update project documentation

\# 6. Prepare new task queue (pending human approval)

```



\*\*3. Human Review (YOU)\*\*

```bash

\# Read Gemini's review request

cat logs/review\_requests/request\_$(date +%Y-%m-%d\_%H-%M).md



\# For each completed task:

\# - Inspect output in /outputs/agent\_deliverables/

\# - Decide: Approve / Request Revision / Reject



\# Example approval process:

\# 1. Review task\_101 output

cat outputs/agent\_deliverables/calculateWPM.ts

\# 2. Run validation

npx tsc --noEmit outputs/agent\_deliverables/calculateWPM.ts

\# 3. If good, approve:

mv outputs/agent\_deliverables/calculateWPM.ts src/utils/scoring.ts

```



\*\*4. Log Human Decisions\*\*

```bash

\# Update human review log

cat >> logs/human\_reviews.md << 'EOF'



\## Review Session: 2025-02-10 14:00

\*\*Reviewer:\*\* \[Your Name]

\*\*Agent Outputs Reviewed:\*\* 3



\### Approvals

\- ✅ task\_101: calculateWPM function (moved to src/utils/scoring.ts)

\- ✅ task\_103: Location names (moved to src/data/locations.json)



\### Revisions Requested

\- ⚠️ task\_201: Goblin sprite too complex (approved revision task\_201\_rev1)



\### Rejections

\- ❌ task\_204: Enemy names too similar to D\&D (copyright risk)



\*\*Next Actions:\*\* Approved Gemini to proceed with Phase 2 tasks.

EOF



\# Update authorship log if strategic decisions made

cat >> logs/authorship\_log.md << 'EOF'



\## Strategic Decision: 2025-02-10 14:00

\- \*\*Decision:\*\* Approved simpler pixel art style for sprites

\- \*\*Rationale:\*\* 32x32 resolution requires minimalist approach

\- \*\*Impact:\*\* Updated ART\_STYLE\_GUIDE.md with 8-color palette limit

EOF

```



\*\*5. Gemini Integration (After Human Approval)\*\*

```bash

\# Gemini runs post-approval tasks:

\# 1. Update docs/TASKS.md with progress

\# 2. Generate new task queue

\# 3. Archive completed tasks

\# 4. Update metrics



\# Gemini creates new tasks/queue.json

\# Resume local agents

rm /tmp/callback\_requested

./tools/agent\_worker.sh --agent=llm \&

./tools/agent\_worker.sh --agent=image \&

```



---



\## Workflow 5: Handling Agent Failures



\### Scenario

Local agent fails a task multiple times.



\### Procedure



\*\*1. Agent Detects Failure\*\*

```bash

\# Agent logs error

{

&nbsp; "error\_id": "err\_005",

&nbsp; "task\_id": "task\_102",

&nbsp; "error\_type": "import\_resolution",

&nbsp; "message": "Cannot find module '@/utils/calculateWPM'",

&nbsp; "retry\_count": 3,

&nbsp; "max\_retries": 3

}



\# Agent marks task as 'failed' in queue

\# Agent triggers callback\_requested flag

```



\*\*2. Gemini Callback Triggered\*\*

```bash

\# Gemini reads error log

\# Gemini analyzes root cause

\# Gemini determines if fixable

```



\*\*3. Gemini Decision Tree\*\*



\*\*If Simple Fix:\*\*

```json

{

&nbsp; "id": "task\_102\_fix",

&nbsp; "type": "code\_generation",

&nbsp; "assigned\_to": "local\_llm\_agent",

&nbsp; "prompt": "Generate unit tests for calculateWPM. Use RELATIVE imports: '../utils/calculateWPM' instead of path aliases. Reason: Test environment not configured for @/ aliases.",

&nbsp; "parent\_task": "task\_102"

}

```



\*\*If Complex Issue:\*\*

```markdown

\# Escalation to Human



\## Failed Task: task\_102

\*\*Error:\*\* Import resolution in test environment



\*\*Analysis:\*\*

The test setup doesn't support TypeScript path aliases (@/).



\*\*Options:\*\*

1\. Configure test environment for aliases (requires tsconfig.json update)

2\. Use relative imports in all test files

3\. Create path mapping for Jest/Vitest



\*\*Recommendation:\*\* Option 2 (relative imports) for simplicity.



\*\*Action Required:\*\* Human decision on testing approach.

```



\*\*4. Human Resolution\*\*

```bash

\# Human reviews escalation

cat logs/escalations/escalation\_task\_102.md



\# Human decides and documents

cat >> logs/human\_reviews.md << 'EOF'

\## Escalation Resolution: task\_102

\*\*Decision:\*\* Use relative imports in test files

\*\*Rationale:\*\* Simplifies test setup, avoids configuration complexity

\*\*Action:\*\* Updated CODING\_STANDARDS.md to specify test import style

EOF



\# Human creates resolution task

cat >> tasks/queue.json << 'EOF'

{

&nbsp; "id": "task\_102\_resolution",

&nbsp; "type": "code\_generation",

&nbsp; "assigned\_to": "local\_llm\_agent",

&nbsp; "prompt": "Generate unit tests for src/utils/scoring.ts using RELATIVE imports. Example: import { calculateWPM } from '../utils/scoring'. Include edge case tests.",

&nbsp; "priority": 1

}

EOF

```



---



\## Workflow 6: Using Claude API Fallback



\### When to Use

\- Local LLM unavailable or down

\- Task requires capabilities beyond local model

\- Critical task blocking development



\### Budget Tracking



File: `/logs/claude\_usage.json`

```json

{

&nbsp; "budget\_total\_usd": 10.00,

&nbsp; "budget\_remaining\_usd": 10.00,

&nbsp; "buffer\_usd": 2.00,

&nbsp; "max\_spendable\_usd": 8.00,

&nbsp; "calls": \[],

&nbsp; "last\_updated": "2025-02-10T10:00:00Z"

}

```



\### Procedure



\*\*1. Check Budget\*\*

```bash

\# Verify budget available

python tools/check\_claude\_budget.py



\# Output:

\# Budget: $10.00 total, $10.00 remaining

\# Max spendable: $8.00 (keeping $2 buffer)

\# Status: ✅ Available for use

```



\*\*2. Make Fallback Call\*\*

```python

\# tools/claude\_fallback.py



import anthropic

import json

import os

from datetime import datetime



def call\_claude\_with\_budget(prompt, max\_tokens=1000):

&nbsp;   """Call Claude API with budget tracking"""

&nbsp;   

&nbsp;   # Load budget

&nbsp;   with open('logs/claude\_usage.json') as f:

&nbsp;       budget = json.load(f)

&nbsp;   

&nbsp;   # Check budget

&nbsp;   if budget\['budget\_remaining\_usd'] <= budget\['buffer\_usd']:

&nbsp;       raise Exception(f"Budget depleted. Remaining: ${budget\['budget\_remaining\_usd']}")

&nbsp;   

&nbsp;   # Load API key from key.txt

&nbsp;   with open('key.txt') as f:

&nbsp;       api\_key = f.read().strip()

&nbsp;   

&nbsp;   # Make request

&nbsp;   client = anthropic.Anthropic(api\_key=api\_key)

&nbsp;   

&nbsp;   response = client.messages.create(

&nbsp;       model="claude-sonnet-4-20250514",

&nbsp;       max\_tokens=max\_tokens,

&nbsp;       messages=\[{"role": "user", "content": prompt}]

&nbsp;   )

&nbsp;   

&nbsp;   # Estimate cost (rough approximation)

&nbsp;   input\_tokens = len(prompt.split()) \* 1.3  # Rough estimate

&nbsp;   output\_tokens = len(response.content\[0].text.split()) \* 1.3

&nbsp;   

&nbsp;   # Claude Sonnet 4 pricing (example, update with actual)

&nbsp;   cost = (input\_tokens \* 0.000003) + (output\_tokens \* 0.000015)

&nbsp;   

&nbsp;   # Update budget

&nbsp;   budget\['budget\_remaining\_usd'] -= cost

&nbsp;   budget\['calls'].append({

&nbsp;       'timestamp': datetime.now().isoformat(),

&nbsp;       'prompt\_preview': prompt\[:100],

&nbsp;       'tokens\_input': int(input\_tokens),

&nbsp;       'tokens\_output': int(output\_tokens),

&nbsp;       'cost\_usd': round(cost, 4)

&nbsp;   })

&nbsp;   budget\['last\_updated'] = datetime.now().isoformat()

&nbsp;   

&nbsp;   # Save budget

&nbsp;   with open('logs/claude\_usage.json', 'w') as f:

&nbsp;       json.dump(budget, f, indent=2)

&nbsp;   

&nbsp;   print(f"✅ Claude call successful. Cost: ${cost:.4f}, Remaining: ${budget\['budget\_remaining\_usd']:.2f}")

&nbsp;   

&nbsp;   return response.content\[0].text

```



\*\*3. Cache Response Aggressively\*\*

```python

import hashlib



def get\_or\_call\_claude(prompt, max\_tokens=1000, ttl\_hours=24):

&nbsp;   """Cache Claude responses to avoid redundant calls"""

&nbsp;   

&nbsp;   # Generate cache key

&nbsp;   cache\_key = hashlib.sha256(prompt.encode()).hexdigest()

&nbsp;   cache\_file = f'cache/claude\_{cache\_key}.json'

&nbsp;   

&nbsp;   # Check cache

&nbsp;   if os.path.exists(cache\_file):

&nbsp;       with open(cache\_file) as f:

&nbsp;           cached = json.load(f)

&nbsp;       

&nbsp;       # Check TTL

&nbsp;       cached\_time = datetime.fromisoformat(cached\['timestamp'])

&nbsp;       if (datetime.now() - cached\_time).hours < ttl\_hours:

&nbsp;           print(f"✅ Using cached response (age: {(datetime.now() - cached\_time).seconds // 3600}h)")

&nbsp;           return cached\['response']

&nbsp;   

&nbsp;   # Not cached, make call

&nbsp;   response = call\_claude\_with\_budget(prompt, max\_tokens)

&nbsp;   

&nbsp;   # Cache it

&nbsp;   os.makedirs('cache', exist\_ok=True)

&nbsp;   with open(cache\_file, 'w') as f:

&nbsp;       json.dump({

&nbsp;           'prompt': prompt,

&nbsp;           'response': response,

&nbsp;           'timestamp': datetime.now().isoformat()

&nbsp;       }, f, indent=2)

&nbsp;   

&nbsp;   return response

```



\*\*4. Log Fallback Usage\*\*

```bash

\# Update human review log

cat >> logs/human\_reviews.md << 'EOF'



\## Claude API Fallback Used: 2025-02-10 15:30

\*\*Reason:\*\* Local LLM down for maintenance

\*\*Task:\*\* Generate complex TypeScript types for game state

\*\*Cost:\*\* $0.08

\*\*Remaining Budget:\*\* $9.92



\*\*Note:\*\* Cached response for 24 hours. Restarted local LLM immediately after.

EOF

```



\*\*5. Alert if Budget Low\*\*

```bash

\# Automated budget warning

if \[ $(jq '.budget\_remaining\_usd' logs/claude\_usage.json) < 3.00 ]; then

&nbsp;   echo "⚠️ WARNING: Claude API budget below $3.00"

&nbsp;   echo "Consider: "

&nbsp;   echo "  1. Fix local LLM issues"

&nbsp;   echo "  2. Reduce Claude usage"

&nbsp;   echo "  3. Add more budget"

fi

```



---



\## Workflow 7: Creating New Agent Tasks (Gemini)



\### When Gemini Creates Tasks



\*\*Context:\*\*

Gemini has reviewed project state and determined new work is needed.



\*\*Procedure:\*\*



\*\*1. Analyze Phase Requirements\*\*

```markdown

Current Phase: Phase 2 - Game Modes Implementation

Remaining Work:

\- Timed Trial mode logic

\- Road Mode endless runner

\- Quest Chapter system

\- Boss Encounter mechanics



Next Priority: Timed Trial mode (foundational for other modes)

```



\*\*2. Decompose into Tasks\*\*

```markdown

Timed Trial Mode requires:

1\. Timer component (React)

2\. Countdown logic (utility function)

3\. Score calculation at timer end

4\. Results screen component

5\. Integration with game state

```



\*\*3. Create Task Definitions\*\*

```json

{

&nbsp; "id": "task\_301",

&nbsp; "type": "code\_generation",

&nbsp; "assigned\_to": "local\_llm\_agent",

&nbsp; "priority": 1,

&nbsp; "status": "pending",

&nbsp; "created\_at": "2025-02-10T16:00:00Z",

&nbsp; 

&nbsp; "prompt": "Create a React component 'TimerDisplay' for the typing game:\\n\\nRequirements:\\n- Display countdown timer in MM:SS format\\n- Accept props: initialSeconds (number), onComplete (callback)\\n- Use Zustand store for timer state\\n- Visual: Large digital font, red when <10 seconds remaining\\n- Accessible: Include ARIA labels\\n\\nTechnical:\\n- Functional component with hooks\\n- TypeScript strict mode\\n- Use requestAnimationFrame for smooth updates\\n- Clean up interval on unmount\\n\\nOutput: Complete component with JSDoc and prop types",

&nbsp; 

&nbsp; "context": {

&nbsp;   "project\_phase": "phase\_2\_game\_modes",

&nbsp;   "dependencies": \[],

&nbsp;   "related\_files": \[

&nbsp;     "/src/stores/gameStore.ts",

&nbsp;     "/src/components/GameCanvas.tsx"

&nbsp;   ]

&nbsp; },

&nbsp; 

&nbsp; "output\_path": "/outputs/agent\_deliverables/TimerDisplay.tsx",

&nbsp; "output\_format": "typescript",

&nbsp; 

&nbsp; "validation": {

&nbsp;   "custom\_checks": \["/tools/validators/typescript\_check.sh"],

&nbsp;   "required\_fields": \["TimerDisplay component", "TypeScript types", "JSDoc"]

&nbsp; },

&nbsp; 

&nbsp; "callback\_when": "complete",

&nbsp; "estimated\_duration\_minutes": 5,

&nbsp; 

&nbsp; "metadata": {

&nbsp;   "created\_by": "gemini\_v1",

&nbsp;   "parent\_task": null,

&nbsp;   "retry\_count": 0,

&nbsp;   "tags": \["react", "component", "timer", "phase\_2"]

&nbsp; }

}

```



\*\*4. Add Dependencies\*\*

```json

{

&nbsp; "id": "task\_302",

&nbsp; "type": "code\_generation",

&nbsp; "assigned\_to": "local\_llm\_agent",

&nbsp; "priority": 2,

&nbsp; "status": "pending",

&nbsp; 

&nbsp; "prompt": "Create utility function 'calculateTimedTrialScore':\\n\\nInputs:\\n- timeLimit: number (seconds)\\n- timeRemaining: number (seconds)\\n- wordsTyped: number\\n- accuracy: number (0-1)\\n\\nOutput:\\n{\\n  baseScore: number,\\n  timeBonus: number,\\n  accuracyBonus: number,\\n  totalScore: number,\\n  rank: 'S' | 'A' | 'B' | 'C' | 'D'\\n}\\n\\nFormula:\\n- baseScore = wordsTyped \* 100\\n- timeBonus = (timeRemaining / timeLimit) \* 500\\n- accuracyBonus = accuracy \* 300\\n- totalScore = baseScore + timeBonus + accuracyBonus\\n- Rank: S (>1000), A (800-1000), B (600-800), C (400-600), D (<400)\\n\\nInclude comprehensive JSDoc with examples.",

&nbsp; 

&nbsp; "context": {

&nbsp;   "project\_phase": "phase\_2\_game\_modes",

&nbsp;   "dependencies": \["task\_301"],  // Needs timer concept

&nbsp;   "related\_files": \["/src/utils/scoring.ts"]

&nbsp; },

&nbsp; 

&nbsp; "output\_path": "/outputs/agent\_deliverables/calculateTimedTrialScore.ts",

&nbsp; "output\_format": "typescript",

&nbsp; 

&nbsp; "callback\_when": "complete",

&nbsp; "estimated\_duration\_minutes": 4

}

```



\*\*5. Update Task Queue\*\*

```bash

\# Gemini writes updated queue

python tools/update\_task\_queue.py --add task\_301 task\_302



\# Notify agents

echo "new\_tasks\_available" > /tmp/agent\_notification



\# Log decision

cat >> logs/gemini\_decisions.md << 'EOF'

\## Task Creation: 2025-02-10 16:00



\*\*Phase:\*\* Phase 2 - Game Modes

\*\*Priority:\*\* Timed Trial mode



\*\*Tasks Created:\*\*

\- task\_301: TimerDisplay component (React)

\- task\_302: Score calculation (utility)



\*\*Rationale:\*\* Timer display is foundational for all timed modes. Score calculation needed before results screen.



\*\*Dependencies:\*\* task\_302 depends on task\_301 conceptually (timer completion triggers scoring)



\*\*Estimated Completion:\*\* 9 minutes (agent work)

EOF

```



---



\## Workflow 8: Emergency Stop / Rollback



\### When to Use

\- Compliance violation detected

\- Major bug introduced

\- Accidental proprietary data exposure

\- Budget exceeded



\### Procedure



\*\*1. Immediate Halt\*\*

```bash

\# Kill all agent processes

killall -9 agent\_worker

killall -9 ollama

killall -9 python  # If running ComfyUI



\# Create stop flag

touch /tmp/EMERGENCY\_STOP



echo "🚨 EMERGENCY STOP INITIATED"

```



\*\*2. Assess Damage\*\*

```bash

\# Run full compliance check

bash tools/compliance\_check.sh --full



\# Check git status

git status



\# Review recent changes

git diff HEAD~5



\# Check for sensitive data

grep -r "kpmg\\|client\\|confidential" src/ data/ assets/

```



\*\*3. Rollback if Needed\*\*

```bash

\# Find last known good commit

git log --oneline -20



\# Review authorship log for last human approval

cat logs/authorship\_log.md



\# Rollback to last approved state

git reset --hard <last-good-commit>



\# Or create rollback branch

git checkout -b emergency-rollback-$(date +%Y%m%d)

git reset --hard <last-good-commit>

```



\*\*4. Document Incident\*\*

```bash

cat > logs/incidents/incident\_$(date +%Y%m%d\_%H%M).md << 'EOF'

\# Emergency Incident Report



\*\*Date:\*\* 2025-02-10 17:45

\*\*Reported By:\*\* \[Your Name]

\*\*Severity:\*\* High



\## Incident Description

\[Describe what happened]



\## Root Cause

\[What caused the issue]



\## Actions Taken

\- ✅ Halted all agent processes

\- ✅ Rolled back to commit abc123

\- ✅ Removed violating files

\- ✅ Updated procedures to prevent recurrence



\## Impact

\- Files affected: \[list]

\- Data lost: \[none/some]

\- Compliance status: \[resolved/pending]



\## Prevention

\- Updated: \[which procedures]

\- New safeguards: \[describe]



\*\*Status:\*\* RESOLVED

\*\*Reviewed By:\*\* \[Your Name]

EOF

```



\*\*5. Update Procedures\*\*

```bash

\# Add new safeguard to compliance check

cat >> tools/compliance\_check.sh << 'EOF'



\# New check: Scan for specific violation pattern

if grep -r "FORBIDDEN\_PATTERN" src/; then

&nbsp;   echo "❌ VIOLATION: Forbidden pattern detected"

&nbsp;   exit 1

fi

EOF



\# Test updated check

bash tools/compliance\_check.sh

```



\*\*6. Resume Safely\*\*

```bash

\# Clear emergency flag

rm /tmp/EMERGENCY\_STOP



\# Restart agents with extra monitoring

./tools/agent\_worker.sh --agent=llm --verbose \&

tail -f logs/agent\_llm\_$(date +%Y-%m-%d).md



\# Verify compliance

sleep 60

bash tools/compliance\_check.sh

```



---



\## Workflow 9: Phase Completion



\### When a Development Phase Finishes



\*\*1. Phase Completion Checklist\*\*

```markdown

\## Phase 1 Completion Checklist



\### Code Quality

\- \[ ] All TypeScript files compile without errors

\- \[ ] ESLint passes with no violations

\- \[ ] Unit tests written for core utilities

\- \[ ] All tests passing



\### Functionality

\- \[ ] Core typing mechanic works

\- \[ ] WPM calculation accurate

\- \[ ] Score tracking functional

\- \[ ] Visual feedback responsive



\### Documentation

\- \[ ] Code has JSDoc comments

\- \[ ] ARCHITECTURE.md updated

\- \[ ] TASKS.md shows phase complete



\### Compliance

\- \[ ] No copyrighted content

\- \[ ] All work human-reviewed

\- \[ ] Authorship log updated

\- \[ ] No KPMG data present



\### Human Approval

\- \[ ] Full manual test completed

\- \[ ] Visual quality acceptable

\- \[ ] Performance meets requirements (60fps)

```



\*\*2. Human Testing\*\*

```bash

\# Build and test

npm run build

npm run dev



\# Manual testing checklist:

\# - Load game in browser

\# - Start typing session

\# - Verify WPM calculation

\# - Check accuracy tracking

\# - Test edge cases (very fast typing, errors, backspace)

\# - Verify visual feedback

\# - Check performance (open DevTools → Performance)

```



\*\*3. Create Phase Milestone\*\*

```bash

\# Tag release

git tag -a v0.2.0-phase1 -m "Phase 1 Complete: Core Typing Mechanic



Implemented:

\- Word spawning system

\- Typing input detection

\- WPM and accuracy calculation

\- Visual feedback

\- Basic Phaser integration



Human testing: ✅ Passed

Compliance: ✅ Verified



Completed by: \[Your Name]"



git push origin v0.2.0-phase1

```



\*\*4. Update Authorship Log\*\*

```bash

cat >> logs/authorship\_log.md << 'EOF'



\## Phase 1 Completion: 2025-02-10

\*\*Human Author:\*\* \[Your Name]



\### Strategic Decisions Made:

\- Approved WPM formula: (characters / 5) / (seconds / 60)

\- Selected 60fps target for smooth gameplay

\- Chose Zustand over Redux for simpler state management



\### Human Creative Control:

\- Reviewed all 15 agent-generated files

\- Made 8 revisions to improve code quality

\- Rejected 2 outputs for not meeting standards

\- Integrated approved work into /src/



\### AI Contribution:

\- Local LLM generated boilerplate code from specifications

\- Image agent created placeholder sprites

\- All AI work directed by human-written prompts



\*\*Copyright Status:\*\* Human-authored with AI assistance (copyrightable)

EOF

```



\*\*5. Archive Phase Work\*\*

```bash

\# Create phase archive

mkdir -p archive/phase\_1

cp -r src/ archive/phase\_1/src\_snapshot

cp -r docs/ archive/phase\_1/docs\_snapshot

cp logs/human\_reviews.md archive/phase\_1/

cp logs/authorship\_log.md archive/phase\_1/



\# Compress

tar -czf archive/phase\_1\_complete\_$(date +%Y%m%d).tar.gz archive/phase\_1/

```



\*\*6. Prepare for Next Phase\*\*

```bash

\# Update TASKS.md

cat >> docs/TASKS.md << 'EOF'



\## ✅ Phase 1: COMPLETE (2025-02-10)



\## Phase 2: Game Modes (NEXT)



\*\*Goal:\*\* Implement Timed Trial, Road Mode, Quest Chapters, Boss Encounters



\*\*Tasks:\*\*

\- \[ ] Timed Trial mode

\- \[ ] Road Mode endless runner

\- \[ ] Quest system

\- \[ ] Boss encounter mechanics



\*\*Estimated Duration:\*\* 2 weeks

\*\*Start Date:\*\* 2025-02-11

EOF



\# Gemini will read this and begin Phase 2 planning

```



---



\## Appendix: Cron Job Setup



\### Linux/Mac

```bash

\# Edit crontab

crontab -e



\# Add these lines:



\# Run agent worker every hour (checks for tasks)

0 \* \* \* \* cd /home/\[user]/fantasy-typing-game \&\& ./tools/agent\_worker.sh



\# Gemini callback every 6 hours for review

0 \*/6 \* \* \* cd /home/\[user]/fantasy-typing-game \&\& ./tools/gemini\_callback.sh



\# Daily compliance check at 9 AM

0 9 \* \* \* cd /home/\[user]/fantasy-typing-game \&\& bash tools/compliance\_check.sh >> logs/compliance\_daily.log



\# Weekly budget check (Sundays at 6 PM)

0 18 \* \* 0 cd /home/\[user]/fantasy-typing-game \&\& python tools/check\_claude\_budget.py >> logs/budget\_weekly.log

```



\### Windows Task Scheduler

```powershell

\# Run as Administrator in PowerShell



\# Agent worker (hourly)

$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\\Users\\\[user]\\fantasy-typing-game\\tools\\agent\_worker.ps1"

$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1)

Register-ScheduledTask -TaskName "TypingGame-AgentWorker" -Action $Action -Trigger $Trigger



\# Gemini callback (every 6 hours)

$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\\Users\\\[user]\\fantasy-typing-game\\tools\\gemini\_callback.ps1"

$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 6)

Register-ScheduledTask -TaskName "TypingGame-GeminiCallback" -Action $Action -Trigger $Trigger

```



---



\*\*END OF WORKFLOWS DOCUMENTATION\*\*

