<div align="center">

<img src="https://img.icons8.com/color/94/idea.png" alt="QuickStash Logo" width="80" height="80">

# QuickStash

**A browser-resident idea inbox and today's to-do board.**
<br>
Capture stray thoughts without losing focus, and organize your daily priorities in a focused custom new tab page.

<p align="center">
  <img src="https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/Manifest_V3-34A853?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Manifest V3">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JS">
</p>

</div>

---

## Overview

**QuickStash** is a lightweight, distraction-free Chrome extension designed to help you separate idea capture from daily task execution. 

Instead of juggling multiple productivity apps, QuickStash lives directly in your browser. Whenever inspiration strikes while you're browsing, use a simple keyboard shortcut to capture it instantly. Then, whenever you open the dashboard, you are greeted with a focused workspace for captured ideas, daily tasks, and quick notes.

## Key Features

- **Instant Capture**: Hit `Cmd+Shift+Y` on Mac or `Ctrl+Shift+Y` on Windows to save an idea, to-do, or note without switching tabs.
- **Focus Board**: A redesigned workspace with an asymmetric layout for ideas, today's tasks, and quick notes.
- **The Inbox**: A dumping ground for raw ideas and captured links.
- **Today's To-Dos**: A dedicated list for tasks you want to finish today.
- **Quick Notes**: A scratchpad for longer fragments, meeting takeaways, draft copy, and research trails.
- **Private by Design**: Data is stored with Chrome extension storage using `chrome.storage.sync`. QuickStash does not require an account, run an app server, or track analytics. If Chrome sync is enabled, Chrome may sync extension data through your Google account.

## Installation

Since this extension is currently in developer mode, you can install it manually by following these steps:

1. **Clone or Download** this repository to your local machine.
   ```bash
   git clone https://github.com/riteshv7/QuickStash.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click on the **Load unpacked** button in the top left.
5. Select the `QuickStash` folder you just cloned.
6. The extension is now installed! Open a new tab to see your new Focus Board.

## Privacy

QuickStash stores user-created ideas, tasks, notes, captured page titles/URLs, and theme preference with Chrome extension storage. It does not use a QuickStash account, app server, ads, or analytics.

See [docs/privacy.md](docs/privacy.md) for the full privacy policy draft.

## Launch Materials

Launch drafts, Chrome Web Store listing copy, and the product video brief live in:

- [docs/launch-kit.md](docs/launch-kit.md)
- [docs/chrome-web-store-listing.md](docs/chrome-web-store-listing.md)
- [docs/video-brief.md](docs/video-brief.md)

Promo video:

- [videos/quickstash/renders/quickstash-promo.mp4](videos/quickstash/renders/quickstash-promo.mp4)

## Shortcuts

| Action | Mac | Windows / Linux |
| :--- | :--- | :--- |
| **Capture Idea Overlay** | `Cmd + Shift + Y` | `Ctrl + Shift + Y` |

## Design & Architecture

- **Manifest V3**: Built using the latest and most secure Chrome extension architecture.
- **Service Workers**: Utilizes a background service worker (`background.js`) to handle keyboard commands and message passing efficiently.
- **Content Scripts**: Injects a lightweight overlay (`capture-overlay.js`) for the quick capture UI without disrupting the host page's DOM.
- **Vanilla Tech Stack**: Built entirely with Vanilla JavaScript, HTML5, and CSS3. No heavy frameworks, keeping the dashboard fast.

## License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <p>Built by Ritesh Verma</p>
</div>
