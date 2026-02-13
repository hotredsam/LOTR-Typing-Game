\# Quality Standards and Acceptance Criteria



\*\*Version:\*\* 1.0

\*\*Last Updated:\*\* 2025-02-10

\*\*Purpose:\*\* Define quality gates for all agent outputs



---



\## Overview



All agent-generated outputs must meet these standards before human approval and integration into the project.



\*\*Key Principle:\*\* Quality over speed. Better to reject and revise than integrate substandard work.



---



\## Code Quality Standards



\### TypeScript Code



\*\*Mandatory Requirements:\*\*



✅ \*\*Type Safety\*\*

````typescript

// ✅ GOOD: Strict typing

interface GameState {

&nbsp; score: number;

&nbsp; wordsCompleted: number;

&nbsp; accuracy: number;

}



function updateScore(state: GameState, points: number): GameState {

&nbsp; return { ...state, score: state.score + points };

}



// ❌ BAD: Using 'any'

function updateScore(state: any, points: any): any {

&nbsp; return { ...state, score: state.score + points };

}

````



✅ \*\*No Implicit Any\*\*

\- `tsconfig.json` must have `"noImplicitAny": true`

\- All function parameters must have explicit types

\- All return types must be declared



✅ \*\*JSDoc Comments\*\*

````typescript

/\*\*

&nbsp;\* Calculates words per minute from typing data

&nbsp;\* @param keystrokes - Array of keystroke timestamps in milliseconds

&nbsp;\* @param totalChars - Total characters typed

&nbsp;\* @returns Typing speed metrics including WPM, raw WPM, and accuracy

&nbsp;\* @example

&nbsp;\* const metrics = calculateWPM(\[100, 250, 400], 15);

&nbsp;\* // Returns: { wpm: 60, rawWpm: 65, accuracy: 0.92 }

&nbsp;\*/

export function calculateWPM(

&nbsp; keystrokes: number\[],

&nbsp; totalChars: number

): WPMMetrics {

&nbsp; // Implementation...

}

````



✅ \*\*Error Handling\*\*

````typescript

// ✅ GOOD: Validates inputs

function calculateWPM(keystrokes: number\[], totalChars: number): WPMMetrics {

&nbsp; if (keystrokes.length === 0) {

&nbsp;   throw new Error('Keystrokes array cannot be empty');

&nbsp; }

&nbsp; if (totalChars <= 0) {

&nbsp;   throw new Error('Total characters must be positive');

&nbsp; }

&nbsp; // Calculate...

}



// ❌ BAD: No validation

function calculateWPM(keystrokes: number\[], totalChars: number): WPMMetrics {

&nbsp; const duration = keystrokes\[keystrokes.length - 1] - keystrokes\[0];

&nbsp; return { wpm: (totalChars / 5) / (duration / 60000) };

}

````



✅ \*\*Consistent Naming\*\*

\- \*\*Variables/functions:\*\* camelCase (`calculateWPM`, `gameState`)

\- \*\*Types/Interfaces:\*\* PascalCase (`GameState`, `WPMMetrics`)

\- \*\*Constants:\*\* UPPER\_SNAKE\_CASE (`MAX\_WORD\_LENGTH`, `DEFAULT\_TIME\_LIMIT`)

\- \*\*Files:\*\* kebab-case (`calculate-wpm.ts`, `game-state.types.ts`)



✅ \*\*No Magic Numbers\*\*

````typescript

// ✅ GOOD: Named constants

const CHARS\_PER\_WORD = 5;

const SECONDS\_PER\_MINUTE = 60;



const wpm = (totalChars / CHARS\_PER\_WORD) / (durationSeconds / SECONDS\_PER\_MINUTE);



// ❌ BAD: Magic numbers

const wpm = (totalChars / 5) / (durationSeconds / 60);

````



\*\*Code Style:\*\*

\- Max line length: 100 characters

\- Indentation: 2 spaces

\- Semicolons: Required

\- Quotes: Single quotes for strings

\- Trailing commas: Always in multiline



\*\*Validation Script:\*\*

````bash

\#!/bin/bash

\# tools/validators/typescript\_check.sh



FILE=$1



echo "Validating TypeScript: $FILE"



\# Compilation check

npx tsc --noEmit $FILE || exit 1



