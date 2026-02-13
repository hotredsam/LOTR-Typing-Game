\# Human-Gemini Communication System



\*\*Version:\*\* 1.0

\*\*Last Updated:\*\* 2025-02-10



---



\## Overview



This system allows you (the human) to give Gemini instructions while it's running autonomously, without needing to manually invoke it each time.



---



\## Communication Folder: `/sams\_instructions\_drop/`



\### Purpose

A dedicated folder where you can drop `.txt` files with instructions for Gemini to process during its next callback.



\### How It Works



\*\*1. You drop an instruction file:\*\*

```

/sams\_instructions\_drop/

&nbsp; └── 2025-02-10\_1430\_fix\_sprite\_colors.txt

```



\*\*2. Gemini checks this folder on every callback:\*\*

\- Reads all `.txt` files in the folder

\- Processes your instructions

\- Creates a formatted Word document with:

&nbsp; - Your original instructions

&nbsp; - Summary of how Gemini addressed each instruction

&nbsp; - Timestamp and status

\- Deletes the `.txt` file after processing

\- Moves the `.docx` to the same folder



\*\*3. Result:\*\*

```

/sams\_instructions\_drop/

&nbsp; └── INSTRUCTION\_LOG.docx  (continuously updated, most recent on top)

```



---



\## Instruction File Format



\*\*Simple text file - no special formatting needed:\*\*

```

\# /sams\_instructions\_drop/new\_instruction.txt



Priority: High



Issue: The goblin sprites are using too many colors



Instructions:

\- Limit all enemy sprites to 6 colors max

\- Regenerate goblin, skeleton, and bat sprites

\- Update the art style guide



Expected outcome: All enemy sprites have consistent, limited palette

```



\*\*Or even simpler:\*\*

```

Fix: Boss health bar not displaying correctly in Road Mode



Please investigate and fix the health bar issue

```



---



\## Word Document Output Format



Gemini will create/update `/sams\_instructions\_drop/INSTRUCTION\_LOG.docx`:

```

════════════════════════════════════════════════════════════

INSTRUCTION LOG - Fantasy Typing Game

Last Updated: 2025-02-10 14:30:00

════════════════════════════════════════════════════════════



┌─────────────────────────────────────────────────────────┐

│ INSTRUCTION #12 - 2025-02-10 14:30                      │

│ Status: ✅ COMPLETED                                    │

└─────────────────────────────────────────────────────────┘



YOUR INSTRUCTIONS:

─────────────────

Priority: High



Issue: The goblin sprites are using too many colors



Instructions:

\- Limit all enemy sprites to 6 colors max

\- Regenerate goblin, skeleton, and bat sprites

\- Update the art style guide



Expected outcome: All enemy sprites have consistent, limited palette



HOW GEMINI ADDRESSED THIS:

───────────────────────────

✅ Action 1: Updated /docs/ART\_STYLE\_GUIDE.md

&nbsp;  - Added 6-color maximum rule for enemy sprites

&nbsp;  - Defined approved color palette



✅ Action 2: Created revision tasks

&nbsp;  - task\_301\_rev: Regenerate goblin sprite (6 colors)

&nbsp;  - task\_302\_rev: Regenerate skeleton sprite (6 colors)

&nbsp;  - task\_303\_rev: Regenerate bat sprite (6 colors)



✅ Action 3: Updated validation script

&nbsp;  - Modified sprite\_check.py to enforce 6-color limit

&nbsp;  - Added to automated quality checks



⏳ Action 4: Waiting for image agent

&nbsp;  - Tasks queued, estimated completion: 15 minutes

&nbsp;  - Will require human review after generation



SUMMARY:

────────

All enemy sprites will be regenerated with 6-color limit.

Art style guide updated. Validation automated.

Awaiting image generation completion.



════════════════════════════════════════════════════════════



┌─────────────────────────────────────────────────────────┐

│ INSTRUCTION #11 - 2025-02-09 16:45                      │

│ Status: ✅ COMPLETED                                    │

└─────────────────────────────────────────────────────────┘



\[Previous instruction log...]



════════════════════════════════════════════════════════════

```



---



\## Red Text Refinements



\*\*You can add red text in the Word document for follow-up instructions:\*\*



