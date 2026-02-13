\# URGENT SETUP INSTRUCTION FOR GEMINI



\*\*Action Required:\*\* Implement the Sam's Instructions Drop system



---



\## What You Need to Do



\### 1. Create the Instruction Drop Folder

```bash

mkdir -p /sams\_instructions\_drop/

mkdir -p /sams\_instructions\_drop/archive/

```



\### 2. Create the Word Document Template



\*\*Generate:\*\* `/sams\_instructions\_drop/INSTRUCTION\_LOG.docx`



\*\*Use python-docx library:\*\*

```python

from docx import Document

from docx.shared import Pt, RGBColor

from docx.enum.text import WD\_ALIGN\_PARAGRAPH

from datetime import datetime



doc = Document()



\# Title

title = doc.add\_heading('INSTRUCTION LOG - Fantasy Typing Game', 0)

title.alignment = WD\_ALIGN\_PARAGRAPH.CENTER



\# Subtitle

subtitle = doc.add\_paragraph(f'Last Updated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

subtitle.alignment = WD\_ALIGN\_PARAGRAPH.CENTER



\# Separator

doc.add\_paragraph('═' \* 80)



\# Instructions section

intro = doc.add\_paragraph(

&nbsp;   'This document logs all instructions from Sam and how they were addressed by Gemini.\\n'

&nbsp;   'Most recent instructions appear at the top.\\n\\n'

&nbsp;   'To add new instructions: Drop a .txt file in /sams\_instructions\_drop/\\n'

&nbsp;   'To refine existing: Add red text below any entry.\\n'

)



doc.add\_paragraph('═' \* 80)



\# Save

doc.save('/sams\_instructions\_drop/INSTRUCTION\_LOG.docx')

```



\### 3. Update Your Callback Workflow



\*\*Add this to your callback procedure (BEFORE normal task review):\*\*

```python

\# Step 0: Check for Sam's instructions

instruction\_files = glob.glob('/sams\_instructions\_drop/\*.txt')



if instruction\_files:

&nbsp;   for file in sorted(instruction\_files):

&nbsp;       # Read instruction

&nbsp;       with open(file, 'r') as f:

&nbsp;           instruction\_text = f.read()

&nbsp;       

&nbsp;       # Process instruction

&nbsp;       response = process\_instruction(instruction\_text)

&nbsp;       

&nbsp;       # Add to Word doc (at top)

&nbsp;       add\_to\_instruction\_log(instruction\_text, response)

&nbsp;       

&nbsp;       # Delete .txt file

&nbsp;       os.remove(file)

&nbsp;   

&nbsp;   # Check for red text refinements

&nbsp;   check\_for\_red\_text\_refinements()



\# Then continue with normal callback operations...

```



\### 4. Implement Helper Functions



\*\*Function: `process\_instruction(text)`\*\*

\- Parse the instruction

\- Determine priority

\- Create tasks or take immediate action

\- Return summary of actions taken



\*\*Function: `add\_to\_instruction\_log(instruction, response)`\*\*

\- Open INSTRUCTION\_LOG.docx

\- Add new entry at top with:

&nbsp; - Instruction number (auto-increment)

&nbsp; - Timestamp

&nbsp; - Original instruction text

&nbsp; - Your response (how you addressed it)

&nbsp; - Status indicators (✅⏳⚠️❌)

\- Format professionally

\- Save document



\*\*Function: `check\_for\_red\_text\_refinements()`\*\*

\- Open INSTRUCTION\_LOG.docx

\- Scan for text with red color

\- Process as new instructions

\- Clear red text after processing

\- Add new log entry



\### 5. Create Processing Script



\*\*Generate:\*\* `/tools/process\_instruction\_drop.py`