\# Linting

npx eslint $FILE || exit 1



\# No 'any' types

if grep -E ": any|as any" $FILE; then

&nbsp;   echo "❌ Forbidden 'any' type found"

&nbsp;   exit 1

fi



\# JSDoc present for exports

if ! grep -E "@param|@returns" $FILE; then

&nbsp;   echo "⚠️ Missing JSDoc comments"

&nbsp;   exit 1

fi



echo "✅ TypeScript validation passed"

````



---



\### React Components



\*\*Mandatory Requirements:\*\*



✅ \*\*Functional Components with Hooks\*\*

````typescript

// ✅ GOOD: Functional component

interface TimerDisplayProps {

&nbsp; initialSeconds: number;

&nbsp; onComplete: () => void;

}



export const TimerDisplay: React.FC<TimerDisplayProps> = ({

&nbsp; initialSeconds,

&nbsp; onComplete

}) => {

&nbsp; const \[seconds, setSeconds] = useState(initialSeconds);

&nbsp; 

&nbsp; useEffect(() => {

&nbsp;   if (seconds <= 0) {

&nbsp;     onComplete();

&nbsp;     return;

&nbsp;   }

&nbsp;   

&nbsp;   const interval = setInterval(() => {

&nbsp;     setSeconds(s => s - 1);

&nbsp;   }, 1000);

&nbsp;   

&nbsp;   return () => clearInterval(interval);

&nbsp; }, \[seconds, onComplete]);

&nbsp; 

&nbsp; return <div className="timer">{formatTime(seconds)}</div>;

};



// ❌ BAD: Class component

export class TimerDisplay extends React.Component {

&nbsp; // Not the preferred pattern

}

````



✅ \*\*Prop Types Interface\*\*

````typescript

// ✅ GOOD: Explicit interface

interface ButtonProps {

&nbsp; label: string;

&nbsp; onClick: () => void;

&nbsp; variant?: 'primary' | 'secondary';

&nbsp; disabled?: boolean;

}



// ❌ BAD: Inline types

const Button = ({ label, onClick }: { label: string, onClick: () => void }) => {

&nbsp; // Harder to reuse

}

````



✅ \*\*Cleanup in useEffect\*\*

````typescript

// ✅ GOOD: Proper cleanup

useEffect(() => {

&nbsp; const interval = setInterval(() => {

&nbsp;   // Do something

&nbsp; }, 1000);

&nbsp; 

&nbsp; return () => clearInterval(interval);  // Cleanup

}, \[]);



// ❌ BAD: No cleanup

useEffect(() => {

&nbsp; setInterval(() => {

&nbsp;   // Do something - memory leak!

&nbsp; }, 1000);

}, \[]);

````



✅ \*\*Accessibility\*\*

````tsx

// ✅ GOOD: ARIA labels, semantic HTML

<button

&nbsp; onClick={handleClick}

&nbsp; aria-label="Start typing game"

&nbsp; className="start-button"

>

&nbsp; Start Game

</button>



// ❌ BAD: Non-semantic, no accessibility

<div onClick={handleClick} className="start-button">

&nbsp; Start Game

</div>

````



✅ \*\*Tailwind CSS Styling\*\*

````tsx

// ✅ GOOD: Utility classes

<div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">

&nbsp; <span className="text-2xl font-bold text-green-400">{score}</span>

</div>



// ❌ BAD: Inline styles

<div style={{ display: 'flex', padding: '16px', backgroundColor: '#1f2937' }}>

&nbsp; <span style={{ fontSize: '24px', color: '#34d399' }}>{score}</span>

</div>

````



---



\### Phaser 3 Game Code



\*\*Mandatory Requirements:\*\*



✅ \*\*Scene Structure\*\*

````typescript

// ✅ GOOD: Proper scene class

export class MainScene extends Phaser.Scene {

&nbsp; private wordText!: Phaser.GameObjects.Text;

&nbsp; private player!: Phaser.GameObjects.Sprite;

&nbsp; 

&nbsp; constructor() {

&nbsp;   super({ key: 'MainScene' });

&nbsp; }

&nbsp; 

&nbsp; preload(): void {

&nbsp;   this.load.image('player', 'assets/player.png');

&nbsp; }

&nbsp; 

&nbsp; create(): void {

&nbsp;   this.player = this.add.sprite(100, 100, 'player');

&nbsp;   this.wordText = this.add.text(200, 50, 'Type this!', {

&nbsp;     fontSize: '32px',

&nbsp;     color: '#ffffff'

&nbsp;   });

&nbsp; }

&nbsp; 

&nbsp; update(time: number, delta: number): void {

&nbsp;   // Game loop logic

&nbsp; }

}



