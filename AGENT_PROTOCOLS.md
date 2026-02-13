\# Agent Communication Protocols



\*\*Version:\*\* 1.0

\*\*Last Updated:\*\* 2025-02-10

\*\*Compliance:\*\* ✅ Zero-Training Rule Compliant



---



\## Overview



This document defines how agents communicate without violating the Zero-Training Rule. All protocols ensure local agents operate independently without learning from Gemini's reasoning.



---



\## Protocol 1: Task Queue Format



\### Complete Task Schema

````json

{

&nbsp; "id": "string (unique, e.g., task\_001)",

&nbsp; "type": "enum (code\_generation|content\_generation|asset\_generation|testing|documentation)",

&nbsp; "assigned\_to": "enum (local\_llm\_agent|image\_gen\_agent|human)",

&nbsp; "priority": "integer (1-10, 1=highest)",

&nbsp; "status": "enum (pending|in\_progress|complete|failed|approved|rejected)",

&nbsp; "created\_at": "ISO8601 datetime",

&nbsp; "started\_at": "ISO8601 datetime|null",

&nbsp; "completed\_at": "ISO8601 datetime|null",

&nbsp; 

&nbsp; "prompt": "string (standalone, self-contained task instruction)",

&nbsp; "context": {

&nbsp;   "project\_phase": "string (e.g., phase\_1\_core\_mechanics)",

&nbsp;   "dependencies": \["array of task\_ids that must complete first"],

&nbsp;   "related\_files": \["array of file paths for reference"]

&nbsp; },

&nbsp; 

&nbsp; "output\_path": "string (where agent saves result)",

&nbsp; "output\_format": "string (json|typescript|png|md)",

&nbsp; 

&nbsp; "validation": {

&nbsp;   "schema": "string (path to JSON schema)|null",

&nbsp;   "min\_length": "integer|null",

&nbsp;   "max\_length": "integer|null",

&nbsp;   "required\_fields": \["array of required keys"],

&nbsp;   "custom\_checks": \["array of validation script paths"]

&nbsp; },

&nbsp; 

&nbsp; "callback\_when": "enum (complete|immediate|on\_approval|never)",

&nbsp; "estimated\_duration\_minutes": "integer",

&nbsp; 

&nbsp; "metadata": {

&nbsp;   "created\_by": "string (gemini\_v1|human)",

&nbsp;   "parent\_task": "string (task\_id if this is a revision)|null",

&nbsp;   "retry\_count": "integer",

&nbsp;   "tags": \["array of strings for filtering"]

&nbsp; }

}

````



\### Example Tasks



\*\*Code Generation Task:\*\*

````json

{

&nbsp; "id": "task\_101",

&nbsp; "type": "code\_generation",

&nbsp; "assigned\_to": "local\_llm\_agent",

&nbsp; "priority": 1,

&nbsp; "status": "pending",

&nbsp; "created\_at": "2025-02-10T10:00:00Z",

&nbsp; 

&nbsp; "prompt": "Create a TypeScript utility function 'calculateWPM' that:\\n- Takes: array of keystroke timestamps, total characters typed\\n- Returns: { wpm: number, rawWpm: number, accuracy: number }\\n- Formula: WPM = (chars / 5) / (time\_seconds / 60)\\n- Include JSDoc comments\\n- Export as named export\\n- Use strict typing (no 'any')",

&nbsp; 

&nbsp; "context": {

&nbsp;   "project\_phase": "phase\_1\_core\_mechanics",

&nbsp;   "dependencies": \[],

&nbsp;   "related\_files": \["/src/types/game.types.ts"]

&nbsp; },

&nbsp; 

&nbsp; "output\_path": "/outputs/agent\_deliverables/calculateWPM.ts",

&nbsp; "output\_format": "typescript",

&nbsp; 

&nbsp; "validation": {

&nbsp;   "custom\_checks": \["/tools/validators/typescript\_check.sh"],

&nbsp;   "required\_fields": \["calculateWPM function", "JSDoc", "export"]

&nbsp; },

&nbsp; 

&nbsp; "callback\_when": "complete",

&nbsp; "estimated\_duration\_minutes": 3

}

