# TextShield 🛡️

A complete AI text analysis toolkit with three powerful tools:

- ✦ **Humanizer** — Converts AI-generated text to natural human-sounding writing
- ◉ **AI Detector** — Detects whether text was written by AI or a human
- ⊞ **Plagiarism Checker** — Checks text for plagiarism using n-gram fingerprinting

## Features
- 100% rule-based NLP — no external AI APIs needed
- Zero dependencies — pure Node.js
- REST API + beautiful frontend included
- Drops AI detection score from 80%+ down to under 10%

## Quick Start
```bash
node server.js
```
Then open `index.html` in your browser.

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/humanize` | Humanize AI text |
| POST | `/detect` | Detect AI content |
| POST | `/plagiarism` | Check for plagiarism |
| POST | `/analyze` | Run all three at once |

## Tech Stack
- Node.js (zero npm packages)
- Vanilla HTML/CSS/JS frontend
- Rule-based NLP engine
```

---

**Topics/tags to add on GitHub** (makes it searchable):
```
ai-detector humanizer plagiarism-checker nlp nodejs rest-api