```python

\#!/usr/bin/env python3

"""

Process instruction drop files and update Word log

"""



import os

import glob

from datetime import datetime

from docx import Document

from docx.shared import Pt, RGBColor

from docx.enum.text import WD\_ALIGN\_PARAGRAPH



INSTRUCTION\_DIR = '/sams\_instructions\_drop/'

LOG\_FILE = f'{INSTRUCTION\_DIR}INSTRUCTION\_LOG.docx'



def process\_instructions():

&nbsp;   """Main processing function"""

&nbsp;   

&nbsp;   # Find all .txt files

&nbsp;   txt\_files = sorted(glob.glob(f'{INSTRUCTION\_DIR}\*.txt'))

&nbsp;   

&nbsp;   if not txt\_files:

&nbsp;       print("No new instructions found")

&nbsp;       return

&nbsp;   

&nbsp;   # Load or create Word doc

&nbsp;   if os.path.exists(LOG\_FILE):

&nbsp;       doc = Document(LOG\_FILE)

&nbsp;   else:

&nbsp;       doc = create\_new\_log()

&nbsp;   

&nbsp;   # Process each instruction file

&nbsp;   for txt\_file in txt\_files:

&nbsp;       with open(txt\_file, 'r') as f:

&nbsp;           instruction\_text = f.read()

&nbsp;       

&nbsp;       # Process and add to log

&nbsp;       add\_instruction\_entry(doc, instruction\_text)

&nbsp;       

&nbsp;       # Delete txt file

&nbsp;       os.remove(txt\_file)

&nbsp;       print(f"Processed: {os.path.basename(txt\_file)}")

&nbsp;   

&nbsp;   # Check for red text

&nbsp;   process\_red\_text(doc)

&nbsp;   

&nbsp;   # Save

&nbsp;   doc.save(LOG\_FILE)

&nbsp;   print(f"Updated: {LOG\_FILE}")



def create\_new\_log():

&nbsp;   """Create new instruction log document"""

&nbsp;   doc = Document()

&nbsp;   

&nbsp;   title = doc.add\_heading('INSTRUCTION LOG - Fantasy Typing Game', 0)

&nbsp;   title.alignment = WD\_ALIGN\_PARAGRAPH.CENTER

&nbsp;   

&nbsp;   subtitle = doc.add\_paragraph(f'Created: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

&nbsp;   subtitle.alignment = WD\_ALIGN\_PARAGRAPH.CENTER

&nbsp;   

&nbsp;   doc.add\_paragraph('═' \* 80)

&nbsp;   

&nbsp;   return doc



def add\_instruction\_entry(doc, instruction\_text):

&nbsp;   """Add new instruction entry to document"""

&nbsp;   

&nbsp;   # Get next instruction number

&nbsp;   instruction\_num = count\_existing\_instructions(doc) + 1

&nbsp;   

&nbsp;   # Separator

&nbsp;   doc.add\_paragraph('═' \* 80)

&nbsp;   

&nbsp;   # Header

&nbsp;   header = doc.add\_paragraph()

&nbsp;   header.add\_run(f'INSTRUCTION #{instruction\_num} - {datetime.now().strftime("%Y-%m-%d %H:%M")}\\n')

&nbsp;   header.add\_run('Status: ⏳ PROCESSING').font.color.rgb = RGBColor(255, 165, 0)

&nbsp;   

&nbsp;   # Your instructions

&nbsp;   doc.add\_heading('YOUR INSTRUCTIONS:', level=2)

&nbsp;   doc.add\_paragraph(instruction\_text)

&nbsp;   

&nbsp;   # How Gemini addressed (placeholder)

&nbsp;   doc.add\_heading('HOW GEMINI ADDRESSED THIS:', level=2)

&nbsp;   doc.add\_paragraph('\[Processing... check next callback for results]')

&nbsp;   

&nbsp;   return doc



def process\_red\_text(doc):

&nbsp;   """Check for red text refinements"""

&nbsp;   

&nbsp;   for paragraph in doc.paragraphs:

&nbsp;       for run in paragraph.runs:

&nbsp;           if run.font.color.rgb == RGBColor(255, 0, 0):  # Red text

&nbsp;               refinement = run.text

&nbsp;               # Process as new instruction

&nbsp;               # \[Implementation details]

&nbsp;               # Clear red text after processing

&nbsp;               run.text = ""



def count\_existing\_instructions(doc):

&nbsp;   """Count existing instruction entries"""

&nbsp;   count = 0

&nbsp;   for paragraph in doc.paragraphs:

&nbsp;       if 'INSTRUCTION #' in paragraph.text:

&nbsp;           count += 1

&nbsp;   return count



if \_\_name\_\_ == '\_\_main\_\_':

&nbsp;   process\_instructions()

```