````



\*\*Asset Generation Task:\*\*

````json

{

&nbsp; "id": "task\_201",

&nbsp; "type": "asset\_generation",

&nbsp; "assigned\_to": "image\_gen\_agent",

&nbsp; "priority": 2,

&nbsp; "status": "pending",

&nbsp; "created\_at": "2025-02-10T10:05:00Z",

&nbsp; 

&nbsp; "prompt": "Generate pixel art sprite: enemy goblin creature, side view, attacking pose, aggressive stance",

&nbsp; 

&nbsp; "context": {

&nbsp;   "project\_phase": "phase\_2\_visual\_assets",

&nbsp;   "dependencies": \["task\_200"],

&nbsp;   "related\_files": \["/docs/ART\_STYLE\_GUIDE.md"]

&nbsp; },

&nbsp; 

&nbsp; "output\_path": "/outputs/agent\_deliverables/sprites/goblin\_attack\_32x32.png",

&nbsp; "output\_format": "png",

&nbsp; 

&nbsp; "parameters": {

&nbsp;   "width": 32,

&nbsp;   "height": 32,

&nbsp;   "style": "pixel art, retro game, 16-bit era, limited palette (16 colors max)",

&nbsp;   "negative\_prompt": "blurry, realistic, 3D, modern, high resolution",

&nbsp;   "seed": 12345,

&nbsp;   "steps": 20,

&nbsp;   "cfg\_scale": 7.0

&nbsp; },

&nbsp; 

&nbsp; "validation": {

&nbsp;   "min\_width": 32,

&nbsp;   "max\_width": 32,

&nbsp;   "min\_height": 32,

&nbsp;   "max\_height": 32,

&nbsp;   "format": "PNG",

&nbsp;   "transparency": true

&nbsp; },

&nbsp; 

&nbsp; "callback\_when": "complete",

&nbsp; "estimated\_duration\_minutes": 2

}

````



---



\## Protocol 2: Agent Status Reporting



\### Status Update Format



File: `/logs/agent\_status.json`

````json

{

&nbsp; "last\_updated": "2025-02-10T14:30:00Z",

&nbsp; "agents": \[

&nbsp;   {

&nbsp;     "agent\_id": "llm\_agent\_1",

&nbsp;     "type": "local\_llm",

&nbsp;     "status": "active",

&nbsp;     "model": "llama3.2:3b",

&nbsp;     "endpoint": "http://localhost:11434",

&nbsp;     "tasks\_completed\_session": 5,

&nbsp;     "tasks\_failed\_session": 1,

&nbsp;     "current\_task": "task\_105",

&nbsp;     "health": "healthy",

&nbsp;     "last\_heartbeat": "2025-02-10T14:29:55Z"

&nbsp;   },

&nbsp;   {

&nbsp;     "agent\_id": "image\_agent\_1",

&nbsp;     "type": "image\_generation",

&nbsp;     "status": "active",

&nbsp;     "model": "SD1.5",

&nbsp;     "endpoint": "http://localhost:8188",

&nbsp;     "tasks\_completed\_session": 3,

&nbsp;     "tasks\_failed\_session": 0,

&nbsp;     "current\_task": null,

&nbsp;     "health": "healthy",

&nbsp;     "last\_heartbeat": "2025-02-10T14:29:50Z"

&nbsp;   }

&nbsp; ],

&nbsp; "session\_start": "2025-02-10T10:00:00Z",

&nbsp; "total\_tasks\_completed": 8,

&nbsp; "total\_tasks\_failed": 1,

&nbsp; "callback\_requested": false

}

````



\### Heartbeat Protocol



Agents send heartbeats every 60 seconds:

````json

