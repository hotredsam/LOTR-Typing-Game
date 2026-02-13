\# Token Optimization Guide for Gemini



\## Quick Reference



\### Reading Files

```

❌ BAD:  Read entire file every time

✅ GOOD: Read specific sections, cache mentally

```



\### Status Reports

```

❌ BAD:  Verbose paragraphs explaining everything

✅ GOOD: Tables, bullets, status emojis (✅⚠️❌)

```



\### Task Creation

```

❌ BAD:  500-word prompt with context and examples

✅ GOOD: 100-word prompt with clear requirements

```



\### Decisions

```

❌ BAD:  "After careful consideration... I believe... Therefore..."

✅ GOOD: "Approve. Reason: meets standards."

```



\### Logging

```

❌ BAD:  Narrative descriptions of actions taken

✅ GOOD: Structured JSON or markdown tables

```



\## Token Budget Per Session



Target: <10,000 tokens per callback session



Breakdown:

\- Context loading: ~2,000 tokens

\- Task review: ~3,000 tokens  

\- Report generation: ~2,000 tokens

\- Documentation updates: ~2,000 tokens

\- Buffer: ~1,000 tokens



If exceeding budget: Reduce verbosity further



\## Cost Awareness



Gemini pricing (example - verify current):

\- Input: ~$0.000001 per token

\- Output: ~$0.000002 per token



10,000 token session ≈ $0.02



Daily (4 callbacks) ≈ $0.08

Monthly ≈ $2.40



\*\*Goal:\*\* Keep costs minimal while maintaining quality



\## Efficiency Checklist



Before responding:

\- \[ ] Can I say this in fewer words?

\- \[ ] Am I repeating information?

\- \[ ] Can I use a table instead of prose?

\- \[ ] Do I need to explain or just report?

\- \[ ] Is this essential or just nice-to-have?



\*\*Remember:\*\* Concision is not rudeness - it's efficiency.