// ❌ BAD: Missing lifecycle methods, no types

export class MainScene extends Phaser.Scene {

&nbsp; create() {

&nbsp;   this.add.text(200, 50, 'Type this!');

&nbsp; }

}

````



✅ \*\*Resource Cleanup\*\*

````typescript

// ✅ GOOD: Cleanup on shutdown

shutdown(): void {

&nbsp; this.wordText.destroy();

&nbsp; this.player.destroy();

&nbsp; this.events.off('word-completed');

}



// ❌ BAD: No cleanup (memory leaks)

````



✅ \*\*Performance Considerations\*\*

\- Use object pooling for frequently created/destroyed objects

\- Limit particle effects (max 100 particles)

\- Use texture atlases, not individual images

\- Target 60fps minimum



---



\## Content Quality Standards



\### Original Fantasy Content



\*\*Mandatory Requirements:\*\*



✅ \*\*Originality Check\*\*

````json

// ✅ GOOD: Original names

{

&nbsp; "locations": \[

&nbsp;   "Khar'vothen",

&nbsp;   "Zyr'massif",

&nbsp;   "Thornveil Peaks",

&nbsp;   "Obsidian Hollows"

&nbsp; ]

}



// ❌ BAD: Too similar to existing IP

{

&nbsp; "locations": \[

&nbsp;   "Rivendell",        // Tolkien

&nbsp;   "Hogwarts",         // Harry Potter

&nbsp;   "Westeros"          // Game of Thrones

&nbsp; ]

}

````



\*\*Copyright Check Script:\*\*

````python

\# tools/validators/copyright\_check.py



import json



FORBIDDEN\_TERMS = \[

&nbsp;   # Tolkien/LOTR

&nbsp;   'mordor', 'gondor', 'rohan', 'rivendell', 'shire', 'hobbiton',

&nbsp;   'sauron', 'gandalf', 'aragorn', 'frodo', 'legolas',

&nbsp;   'mithril', 'palantir', 'nazgul',

&nbsp;   

&nbsp;   # D\&D

&nbsp;   'forgotten realms', 'baldurs gate', 'waterdeep', 'neverwinter',

&nbsp;   'beholder', 'mind flayer', 'owlbear', 'displacer beast',

&nbsp;   

&nbsp;   # Other Fantasy

&nbsp;   'hogwarts', 'westeros', 'azeroth', 'tamriel', 'hyrule',

&nbsp;   

&nbsp;   # Add more as needed

]



def check\_content(content: str) -> bool:

&nbsp;   """Returns True if content is safe, False if violation found"""

&nbsp;   content\_lower = content.lower()

&nbsp;   

&nbsp;   violations = \[]

&nbsp;   for term in FORBIDDEN\_TERMS:

&nbsp;       if term in content\_lower:

&nbsp;           violations.append(term)

&nbsp;   

&nbsp;   if violations:

&nbsp;       print(f"❌ Copyright violations found: {violations}")

&nbsp;       return False

&nbsp;   

&nbsp;   print("✅ No copyright violations detected")

&nbsp;   return True



\# Usage

with open('outputs/agent\_deliverables/location\_names.json') as f:

&nbsp;   data = json.load(f)



content = json.dumps(data)

if not check\_content(content):

&nbsp;   exit(1)

````



✅ \*\*Thematic Consistency\*\*

````json

// ✅ GOOD: Consistent harsh/mystical style

{

&nbsp; "names": \[

&nbsp;   "Khar'vothen",      // Harsh consonants, apostrophes

&nbsp;   "Zyr'massif",       // Similar patterns

&nbsp;   "Drak'tharon"       // Maintains style

&nbsp; ]

}



// ❌ BAD: Inconsistent styles