---



\## Agent Idleness Prevention



\*\*CRITICAL RULE:\*\* Never let agents sit idle



\### Implementation Strategy



\*\*1. Task Queue Always Has Work\*\*



Maintain a \*\*backlog queue\*\* of low-priority tasks:

```json

{

&nbsp; "backlog": \[

&nbsp;   {

&nbsp;     "id": "backlog\_001",

&nbsp;     "type": "content\_generation",

&nbsp;     "priority": 10,

&nbsp;     "prompt": "Generate 20 additional enemy names for future use"

&nbsp;   },

&nbsp;   {

&nbsp;     "id": "backlog\_002", 

&nbsp;     "type": "optimization",

&nbsp;     "priority": 10,

&nbsp;     "prompt": "Review calculateWPM for micro-optimizations"

&nbsp;   }

&nbsp; ]

}

```



\*\*When main queue empty:\*\*

\- Agents automatically pull from backlog

\- Low-priority, non-critical work

\- Can be discarded if not needed

\- Keeps agents productive



\*\*2. Progressive Build Strategy\*\*



\*\*Use smaller/faster models for initial builds:\*\*

```markdown

Phase 1: Rough Draft (Fast Model)

\- Agent: llama3.2:3b (small, fast)

\- Task: Generate initial implementation

\- Quality: 70% - good enough to work

\- Time: 2 minutes



Phase 2: Refinement (Medium Model)  

\- Agent: llama3.2:7b (medium)

\- Task: Improve logic, add edge cases

\- Quality: 90% - production-ready

\- Time: 5 minutes



Phase 3: Polish (Large Model)

\- Agent: llama3.1:70b (large, slow - optional)

\- Task: Optimize, perfect documentation

\- Quality: 95%+ - exceptional

\- Time: 15 minutes

```



\*\*Task Queue Example:\*\*

```json

{

&nbsp; "id": "task\_101",

&nbsp; "type": "code\_generation",

&nbsp; "phases": \[

&nbsp;   {

&nbsp;     "phase": 1,

&nbsp;     "assigned\_to": "llm\_agent\_small",

&nbsp;     "model": "llama3.2:3b",

&nbsp;     "goal": "Working implementation"

&nbsp;   },

&nbsp;   {

&nbsp;     "phase": 2,

&nbsp;     "assigned\_to": "llm\_agent\_medium",

&nbsp;     "model": "llama3.2:7b",

&nbsp;     "goal": "Production quality",

&nbsp;     "refactor": true

&nbsp;   },

&nbsp;   {

&nbsp;     "phase": 3,

&nbsp;     "assigned\_to": "llm\_agent\_large",

&nbsp;     "model": "llama3.1:70b",

&nbsp;     "goal": "Perfect polish",

&nbsp;     "refactor": true,

&nbsp;     "optional": true

&nbsp;   }

&nbsp; ]

}

```



\*\*3. Resource Optimization\*\*



\*\*Use your PC efficiently:\*\*

```markdown

CPU-Bound Tasks:

\- Small model (3B): 4 concurrent agents

\- Medium model (7B): 2 concurrent agents  

\- Large model (70B): 1 agent only



GPU-Bound Tasks:

\- Image generation: 1 agent (uses GPU fully)

\- While image gen running: Use CPU for code gen



Memory Management:

\- Monitor RAM usage

\- If >80% RAM: pause large models

\- Prioritize smaller models



Disk I/O:

\- Batch file operations

\- Use SSD for model storage

\- Cache frequently used prompts

```



