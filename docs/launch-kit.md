# QuickStash Launch Kit

Use this when posting QuickStash or preparing launch assets.

## Positioning

QuickStash is a browser-native idea inbox and focus board.

Core line:

> Capture the thought where it happens. Sort it when you open a new tab.

Use this framing:

- A lightweight Chrome extension for people who lose ideas while browsing.
- A shortcut capture overlay plus a focused new tab board.
- No QuickStash account, no app server, no tracking.
- Built with vanilla HTML/CSS/JS on Manifest V3.

Avoid saying "local-only" while the extension uses `chrome.storage.sync`.

## Post Order

### Before Chrome Web Store Approval

1. `r/chrome_extensions`
2. `r/SideProject`
3. Hacker News `Show HN`
4. dev.to or Hashnode build writeup
5. X/Twitter build-in-public post

### After Chrome Web Store Approval

1. Product Hunt
2. `r/productivity`
3. `r/ProductivityApps`
4. Broader productivity newsletters and communities

Use `r/ClaudeAI` only for a build-with-Claude story. A generic productivity extension post will likely read as off-topic.

## Asset Checklist

- [ ] 5-8 second GIF: shortcut opens overlay, user saves an idea, new tab shows it in Inbox.
- [ ] Screenshot: new tab Focus Board with realistic sample content.
- [ ] Screenshot: capture overlay on a normal webpage.
- [ ] Screenshot: Today column with active and completed tasks.
- [ ] Screenshot: Quick Notes with longer note content.
- [ ] Install status line: "Load-unpacked today; Chrome Web Store submission next" or the Web Store link.
- [ ] Privacy link, using `docs/privacy.md` as the source.

## Post Drafts

### r/chrome_extensions

Title:

I built QuickStash, a new-tab focus board with shortcut capture from any page

Body:

I kept losing useful thoughts while browsing, then finding them later as half-written notes in three different apps. I built QuickStash to keep capture close to the browser.

Press `Cmd+Shift+Y` on Mac or `Ctrl+Shift+Y` on Windows/Linux from any page and a capture overlay opens. Save the thought, keep browsing, then open a new tab when you want to sort it.

The new tab board has three spaces:

- Inbox for raw ideas and links
- Today for tasks you commit to
- Quick Notes for longer fragments

It is Manifest V3, vanilla HTML/CSS/JS, no QuickStash account, no app server, no tracking. Data uses Chrome extension storage (`chrome.storage.sync`), so Chrome may sync it if you have Chrome sync enabled.

Repo:
https://github.com/riteshv7/QuickStash

It is load-unpacked right now; Chrome Web Store submission is next. I would love feedback on the capture flow: does Inbox/Today/Notes feel like the right split?

### r/SideProject

Title:

QuickStash: capture ideas from any page, then sort them on your new tab

Body:

I built a small Chrome extension because I kept losing ideas in the middle of browsing.

QuickStash gives you a shortcut capture overlay from any page. Hit `Cmd+Shift+Y` or `Ctrl+Shift+Y`, write the thought, and keep moving. Your new tab becomes a Focus Board with an Inbox, a Today list, and Quick Notes.

No QuickStash account, no app server, no tracking. It is open source and built with vanilla HTML/CSS/JS on Manifest V3.

Repo:
https://github.com/riteshv7/QuickStash

Current status: load-unpacked while I prep the Chrome Web Store listing.

Feedback welcome, especially on whether the new tab board feels useful enough to replace a normal blank tab.

### Hacker News

Title:

Show HN: QuickStash, a Chrome extension for shortcut idea capture

Body:

QuickStash is a small Manifest V3 Chrome extension for capturing ideas, tasks, and notes from the browser.

`Cmd+Shift+Y` on Mac or `Ctrl+Shift+Y` on Windows/Linux opens an overlay on the current page. Saved ideas can include the source page title and URL. The new tab page becomes a Focus Board with Inbox, Today, and Quick Notes columns.

It uses vanilla HTML/CSS/JS and Chrome extension storage (`chrome.storage.sync`). There is no QuickStash account, backend, analytics, or tracking.

Repo:
https://github.com/riteshv7/QuickStash

It is load-unpacked for now while I prep the Chrome Web Store submission. I would appreciate feedback on the capture UX and the storage/privacy wording.

### X/Twitter

I built QuickStash, a tiny Chrome extension for the thoughts you lose while browsing.

`Cmd+Shift+Y` / `Ctrl+Shift+Y` opens a capture overlay on any page.

New tab gives you:
- Inbox for raw ideas
- Today for committed tasks
- Quick Notes for longer fragments

No account. No app server. No tracking.

Repo:
https://github.com/riteshv7/QuickStash

Chrome Web Store submission next.

### dev.to / Hashnode Outline

Title:

Building QuickStash: a browser-native idea inbox with Manifest V3

Outline:

1. The problem: losing thoughts while browsing.
2. The product shape: shortcut capture plus new tab triage.
3. Why Manifest V3 and vanilla JS were enough.
4. How the overlay works with `activeTab` and `scripting`.
5. Why storage copy must be honest: `chrome.storage.sync`, not "local-only."
6. What I would improve next: Web Store release, screenshots, keyboard polish, export/import.

## Launch Checklist

### Product

- [x] Manifest V3 extension exists.
- [x] Icons exist at 16, 48, and 128 px.
- [x] New tab override is declared in `manifest.json`.
- [ ] Manual smoke test in Chrome: install unpacked, open new tab, save idea, save task, save note, delete each item.
- [ ] Test restricted pages: pressing shortcut on `chrome://extensions` should open the dashboard fallback.
- [ ] Confirm no production-facing `console.log` noise is needed.

### Store

- [ ] Pay/register Chrome Web Store developer account.
- [ ] Create extension ZIP from release files only.
- [ ] Upload ZIP.
- [ ] Fill listing with `docs/chrome-web-store-listing.md`.
- [ ] Host or publish privacy policy from `docs/privacy.md`.
- [ ] Add screenshots and GIF/video.
- [ ] Submit for review.

### Community

- [ ] Post only after a screenshot or GIF is ready.
- [ ] Space posts across days.
- [ ] Reply to comments for the first 2 hours after each post.
- [ ] Update posts with Web Store link when approved.

## Success Signals

- At least 5 useful pieces of UX feedback from dev communities.
- At least 20 GitHub stars or direct installs from early posts.
- Chrome Web Store approval.
- Web Store listing converts better than load-unpacked posts.