{

&nbsp; "names": \[

&nbsp;   "Khar'vothen",      // Harsh mystical

&nbsp;   "Meadowbrook",      // Pastoral/peaceful (doesn't match)

&nbsp;   "Bob's Village"     // Modern/casual (doesn't fit)

&nbsp; ]

}

````



✅ \*\*Minimum Quantity\*\*

\- Word packs: Minimum 50 words per pack

\- Location names: Minimum 30 names

\- Character names: Minimum 20 names

\- Quest descriptions: Minimum 10 unique quests



✅ \*\*Format Validation\*\*

````json

// Required schema for word packs

{

&nbsp; "pack\_name": "Ancient Runes",

&nbsp; "difficulty": "hard",

&nbsp; "theme": "mystical",

&nbsp; "words": \[

&nbsp;   {

&nbsp;     "word": "khar'voth",

&nbsp;     "definition": "Ancient stone circle used for rituals",

&nbsp;     "difficulty\_score": 8,

&nbsp;     "length": 9

&nbsp;   }

&nbsp; ],

&nbsp; "metadata": {

&nbsp;   "generated\_by": "local\_llm\_agent",

&nbsp;   "generated\_at": "2025-02-10T10:00:00Z",

&nbsp;   "human\_reviewed": false

&nbsp; }

}

````



---



\## Asset Quality Standards



\### Pixel Art Sprites



\*\*Mandatory Requirements:\*\*



✅ \*\*Dimensions\*\*

\- Character sprites: 32x32 pixels

\- Enemy sprites: 32x32 pixels

\- UI icons: 16x16 or 24x24 pixels

\- Background tiles: 32x32 pixels



✅ \*\*Color Palette\*\*

\- Maximum 8 colors per sprite (excluding transparency)

\- Use consistent palette across similar sprites

\- Avoid anti-aliasing (hard edges only)



✅ \*\*File Format\*\*

\- PNG with transparency

\- No compression artifacts

\- No dithering



✅ \*\*Validation Script\*\*

````python

\# tools/validators/sprite\_check.py



from PIL import Image

import sys



def validate\_sprite(filepath: str) -> bool:

&nbsp;   """Validate pixel art sprite meets standards"""

&nbsp;   

&nbsp;   img = Image.open(filepath)

&nbsp;   

&nbsp;   # Check dimensions

&nbsp;   width, height = img.size

&nbsp;   if width != 32 or height != 32:

&nbsp;       print(f"❌ Invalid dimensions: {width}x{height} (expected 32x32)")

&nbsp;       return False

&nbsp;   

&nbsp;   # Check format

&nbsp;   if img.format != 'PNG':

&nbsp;       print(f"❌ Invalid format: {img.format} (expected PNG)")

&nbsp;       return False

&nbsp;   

&nbsp;   # Check for transparency

&nbsp;   if img.mode not in ('RGBA', 'LA'):

&nbsp;       print(f"⚠️ No transparency channel (mode: {img.mode})")

&nbsp;   

&nbsp;   # Count unique colors

&nbsp;   colors = img.getcolors(maxcolors=256)

&nbsp;   if colors and len(colors) > 9:  # 8 colors + transparency

&nbsp;       print(f"⚠️ {len(colors)} colors used (recommend max 8)")

&nbsp;       # Warning only, not failure

&nbsp;   

&nbsp;   print(f"✅ Sprite validation passed: {width}x{height}, {len(colors) if colors else 'many'} colors")

&nbsp;   return True



if \_\_name\_\_ == '\_\_main\_\_':

&nbsp;   if not validate\_sprite(sys.argv\[1]):

&nbsp;       exit(1)

````



\*\*Style Guidelines:\*\*

\- \*\*Character sprites:\*\* Clear silhouette, readable at small size

\- \*\*Enemy sprites:\*\* Distinct from player, aggressive poses

\- \*\*Animations:\*\* 2-4 frames maximum (limited animation)

\- \*\*Consistency:\*\* All sprites should look like they're from the same game



---



\## Documentation Quality Standards



\### Code Documentation



✅ \*\*README Files\*\*

````markdown

\# Component Name



\## Purpose

Brief description of what this component/module does.



\## Usage

```typescript

import { ComponentName } from './ComponentName';



const example = new ComponentName({ options });

```



\## API

\### Props/Parameters

\- `propName` (type): Description

\- `optionalProp?` (type): Description (optional)



\### Returns