Example:

```

\[In red text in the Word doc]

"Actually, make it 8 colors instead of 6 - 6 is too limiting for boss sprites"

```



\*\*Gemini will:\*\*

\- Detect red text on next callback

\- Process as new instruction

\- Create new entry in the log

\- Clear the red text after processing



---



\## Advanced Features



\### Priority Levels



Gemini will process in this order:

1\. \*\*Critical\*\* - Compliance violations, bugs blocking development

2\. \*\*High\*\* - Feature requests, quality issues

3\. \*\*Medium\*\* - Improvements, optimizations

4\. \*\*Low\*\* - Nice-to-haves, future enhancements



\*\*How to set priority:\*\*

```

Priority: Critical

\[your instruction]

```



\### Multi-Part Instructions



\*\*You can give multiple instructions in one file:\*\*

```

Instruction 1: Fix the timer display bug

Instruction 2: Add sound effects to word completion

Instruction 3: Update README with new screenshots

```



Gemini will address each separately in the log.



\### Tags for Organization



\*\*Tag instructions for tracking:\*\*

```

Tags: #ui #bug #phase2



\[your instruction]

```



Gemini will maintain a tag index in the Word doc.



---



\## Auto-Processing Rules



\### Gemini checks `/sams\_instructions\_drop/` every callback:



1\. \*\*Read all `.txt` files\*\* (alphabetically)

2\. \*\*Process each instruction:\*\*

&nbsp;  - Parse priority and content

&nbsp;  - Create tasks or take immediate action

&nbsp;  - Log response to Word doc

3\. \*\*Update INSTRUCTION\_LOG.docx:\*\*

&nbsp;  - Add new entry at top

&nbsp;  - Format with status indicators

&nbsp;  - Include timestamp

4\. \*\*Delete processed `.txt` files\*\*

5\. \*\*Check for red text\*\* in existing Word doc

6\. \*\*Report summary\*\* to terminal/log



---



\## Emergency Override



\*\*For urgent issues, create a file named:\*\*

```

/sams\_instructions\_drop/EMERGENCY.txt

```



Gemini will:

\- Process immediately (before other tasks)

\- Pause all agent work until addressed

\- Send priority notification

\- Require human confirmation after fix



---



\## Example Workflow



\*\*You notice an issue during the day:\*\*

```bash

\# 1. Create quick instruction file

echo "The WPM calculation seems off by 10%. Please investigate and fix." > \\

&nbsp; /sams\_instructions\_drop/fix\_wpm\_calc.txt



\# 2. Gemini processes on next callback (within 6 hours)

\# 3. Check the Word doc for Gemini's response

open /sams\_instructions\_drop/INSTRUCTION\_LOG.docx



\# 4. Add red text if you want refinements

\# "Also check the accuracy calculation while you're at it"



\# 5. Gemini processes red text on next callback

```



---



\## Benefits



✅ \*\*Asynchronous communication\*\* - No need to wait for Gemini

✅ \*\*Audit trail\*\* - All instructions documented

✅ \*\*Structured responses\*\* - Clear action items

✅ \*\*Iterative refinement\*\* - Red text for follow-ups

✅ \*\*Professional formatting\*\* - Word doc easy to read/share

✅ \*\*Time-stamped\*\* - Track when issues were addressed



---



\## Files Created by This System

```

/sams\_instructions\_drop/

├── INSTRUCTION\_LOG.docx          # Main instruction log (auto-updated)

├── \[your .txt files]              # Your instructions (auto-deleted after processing)

└── archive/                       # Optional: archived old logs

&nbsp;   └── INSTRUCTION\_LOG\_2025-01.docx

```



---



\## Gemini Integration



\*\*Gemini's callback workflow includes:\*\*

```markdown

Step 1: Check /sams\_instructions\_drop/ for new .txt files

Step 2: Process any instructions found

Step 3: Update INSTRUCTION\_LOG.docx

Step 4: Delete processed .txt files

Step 5: Check for red text in Word doc

Step 6: Continue normal callback operations

```



\*\*This happens automatically every callback\*\* - no extra work for you!



---



\*\*END OF COMMUNICATION SYSTEM DOCUMENTATION\*\*