{

&nbsp; "agent\_id": "llm\_agent\_1",

&nbsp; "timestamp": "2025-02-10T14:30:00Z",

&nbsp; "status": "active|idle|busy|error",

&nbsp; "current\_task\_id": "task\_105|null",

&nbsp; "uptime\_seconds": 15600,

&nbsp; "memory\_usage\_mb": 2048,

&nbsp; "gpu\_usage\_percent": 75

}

````



---



\## Protocol 3: Work Logging



\### Task Execution Log



File: `/logs/agent\_llm\_2025-02-10.md`

````markdown

\# LLM Agent Work Log - 2025-02-10



\## Session Start: 10:00:00

\*\*Model:\*\* llama3.2:3b (Ollama)

\*\*Endpoint:\*\* http://localhost:11434



---



\## Task: task\_101

\*\*Started:\*\* 10:05:23

\*\*Completed:\*\* 10:08:15

\*\*Duration:\*\* 2m 52s

\*\*Status:\*\* ✅ SUCCESS



\### Prompt

````

Create a TypeScript utility function 'calculateWPM' that:

\- Takes: array of keystroke timestamps, total characters typed

\- Returns: { wpm: number, rawWpm: number, accuracy: number }

\[...full prompt...]

````



\### Output

\- File: `/outputs/agent\_deliverables/calculateWPM.ts`

\- Lines: 45

\- Validation: ✅ TypeScript check passed



\### Notes

\- Used helper function for time delta calculation

\- Added edge case handling for empty keystroke array

\- Included comprehensive JSDoc with examples



---



\## Task: task\_102

\*\*Started:\*\* 10:10:00

\*\*Completed:\*\* 10:11:30

\*\*Duration:\*\* 1m 30s

\*\*Status:\*\* ❌ FAILED



\### Prompt

````

Generate unit tests for calculateWPM function...

````



\### Error

````

Import resolution failed: Cannot find module '@/utils/calculateWPM'

Path may need adjustment for test environment.

````



\### Retry Strategy

\- Logged error to `/logs/agent\_errors.json`

\- Marked task as failed in queue

\- Awaiting Gemini callback for guidance



---



\## Session Summary

\*\*Total Tasks:\*\* 5

\*\*Successful:\*\* 4

\*\*Failed:\*\* 1

\*\*Average Duration:\*\* 2m 15s

\*\*Callback Requested:\*\* Yes (due to failure threshold)



\*\*End of Log\*\*

````



\### Image Generation Log



File: `/logs/agent\_image\_2025-02-10.md`

````markdown

\# Image Agent Work Log - 2025-02-10



\## Session Start: 10:00:00

\*\*Model:\*\* Stable Diffusion 1.5

\*\*Interface:\*\* ComfyUI

\*\*Endpoint:\*\* http://localhost:8188



---



\## Task: task\_201

\*\*Started:\*\* 10:15:00

\*\*Completed:\*\* 10:16:45

\*\*Duration:\*\* 1m 45s

\*\*Status:\*\* ✅ SUCCESS



\### Prompt

````

Generate pixel art sprite: enemy goblin creature, side view, attacking pose, aggressive stance

Parameters
json{
  "width": 32,
  "height": 32,
  "style": "pixel art, retro game, 16-bit era, limited palette",
  "negative_prompt": "blurry, realistic, 3D",
  "seed": 12345,
  "steps": 20,
  "cfg_scale": 7.0
}
Output

File: /outputs/agent_deliverables/sprites/goblin_attack_32x32.png
Dimensions: 32x32 (validated ✅)
Format: PNG with transparency
File Size: 847 bytes
Color Palette: 14 unique colors (within limit ✅)

Generation Metadata
json{
  "model": "sd_v1-5_pixelart.ckpt",
  "sampler": "euler_a",
  "actual_steps": 20,
  "seed_used": 12345,
  "cfg_scale": 7.0,
  "generation_time_seconds": 3.2
}
````