Description of return value



\## Examples

\[Concrete usage examples]



\## Notes

Any caveats, performance considerations, or gotchas

````



✅ \*\*Inline Comments\*\*

````typescript

// ✅ GOOD: Explains WHY, not WHAT

// Using exponential backoff to avoid overwhelming the server during retries

const delay = Math.pow(2, retryCount) \* 1000;



// ❌ BAD: States the obvious

// Set delay to 2 to the power of retry count times 1000

const delay = Math.pow(2, retryCount) \* 1000;

````



---



\## Testing Standards



\### Unit Tests



\*\*Mandatory Requirements:\*\*



✅ \*\*Test Coverage for Core Utilities\*\*

````typescript

// src/utils/scoring.test.ts



import { describe, it, expect } from 'vitest';

import { calculateWPM } from './scoring';



describe('calculateWPM', () => {

&nbsp; it('calculates correct WPM for standard input', () => {

&nbsp;   const keystrokes = \[0, 100, 200, 300, 400]; // 5 keystrokes over 400ms

&nbsp;   const result = calculateWPM(keystrokes, 20);

&nbsp;   

&nbsp;   expect(result.wpm).toBeCloseTo(60, 1);

&nbsp; });

&nbsp; 

&nbsp; it('handles empty keystroke array', () => {

&nbsp;   expect(() => calculateWPM(\[], 10)).toThrow('Keystrokes array cannot be empty');

&nbsp; });

&nbsp; 

&nbsp; it('handles single keystroke', () => {

&nbsp;   const result = calculateWPM(\[100], 1);

&nbsp;   expect(result.wpm).toBe(0); // Not enough data

&nbsp; });

&nbsp; 

&nbsp; it('calculates accuracy correctly', () => {

&nbsp;   const keystrokes = \[0, 100, 200];

&nbsp;   const result = calculateWPM(keystrokes, 15, 14); // 14 correct out of 15

&nbsp;   

&nbsp;   expect(result.accuracy).toBeCloseTo(0.933, 2);

&nbsp; });

});

````



\*\*Coverage Requirements:\*\*

\- Core utilities: 80% coverage minimum

\- Game logic: 60% coverage minimum

\- UI components: Manual testing acceptable (no coverage requirement)



✅ \*\*Edge Cases Tested\*\*

\- Empty inputs

\- Single item inputs

\- Maximum values

\- Negative values (if applicable)

\- Null/undefined handling



---



\## Performance Standards



\### Application Performance



\*\*Mandatory Requirements:\*\*



✅ \*\*Frame Rate\*\*

\- Game must run at 60fps minimum on target hardware

\- No frame drops during typical gameplay

\- Smooth animations and transitions



✅ \*\*Load Times\*\*

\- Initial load: < 3 seconds

\- Scene transitions: < 500ms

\- Asset loading: Progressive (show loading indicator if > 1 second)



✅ \*\*Memory Usage\*\*

\- Browser memory: < 500MB during gameplay

\- No memory leaks (test with 30+ minute sessions)

\- Garbage collection doesn't cause noticeable stutters



\*\*Performance Testing:\*\*

````bash

\# Run performance profiling

npm run dev



\# In browser DevTools:

\# 1. Performance tab → Record

\# 2. Play game for 5 minutes

\# 3. Stop recording

\# 4. Check for:

\#    - Frame rate consistently 60fps

\#    - No long tasks (>50ms)

\#    - Memory stable (no continuous growth)

````



---



\## Acceptance Criteria Checklist



\### Code Deliverables



Before approving any code task:

\- \[ ] TypeScript compilation succeeds with no errors

\- \[ ] ESLint passes with no violations

\- \[ ] No `any` types used

\- \[ ] All exports have JSDoc comments

\- \[ ] Edge cases handled with appropriate errors

\- \[ ] Consistent naming conventions

\- \[ ] No magic numbers (constants used)

\- \[ ] Resource cleanup implemented (if applicable)

\- \[ ] Tests written for core logic (if applicable)



\### Content Deliverables



Before approving any content task:

\- \[ ] Minimum quantity met (50+ words, 20+ names, etc.)

\- \[ ] Copyright check passed (no forbidden terms)

\- \[ ] Thematic consistency maintained

\- \[ ] Proper JSON schema followed

