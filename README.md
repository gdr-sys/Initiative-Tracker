# Initiative Tracker

![No Build Step](https://img.shields.io/badge/build-none-brightgreen)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-f7df1e?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![License](https://img.shields.io/badge/license-Free%20to%20use-blue)
![Languages](https://img.shields.io/badge/lang-IT%20%7C%20EN-orange)
![Ko--fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?logo=ko-fi&logoColor=white)

A universal initiative tracker for tabletop RPGs. Built for speed at the table: add a combatant, change HP, and pass the turn in 1–2 taps. Optimized for use on a smartphone by the GM or on a shared tablet, in the low light typical of a game table.

Available in **Italian and English** — switch language anytime from Settings (⚙️).

Supports three initiative systems:
- **D&D / Numeric** — classic numeric initiative order, individual turns
- **Fabula Ultima / Alternating** — turns alternate between Heroes and Villains, no initiative numbers
- **PbtA / Spotlight** — no fixed order; the GM taps to spotlight whoever acts

## How to use

Open `index.html` in any modern browser. That's it — no installation, no build step, no server required. Works fully offline after the first load (fonts are cached by the browser).

## File structure

```
initiative-tracker/
├── index.html        Markup for the app, all modals and screens
├── style.css          Full design system and styling
├── script.js          All application logic and state management
└── README.md          This file
```

## Features by mode

**D&D / Numeric**
- Combatants sorted automatically by initiative (highest to lowest)
- "Next Turn" advances through the list; a new round starts automatically when everyone has acted
- Combatants who acted are dimmed
- Roll 1d20 directly in the add-combatant form
- KO'd combatants are skipped automatically

**Fabula Ultima / Alternating**
- Combatants split into "Heroes" and "Villains" sections
- No initiative numbers — players/GM freely choose who acts
- Checkmark shows who has acted this round

**PbtA / Spotlight**
- Free-form list, no automatic turn order
- Tap "Illumina" to spotlight a character
- HP and initiative are optional in this mode

## Keyboard shortcuts

| Key | Action |
|---|---|
| Space / Enter | Next turn |
| N | New round |
| A | Open "Add combatant" |
| Escape | Close open modal/panel |
| Ctrl+Z (Cmd+Z) | Undo last action |
| 1–9 | Scroll to combatant at that position |

## LocalStorage

The entire app state (combatants, round, mode, settings) is saved to `localStorage` under the key `initiative_tracker_state` after every change. On reload, your combat is automatically restored and a small banner confirms it. Use "Nuovo Combattimento" to clear the current fight, or "Cancella Tutto e Ricomincia" in Settings to wipe everything and start fresh.

No data ever leaves your browser — nothing is sent to any server.

## Credits

Created by **Noemi Marcolini**

- ☕ [Support on Ko-fi](https://ko-fi.com/noemimarcolini)
- 🎲 [More RPG tools](https://gdr-sys-portfolio2026.vercel.app/)

## License

Free to use, modify, and share for personal and non-commercial tabletop use.