### Quality Checks
- ✅ Dimensions correct
- ✅ Transparency present
- ✅ Pixel art style achieved
- ✅ No anti-aliasing artifacts
- ⚠️ Colors may need manual palette reduction

### Notes
- Sprite shows clear attacking motion
- Style consistent with retro game aesthetic
- Recommend human review for color palette approval

---

**End of Log**
````

---

## Protocol 4: Error Reporting

### Error Log Format

File: `/logs/agent_errors.json`
````json
{
  "errors": [
    {
      "error_id": "err_001",
      "timestamp": "2025-02-10T10:11:30Z",
      "agent_id": "llm_agent_1",
      "task_id": "task_102",
      "error_type": "import_resolution_error",
      "severity": "medium",
      "message": "Cannot find module '@/utils/calculateWPM'",
      "stack_trace": "...",
      "retry_count": 0,
      "max_retries": 3,
      "resolved": false,
      "resolution_notes": null
    }
  ]
}
````

### Error Escalation
````
Agent Error
    ↓
Retry (3 attempts with exponential backoff)
    ↓
Still failing?
    ↓
Log to agent_errors.json
    ↓
Mark task as 'failed' in queue
    ↓
Trigger callback_requested = true
    ↓
Gemini investigates on next callback
    ↓
Gemini creates revision task with fix OR escalates to human
````

---

## Protocol 5: Human Review Handoff

### Review Request Format

File: `/logs/review_requests/request_2025-02-10_14-00.md`
````markdown
# Human Review Request
**Generated By:** gemini_orchestrator
**Date:** 2025-02-10 14:00:00
**Session:** callback_004

---

## Completed Tasks Awaiting Approval

### 1. task_101: calculateWPM Function ✅ RECOMMEND APPROVAL

**Output:** `/outputs/agent_deliverables/calculateWPM.ts`

**Quality Assessment:**
- ✅ TypeScript strict mode compliant
- ✅ Comprehensive JSDoc comments
- ✅ Edge cases handled (empty array, single keystroke)
- ✅ Correct WPM formula implementation
- ✅ No external dependencies

**Code Preview:**
```typescript
/**
 * Calculates typing speed metrics from keystroke data
 * @param keystrokes - Array of keystroke timestamps
 * @param totalChars - Total characters typed
 * @returns Typing metrics including WPM and accuracy
 */
export function calculateWPM(
  keystrokes: number[],
  totalChars: number
): { wpm: number; rawWpm: number; accuracy: number } {
  // ... [implementation] ...
}
```

**Recommendation:** APPROVE
**Integration Path:** Move to `/src/utils/scoring.ts`

---

### 2. task_201: Goblin Sprite ⚠️ RECOMMEND REVISION

**Output:** `/outputs/agent_deliverables/sprites/goblin_attack_32x32.png`

**Quality Assessment:**
- ✅ Correct dimensions (32x32)
- ✅ Transparency present
- ✅ Pixel art style
- ⚠️ 14 colors used (recommend reducing to 8 for consistency)
- ⚠️ Attack motion unclear in static frame

**Visual Preview:** [Image would be displayed here]

**Issues:**
1. Color palette exceeds style guide recommendation (8 colors max)
2. Attacking pose ambiguous - could be mistaken for idle

**Recommendation:** REQUEST REVISION
**Suggested Changes:**
- Reduce to 8-color palette
- Exaggerate weapon swing motion
- Add more aggressive lean forward

**Revision Task:** Already created as task_201_rev1

---

## Failed Tasks Requiring Attention

### 3. task_102: calculateWPM Unit Tests ❌ FAILED

**Error:** Import resolution issue

**Root Cause Analysis:**
Test file used path alias `@/utils/calculateWPM` but test environment not configured for aliases.

**Proposed Solution:**
Update test configuration to support TypeScript path aliases OR use relative imports in tests.

**Action Required:** Human decision on test configuration strategy

---

## Summary