\- \[ ] Metadata included (generated\_by, timestamp)

\- \[ ] No modern/anachronistic language

\- \[ ] Original and creative (not generic)



\### Asset Deliverables



Before approving any asset task:

\- \[ ] Correct dimensions (32x32, 16x16, etc.)

\- \[ ] PNG format with transparency

\- \[ ] Color palette within limits (≤8 colors)

\- \[ ] No anti-aliasing artifacts

\- \[ ] Style consistent with existing assets

\- \[ ] Clear and readable at target size

\- \[ ] Proper naming convention (kebab-case)



---



\## Quality Review Process



\### Human Review Steps



\*\*1. Initial Automated Validation\*\*

````bash

\# Run all validators

bash tools/validate\_output.sh outputs/agent\_deliverables/task\_101

````



\*\*2. Manual Inspection\*\*

\- Open file in appropriate editor

\- Read through entire output

\- Check against task requirements

\- Look for subtle issues automation might miss



\*\*3. Functional Testing\*\*

\- Integrate temporarily into project

\- Run application

\- Test functionality

\- Check for visual/interactive issues



\*\*4. Decision\*\*

\- \*\*Approve:\*\* Move to `/src/` or `/assets/`, update review log

\- \*\*Revise:\*\* Create revision task with specific feedback

\- \*\*Reject:\*\* Discard, document reason, consider new approach



\*\*5. Documentation\*\*

````bash

cat >> logs/human\_reviews.md << 'EOF'

\## Review Session: 2025-02-10 14:00



\### task\_101: calculateWPM Function

\*\*Decision:\*\* ✅ APPROVED



\*\*Quality Assessment:\*\*

\- Compilation: ✅ Pass

\- Type safety: ✅ Strict

\- Edge cases: ✅ Handled

\- Performance: ✅ O(n) complexity

\- Documentation: ✅ Comprehensive JSDoc



\*\*Integration:\*\* Moved to `/src/utils/scoring.ts`

EOF

````



---



\## Rejection Criteria (Automatic Fail)



The following issues result in immediate rejection:



❌ \*\*Copyright Violations\*\*

\- Any use of copyrighted names, locations, or content

\- Similarity to existing IP



❌ \*\*Code Safety\*\*

\- Use of `eval()` or similar dynamic code execution

\- Hardcoded credentials or API keys

\- Unsafe user input handling



❌ \*\*Compliance Violations\*\*

\- References to KPMG or professional work

\- Proprietary data or methodologies

\- Violation of Zero-Training Rule



❌ \*\*Severe Quality Issues\*\*

\- Code doesn't compile

\- Completely wrong implementation

\- Nonsensical or garbled output



❌ \*\*Malicious Content\*\*

\- Hate speech or offensive content

\- Intentionally misleading information

\- Security vulnerabilities



---



\## Quality Metrics Tracking



File: `/logs/quality\_metrics.json`

````json

{

&nbsp; "period": "2025-02-10 to 2025-02-17",

&nbsp; "tasks\_reviewed": 47,

&nbsp; "approvals": 38,

&nbsp; "revisions": 7,

&nbsp; "rejections": 2,

&nbsp; "approval\_rate": 0.809,

&nbsp; 

&nbsp; "common\_issues": \[

&nbsp;   {

&nbsp;     "issue": "Missing JSDoc comments",

&nbsp;     "occurrences": 5,

&nbsp;     "severity": "minor"

&nbsp;   },

&nbsp;   {

&nbsp;     "issue": "Too many colors in sprite",

&nbsp;     "occurrences": 3,

&nbsp;     "severity": "minor"

&nbsp;   }

&nbsp; ],

&nbsp; 

&nbsp; "average\_revision\_cycles": 1.2,

&nbsp; 

&nbsp; "by\_agent": {

&nbsp;   "local\_llm\_agent": {

&nbsp;     "approval\_rate": 0.85,

&nbsp;     "common\_issues": \["missing edge case handling"]

&nbsp;   },

&nbsp;   "image\_gen\_agent": {

&nbsp;     "approval\_rate": 0.75,

&nbsp;     "common\_issues": \["color palette violations"]

&nbsp;   }

&nbsp; }

}

````



---



\*\*END OF QUALITY STANDARDS DOCUMENTATION\*\*

