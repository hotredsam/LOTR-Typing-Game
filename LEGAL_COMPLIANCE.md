# Legal and Compliance Framework

**Last Updated:** 2025-02-10
**Reviewed By:** [Your Name]
**Status:** ACTIVE - MANDATORY COMPLIANCE

---

## Overview

This project operates under strict legal and ethical guidelines to ensure:
1. Compliance with Google AI Terms of Service
2. Protection of intellectual property rights
3. Professional separation from KPMG employment
4. Adherence to AI usage best practices

**CRITICAL:** All contributors (human and AI) must follow these rules without exception.

---

## 1. Zero-Training Rule (Google TOS Compliance)

### Prohibited Activities
❌ **NEVER** use Gemini output to:
- Fine-tune local model weights
- Train or improve local model architecture
- Create synthetic training datasets from Gemini responses
- Use Gemini output as "ground truth" labels for model improvement

### Reason
Google Terms of Service explicitly prohibit using Gemini output to train "Competitor Models." Local LLMs (Ollama, LMStudio, etc.) are classified as competitor models.

### Allowed Usage
✅ Gemini may:
- Generate task instructions for local models to execute
- Review local model outputs for quality
- Provide strategic direction and architecture decisions
- Create prompts that local models execute independently

### Implementation
- Local models operate as **workers**, not **students**
- They execute specific prompts, not learn from Gemini's reasoning
- All task queues contain standalone prompts with no Gemini output embedded
- Logs clearly separate: "Gemini Strategy" vs "Local Agent Execution"

### Verification
File: `/logs/compliance_check.json`
````json
{
  "zero_training_rule": {
    "status": "compliant",
    "last_audit": "2025-02-10",
    "violations": 0,
    "verification": "No Gemini outputs found in local model training data"
  }
}
````

---

## 2. Human-in-the-Loop Architecture

### Requirement
All automated agent work MUST be reviewed and approved by a human before integration into the main project.

### Callback Review Process
When Gemini is invoked for scheduled callbacks:

1. **Review Phase** (Human Required)
   - Human reads `/logs/agent_status.json`
   - Human inspects `/outputs/agent_deliverables/`
   - Human verifies quality against `/docs/QUALITY_STANDARDS.md`

2. **Approval Gate** (Human Decision)
   - ✅ Approve: Move outputs to `/src/` or `/assets/`
   - ⚠️ Revise: Create revision task in queue
   - ❌ Reject: Document reason, discard output

3. **Gemini Integration** (After Human Approval)
   - Gemini updates project documentation
   - Gemini generates next task queue
   - Gemini logs strategic decisions

### Documentation
File: `/logs/human_reviews.md`
````markdown
# Human Review Log

## Review Session: 2025-02-10 14:00
**Reviewer:** [Your Name]
**Agent Outputs Reviewed:** 5

### Approvals
- ✅ task_001: Location names (moved to /src/data/locations.json)
- ✅ task_003: Daily quest template (approved with minor edits)

### Revisions Requested
- ⚠️ task_002: Warrior sprite too complex for 32x32 (created revision task)

### Rejections
- ❌ task_004: Enemy names too similar to D&D monsters (copyright risk)

**Next Actions:** Updated task queue with revisions, approved Gemini to proceed with Phase 2.
````

### Automated Prevention
- No direct file writes to `/src/` or `/assets/` by agents
- All agent outputs go to `/outputs/agent_deliverables/` (quarantine)
- `git` branch protection: only human can merge to `main`

---

## 3. Data Isolation (Professional Separation)

### Professional Context
User is employed at KPMG in Anchorage, Alaska.
This project is **strictly personal** and **completely separate** from professional work.

### Prohibited Data Sources
❌ **NEVER** use:
- KPMG client data
- Proprietary firm methodologies
- Internal audit templates or frameworks
- Any data accessed through firm credentials
- Professional contacts or business relationships

### Allowed Data Sources
✅ **ONLY** use:
- Open-source code libraries
- Public domain word lists
- Creative Commons assets
- Original human-authored content
- Outputs from personal local AI models

### Infrastructure Isolation
- **Hardware:** Personal laptop/desktop ONLY
- **Network:** Personal home internet (never firm VPN)
- **Storage:** Personal cloud storage if needed (never firm OneDrive/SharePoint)
- **Git Repos:** Personal GitHub/GitLab (never firm version control)

### Time Isolation
- Work on project during personal time only
- No development during work hours
- No use of firm-provided equipment

### Documentation
File: `/docs/DATA_SOURCES.md` (maintain updated list)
````markdown
# Data Sources Registry

## Dictionary Data
- Source: SCOWL (Spell Checker Oriented Word Lists)
- License: Public Domain
- URL: http://wordlist.aspell.net/

## Pixel Art References
- Source: OpenGameArt.org (CC0 licensed assets for style reference)
- License: CC0 1.0 Universal
- URL: https://opengameart.org/

## Code Libraries
- Phaser 3: MIT License
- React: MIT License
- [Full list in package.json]

## AI Models (Local)
- Ollama llama3.2:3b (Personal installation)
- ComfyUI with SD 1.5 (Personal installation)
````

---