\*\*4. Agent Work Scheduler\*\*

```python

\# /tools/agent\_scheduler.py



class AgentScheduler:

&nbsp;   def \_\_init\_\_(self):

&nbsp;       self.agents = {

&nbsp;           'small': {'model': 'llama3.2:3b', 'max\_concurrent': 4},

&nbsp;           'medium': {'model': 'llama3.2:7b', 'max\_concurrent': 2},

&nbsp;           'large': {'model': 'llama3.1:70b', 'max\_concurrent': 1},

&nbsp;           'image': {'model': 'sd1.5', 'max\_concurrent': 1}

&nbsp;       }

&nbsp;   

&nbsp;   def assign\_work(self):

&nbsp;       """Ensure no agent is idle"""

&nbsp;       

&nbsp;       # Get available capacity

&nbsp;       for agent\_type, config in self.agents.items():

&nbsp;           active = count\_active\_agents(agent\_type)

&nbsp;           available = config\['max\_concurrent'] - active

&nbsp;           

&nbsp;           if available > 0:

&nbsp;               # Assign work from queue

&nbsp;               tasks = get\_tasks\_for\_agent(agent\_type, limit=available)

&nbsp;               

&nbsp;               if not tasks:

&nbsp;                   # No priority work, pull from backlog

&nbsp;                   tasks = get\_backlog\_tasks(agent\_type, limit=available)

&nbsp;               

&nbsp;               for task in tasks:

&nbsp;                   start\_agent(agent\_type, task)

&nbsp;   

&nbsp;   def optimize\_resources(self):

&nbsp;       """Use PC efficiently"""

&nbsp;       

&nbsp;       ram\_usage = get\_ram\_usage()

&nbsp;       gpu\_usage = get\_gpu\_usage()

&nbsp;       

&nbsp;       if ram\_usage > 0.8:

&nbsp;           # Pause large models, use small only

&nbsp;           pause\_agents(\['large', 'medium'])

&nbsp;           prioritize\_agents(\['small'])

&nbsp;       

&nbsp;       if gpu\_usage < 0.5 and image\_tasks\_available():

&nbsp;           # GPU available, start image generation

&nbsp;           start\_agent('image', get\_next\_image\_task())

```



\*\*5. Continuous Work Examples\*\*



\*\*When waiting for human review:\*\*

```markdown

Agent Activity:

\- Small model: Generate additional word packs (backlog)

\- Small model: Create unit tests for existing code

\- Small model: Generate quest variations

\- Medium model: Refactor previous approved code

\- Image model: Generate sprite variations

```



\*\*Between Gemini callbacks:\*\*

```markdown

Agents working on:

\- Current priority tasks (main queue)

\- Code optimization passes (refactoring)

\- Content generation (word packs, quests)

\- Test generation

\- Documentation improvements

\- Sprite variations for future use

```



---



\## Gemini Instructions Summary



\*\*You must now:\*\*



1\. ✅ Create `/sams\_instructions\_drop/` folder

2\. ✅ Generate `INSTRUCTION\_LOG.docx` template

3\. ✅ Create `/tools/process\_instruction\_drop.py` script

4\. ✅ Add instruction checking to your callback workflow

5\. ✅ Implement progressive build strategy (small → medium → large models)

6\. ✅ Create backlog queue for agent idle prevention

7\. ✅ Implement agent scheduler for resource optimization

8\. ✅ Update documentation with these new systems



\*\*Priority:\*\* HIGH - Implement before Phase 1 begins



\*\*Expected Result:\*\*

\- Sam can drop .txt files anytime

\- You process them automatically

\- Word doc stays updated

\- Agents never idle

\- PC resources used efficiently

\- Small models build, large models polish



---



\*\*END OF INSTRUCTION DROP SETUP\*\*

