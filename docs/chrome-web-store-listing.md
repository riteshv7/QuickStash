# Chrome Web Store Listing Draft

## Extension Name

QuickStash

## Short Description

Capture ideas from any page and sort them on a focused new tab board.

## Detailed Description

QuickStash turns your browser into a small capture system for loose thoughts, tasks, and notes.

Press `Cmd+Shift+Y` on Mac or `Ctrl+Shift+Y` on Windows/Linux from any page to open a capture overlay. Save an idea without switching tabs. Open a new tab to triage what you captured on a Focus Board with three spaces:

- Inbox for raw ideas and links
- Today for tasks you commit to finishing
- Quick Notes for longer fragments

QuickStash is built with vanilla HTML, CSS, and JavaScript on Manifest V3. It has no QuickStash account, no app server, and no tracking.

Data is stored with Chrome extension storage using `chrome.storage.sync`. If Chrome sync is enabled in your browser, Chrome may sync this data through your Google account.

## Category

Productivity

## Single Purpose

QuickStash lets users capture ideas, tasks, and notes from the current browser tab, then organize them from a custom new tab dashboard.

## Permission Justification

### `storage`

Used to save captured ideas, tasks, notes, and theme settings.

### `scripting`

Used to inject the capture overlay into the active page after the user presses the extension shortcut.

### `activeTab`

Used to access the current tab only after a user action, so QuickStash can open the capture overlay and attach the current page title and URL to captured ideas.

## Privacy Disclosure Copy

QuickStash stores user-created ideas, tasks, notes, source page titles/URLs for captures, and theme preference with Chrome extension storage. QuickStash does not collect analytics, does not use ads, does not require an account, and does not send data to a QuickStash server.

## Screenshot Plan

1. New tab Focus Board with realistic sample ideas, tasks, and notes.
2. Capture overlay opened on a normal webpage.
3. Inbox showing a saved page link and timestamp.
4. Today column with active and completed tasks.
5. Quick Notes with a saved longer note.

## Promo Tile Text

Capture the thought where it happens.

## Support URL

https://github.com/riteshv7/QuickStash/issues