## 4. Authorship Log (Copyright Protection)

### Purpose
U.S. Copyright Office currently requires "human authorship" for copyright protection. Purely AI-generated content without human creative control is not copyrightable.

### Requirements
To maintain copyright protection of this game:
1. **Document human creative decisions**
2. **Log human-written master prompts**
3. **Record strategic reviews and approvals**
4. **Demonstrate human creative control over AI outputs**

### Authorship Documentation
File: `/logs/authorship_log.md`
````markdown
# Authorship Log - Fantasy Typing Game

## Human Creative Contributions

### Game Concept (100% Human)
- **Author:** [Your Name]
- **Date:** 2025-02-10
- **Contribution:** Original game concept, fantasy theme, typing mechanic fusion, progression system design

### Master Prompts (Human-Authored)
All prompts directing Gemini and local agents are human-written strategic instructions.

#### Master Prompt v1.0
- **Author:** [Your Name]
- **Date:** 2025-02-10
- **Purpose:** Initial project orchestration
- **File:** `/prompts/gemini_orchestrator_v1.md`

### Strategic Design Decisions (Human)
- **Game Modes:** Selected Road, Timed, Quest, Boss modes (human decision)
- **Art Style:** Chose cozy pixel aesthetic inspired by Stardew Valley (human creative direction)
- **Fantasy Theme:** Defined "harsh consonant mystical" naming style (human aesthetic choice)

### AI-Assisted Execution (Human-Directed)
- **Code Generation:** Local LLM generated React components from human specifications
- **Asset Generation:** ComfyUI generated sprites from human-written prompts
- **Content Generation:** Local LLM generated word lists from human-defined parameters

**Key Distinction:** AI executed tasks; human provided creative vision, approval, and integration.

## Review Checkpoints (Human Oversight)
| Date | Reviewer | Outputs Reviewed | Approvals | Revisions | Strategic Changes |
|------|----------|------------------|-----------|-----------|-------------------|
| 2025-02-10 | [Your Name] | 5 tasks | 3 | 1 | Added boss mode concept |
````

### Master Prompt Versioning
File: `/prompts/gemini_orchestrator_v1.md` (version controlled)
````markdown
# Gemini Orchestrator Prompt v1.0
**Author:** [Your Name]
**Date:** 2025-02-10
**Human Creative Control:** This prompt represents my strategic vision for project execution.

[Full prompt content...]

---
**Version History:**
- v1.0 (2025-02-10): Initial orchestrator prompt [Your Name]
````

---

## 5. Compliance Monitoring

### Automated Checks
Script: `/tools/compliance_check.sh`
````bash
#!/bin/bash
# Compliance verification script

echo "Running compliance checks..."

# Check 1: No Gemini outputs in training data
if grep -r "gemini_output" /data/training/ 2>/dev/null; then
    echo "❌ VIOLATION: Gemini output found in training data"
    exit 1
fi

# Check 2: Human review logs exist
if [ ! -f "/logs/human_reviews.md" ]; then
    echo "⚠️ WARNING: No human review log found"
fi

# Check 3: Authorship log exists
if [ ! -f "/logs/authorship_log.md" ]; then
    echo "⚠️ WARNING: No authorship log found"
fi

# Check 4: Data isolation
if grep -r "kpmg\|client\|audit" /src/ /data/ 2>/dev/null; then
    echo "❌ VIOLATION: Professional data references found"
    exit 1
fi

echo "✅ Compliance checks passed"
````

### Manual Review Checklist
Every callback session:
- [ ] Review all agent outputs before integration
- [ ] Update `/logs/human_reviews.md`
- [ ] Update `/logs/authorship_log.md` if strategic decisions made
- [ ] Verify no proprietary data used
- [ ] Confirm no Gemini output used for training

### Quarterly Audit
Every 3 months:
- [ ] Full repository scan for compliance
- [ ] Review all logs for violations
- [ ] Update legal framework if needed
- [ ] Archive compliance reports

---

## 6. Emergency Procedures

### If Compliance Violation Detected
1. **STOP** all automated agent work immediately
2. Quarantine affected outputs (move to `/quarantine/`)
3. Document violation in `/logs/violations.md`
4. Remove violating content from repository
5. Update procedures to prevent recurrence
6. Resume only after human review

### If Professional Data Accidentally Introduced
1. **IMMEDIATE** deletion of affected files
2. Git history rewrite to remove data
3. Document incident in `/logs/incidents.md`
4. Review data isolation procedures
5. Report to KPMG compliance if required by policy

---

## 7. Acknowledgment

By contributing to this project (human or AI agent), you acknowledge:

✅ You have read this compliance framework
✅ You will follow all rules without exception
✅ You understand the legal and professional risks of non-compliance
✅ You will report any violations immediately

**Human Acknowledgment:**
- Name: [Your Name]
- Date: 2025-02-10
- Signature: [Digital signature or typed name]

---

## References

- Google AI Terms of Service: https://ai.google.dev/gemini-api/terms
- U.S. Copyright Office AI Guidance: https://copyright.gov/ai/
- KPMG Code of Conduct: [Internal reference if applicable]

**END OF LEGAL COMPLIANCE FRAMEWORK**