**Approvals Recommended:** 1
**Revisions Recommended:** 1
**Failures Requiring Investigation:** 1

**Next Steps:**
1. Human reviews this document
2. Human approves/rejects each task
3. Human logs decisions in `/logs/human_reviews.md`
4. Gemini proceeds with approved tasks and revision tasks

**Estimated Review Time:** 10 minutes

---

**END OF REVIEW REQUEST**
````

---

## Protocol 6: Validation and Quality Gates

### Automated Validation
````bash
#!/bin/bash
# tools/validators/typescript_check.sh

FILE=$1

echo "Validating TypeScript file: $FILE"

# Check 1: TypeScript compilation
npx tsc --noEmit $FILE
if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Check 2: Linting
npx eslint $FILE
if [ $? -ne 0 ]; then
    echo "❌ ESLint violations found"
    exit 1
fi

# Check 3: No 'any' types
if grep -q ": any" $FILE; then
    echo "❌ Forbidden 'any' type found"
    exit 1
fi

# Check 4: JSDoc present
if ! grep -q "@param\|@returns" $FILE; then
    echo "⚠️ Warning: Missing JSDoc comments"
fi

echo "✅ Validation passed"
exit 0
````

### Quality Checklist

Every task output must pass:
- [ ] Automated validation (if applicable)
- [ ] Schema validation (for JSON outputs)
- [ ] Style guide compliance
- [ ] Legal compliance (no copyrighted content)
- [ ] Originality check (for creative content)

---

## Protocol 7: Zero-Training Compliance

### Prohibited Patterns

❌ **NEVER** do this:
````json
{
  "prompt": "Here is how Gemini solved a similar problem: [Gemini output]. Now do the same for this task."
}
````

❌ **NEVER** do this:
````json
{
  "training_data": [
    {"input": "task description", "output": "gemini's solution"}
  ]
}
````

### Compliant Patterns

✅ **DO** this:
````json
{
  "prompt": "Generate a TypeScript function that calculates WPM. Requirements: [specific requirements]. Use this formula: [formula]. Follow this code style: [style rules]."
}
````

✅ **DO** this:
````json
{
  "context": {
    "related_files": ["/docs/CODING_STANDARDS.md"],
    "examples": ["/examples/similar_function.ts"]
  }
}
````

### Compliance Verification
````python
# tools/check_zero_training_compliance.py

import json

def check_task_compliance(task):
    """Verify task doesn't violate Zero-Training Rule"""
    
    violations = []
    
    # Check 1: No Gemini outputs in prompt
    if "gemini" in task["prompt"].lower():
        violations.append("Gemini reference in prompt")
    
    # Check 2: No "learning" language
    prohibited_terms = ["learn from", "training data", "fine-tune"]
    for term in prohibited_terms:
        if term in task["prompt"].lower():
            violations.append(f"Prohibited term: {term}")
    
    # Check 3: Standalone prompt (no external context required)
    if "previous response" in task["prompt"].lower():
        violations.append("Reference to previous AI response")
    
    return len(violations) == 0, violations

# Run on all tasks before adding to queue
````

---

## Appendix: Message Flow Diagrams

### Typical Task Lifecycle
````
[Gemini Callback]
      ↓
  Plan Phase
      ↓
[Create Task in Queue]
      ↓
   (time passes)
      ↓
[Local Agent Picks Up Task]
      ↓
[Agent Executes Task]
      ↓
[Agent Saves Output to /outputs/]
      ↓
[Agent Updates Queue Status]
      ↓
[Agent Logs Work]
      ↓
   (time passes)
      ↓
[Next Gemini Callback Triggered]
      ↓
[Gemini Reads Outputs]
      ↓
[Gemini Generates Review Request]
      ↓
[Human Reviews]
      ↓
[Human Approves/Rejects]
      ↓
[If Approved: Move to /src/ or /assets/]
[If Rejected: Create Revision Task]
````

**END OF AGENT PROTOCOLS**

