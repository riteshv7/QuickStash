// QuickStash — On-page Capture Overlay (Phase 2)
(function () {
  const OVERLAY_ID = "quickstash-capture-overlay-container";
  const MODE_IDEA = "idea";
  const MODE_TODO = "todo";
  const MODE_NOTE = "note";

  // Check if overlay is already open to avoid duplicates
  if (document.getElementById(OVERLAY_ID)) {
    const existingRoot = document.getElementById(OVERLAY_ID);
    if (existingRoot.shadowRoot) {
      const input = existingRoot.shadowRoot.getElementById("idea-input");
      if (input) input.focus();
    }
    return;
  }

  // Create overlay container
  const root = document.createElement("div");
  root.id = OVERLAY_ID;
  
  // Style the root container to ensure it sits on top of all page elements
  root.style.position = "fixed";
  root.style.top = "0";
  root.style.left = "0";
  root.style.width = "100vw";
  root.style.height = "100vh";
  root.style.zIndex = "2147483647"; // Max z-index
  root.style.pointerEvents = "auto";
  
  // Attach Shadow DOM to prevent host page CSS from bleeding in or out
  const shadow = root.attachShadow({ mode: "open" });

  // Overlay HTML and isolated CSS
  shadow.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box;

        /* Light Theme variables */
        --bg-card: rgba(247, 248, 245, 0.96);
        --border-color: rgba(31, 43, 38, 0.16);
        --ink: #16211d;
        --ink-soft: #53625b;
        --ink-muted: #7a8781;
        --tab-bg: rgba(255, 255, 255, 0.7);
        --input-bg: rgba(255, 255, 255, 0.86);
        --preview-bg: rgba(255, 255, 255, 0.62);
        --preview-border: rgba(31, 43, 38, 0.12);
        --preview-check-bg: #ffffff;
        --preview-check-border: rgba(31, 43, 38, 0.22);
        --accent: #2f7d68;
        --accent-soft: rgba(47, 125, 104, 0.1);
        --accent-border: rgba(47, 125, 104, 0.38);
        --shadow: 0 28px 70px rgba(22, 33, 29, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.75);
      }

      /* Auto Dark Theme Match */
      @media (prefers-color-scheme: dark) {
        :host(:not(.light-theme)) {
          --bg-card: rgba(26, 32, 29, 0.96);
          --border-color: rgba(228, 233, 226, 0.16);
          --ink: #e4e9e6;
          --ink-soft: #a1b0aa;
          --ink-muted: #73827c;
          --tab-bg: rgba(35, 42, 39, 0.7);
          --input-bg: rgba(35, 42, 39, 0.86);
          --preview-bg: rgba(35, 42, 39, 0.62);
          --preview-border: rgba(228, 233, 226, 0.12);
          --preview-check-bg: #1a201d;
          --preview-check-border: rgba(228, 233, 226, 0.22);
          --accent: #48a68b;
          --accent-soft: rgba(72, 166, 139, 0.15);
          --accent-border: rgba(72, 166, 139, 0.38);
          --shadow: 0 28px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
      }

      /* Explicit Dark Theme Choice Match */
      :host(.dark-theme) {
        --bg-card: rgba(26, 32, 29, 0.96);
        --border-color: rgba(228, 233, 226, 0.16);
        --ink: #e4e9e6;
        --ink-soft: #a1b0aa;
        --ink-muted: #73827c;
        --tab-bg: rgba(35, 42, 39, 0.7);
        --input-bg: rgba(35, 42, 39, 0.86);
        --preview-bg: rgba(35, 42, 39, 0.62);
        --preview-border: rgba(228, 233, 226, 0.12);
        --preview-check-bg: #1a201d;
        --preview-check-border: rgba(228, 233, 226, 0.22);
        --accent: #48a68b;
        --accent-soft: rgba(72, 166, 139, 0.15);
        --accent-border: rgba(72, 166, 139, 0.38);
        --shadow: 0 28px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }
      
      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 15, 13, 0.34);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 12vh;
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        width: min(720px, calc(100vw - 2rem));
        padding: 1.25rem 1.5rem;
        box-shadow: var(--shadow);
        transform: translateY(-20px);
        opacity: 0;
        animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.875rem;
      }
      
      .logo-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .logo-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.55);
      }
      
      .logo-text {
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--ink);
      }
      
      .shortcuts {
        font-size: 0.75rem;
        color: var(--ink-muted);
        display: flex;
        gap: 0.75rem;
      }
      
      .shortcut-badge {
        background: var(--input-bg);
        border: 1px solid var(--preview-border);
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        color: var(--ink-soft);
      }
      
      .input-wrapper {
        position: relative;
        width: 100%;
      }
 
      .tabs {
        display: inline-flex;
        gap: 0.5rem;
        margin-bottom: 0.875rem;
      }
 
      .tab-button {
        appearance: none;
        border: 1px solid var(--preview-border);
        background: var(--tab-bg);
        color: var(--ink-soft);
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        font: inherit;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
 
      .tab-button:hover {
        border-color: var(--accent-border);
        color: var(--ink);
      }
 
      .tab-button.active {
        background: var(--accent-soft);
        border-color: var(--accent-border);
        color: var(--ink);
        box-shadow: 0 0 0 1px rgba(47, 125, 104, 0.08);
      }
      
      input[type="text"] {
        width: 100%;
        background: var(--input-bg);
        border: 1px solid var(--border-color);
        color: var(--ink);
        font-size: 0.975rem;
        padding: 0.75rem 1rem;
        font-family: inherit;
        outline: none;
        transition: all 0.2s ease;
      }
      
      input[type="text"]:focus {
        border-color: var(--accent-border);
        box-shadow: 0 0 0 4px var(--accent-soft);
      }
      
      input[type="text"]::placeholder {
        color: var(--ink-muted);
      }
 
      .preview-panel {
        display: none;
        margin-top: 0.875rem;
        border: 1px solid var(--preview-border);
        border-radius: 10px;
        background: var(--preview-bg);
        overflow: hidden;
      }
 
      .preview-panel.visible {
        display: block;
      }
 
      .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid var(--preview-border);
        padding: 0.75rem 0.875rem;
      }
 
      .preview-title {
        color: var(--ink);
        font-size: 0.8rem;
        font-weight: 700;
      }
 
      .preview-count {
        min-width: 1.45rem;
        border: 1px solid var(--accent-border);
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        display: inline-grid;
        place-items: center;
        font-size: 0.72rem;
        font-weight: 700;
        line-height: 1;
        padding: 0.32rem 0.48rem;
      }
 
      .preview-list {
        max-height: min(34vh, 280px);
        overflow-y: auto;
        padding: 0.45rem;
      }
 
      .preview-item {
        display: grid;
        gap: 0.3rem;
        border-radius: 8px;
        padding: 0.65rem 0.7rem;
        color: var(--ink);
      }
      
      .preview-item + .preview-item {
        border-top: 1px solid var(--preview-border);
      }
 
      .preview-item.done {
        color: var(--ink-muted);
      }
 
      .preview-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.55rem;
      }
 
      .preview-row.note-row {
        grid-template-columns: minmax(0, 1fr) auto;
      }
 
      .preview-check {
        width: 0.9rem;
        height: 0.9rem;
        border: 1px solid var(--preview-check-border);
        border-radius: 4px;
        background: var(--preview-check-bg);
      }
 
      .preview-item.done .preview-check {
        border-color: var(--accent);
        background: var(--accent);
        box-shadow: inset 0 0 0 3px var(--accent);
      }
 
      .preview-text,
      .preview-note-title,
      .preview-note-body {
        min-width: 0;
        overflow-wrap: anywhere;
      }
 
      .preview-text {
        font-size: 0.86rem;
        line-height: 1.35;
      }
 
      .preview-item.done .preview-text {
        text-decoration: line-through;
      }
 
      .preview-time {
        color: var(--ink-muted);
        font-size: 0.7rem;
        font-weight: 600;
        white-space: nowrap;
      }
 
      .preview-note-title {
        color: var(--ink);
        font-size: 0.86rem;
        font-weight: 700;
        line-height: 1.3;
      }
 
      .preview-note-body {
        color: var(--ink-soft);
        font-size: 0.8rem;
        line-height: 1.38;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
 
      .preview-empty,
      .preview-loading {
        color: var(--ink-muted);
        font-size: 0.82rem;
        line-height: 1.4;
        padding: 1.15rem 0.875rem;
        text-align: center;
      }
 
      @media (max-width: 560px) {
        .backdrop {
          padding: 1rem;
          padding-top: 10vh;
        }
 
        .card {
          padding: 1rem;
        }
 
        .header {
          align-items: flex-start;
          flex-direction: column;
          gap: 0.65rem;
        }
 
        .tabs {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
 
        .tab-button {
          padding-left: 0.55rem;
          padding-right: 0.55rem;
        }
      }
      
      /* Keyframes */
      @keyframes fadeIn {
        to { background: rgba(10, 15, 13, 0.46); }
      }
      
      @keyframes slideDown {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>
    
    <div class="backdrop" id="overlay-backdrop">
      <div class="card" id="overlay-card">
        <div class="header">
          <div class="logo-group">
            <div class="logo-dot"></div>
            <span class="logo-text">QuickStash Inbox</span>
          </div>
          <div class="shortcuts">
            <span><span class="shortcut-badge">Esc</span> cancel</span>
            <span><span class="shortcut-badge">Enter</span> stash</span>
          </div>
        </div>
        <div class="tabs" role="tablist" aria-label="Capture mode">
          <button type="button" class="tab-button active" id="idea-tab" data-mode="idea" role="tab" aria-selected="true">Idea</button>
          <button type="button" class="tab-button" id="todo-tab" data-mode="todo" role="tab" aria-selected="false">To-do</button>
          <button type="button" class="tab-button" id="note-tab" data-mode="note" role="tab" aria-selected="false">Note</button>
        </div>
        <div class="input-wrapper">
          <input 
            type="text" 
            id="idea-input" 
            placeholder="Capture a quick thought or idea..." 
            spellcheck="false"
            autocomplete="off"
          >
        </div>
        <div class="preview-panel" id="mode-preview" aria-live="polite">
          <div class="preview-header">
            <span class="preview-title" id="preview-title">Saved items</span>
            <span class="preview-count" id="preview-count">0</span>
          </div>
          <div class="preview-list" id="preview-list">
            <div class="preview-loading">Loading saved items...</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Trap ALL keyboard events on the root element so they never reach the host page.
  // We use the bubbling phase (default) so that the events first reach our input element 
  // (allowing Enter/Esc to work), and then we stop them before they bubble to the host page.
  ["keydown", "keyup", "keypress", "input", "compositionstart", "compositionend", "compositionupdate"].forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      e.stopPropagation();
    });
  });

  // Also prevent focus from escaping
  root.addEventListener("focusout", (e) => {
    // If focus is leaving the overlay entirely, pull it back to the input
    setTimeout(() => {
      const active = shadow.activeElement || document.activeElement;
      const input = shadow.getElementById("idea-input");
      if (input && active !== input && document.getElementById(OVERLAY_ID)) {
        input.focus();
      }
    }, 0);
  });

  document.body.appendChild(root);

  const input = shadow.getElementById("idea-input");
  const tabButtons = Array.from(shadow.querySelectorAll(".tab-button"));
  const previewPanel = shadow.getElementById("mode-preview");
  const previewTitle = shadow.getElementById("preview-title");
  const previewCount = shadow.getElementById("preview-count");
  const previewList = shadow.getElementById("preview-list");
  let currentMode = MODE_IDEA;
  let localTodos = [];
  let localNotes = [];
  let hasLoadedLists = false;

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatRelativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  function renderPreview() {
    if (currentMode === MODE_IDEA) {
      previewPanel.classList.remove("visible");
      return;
    }

    previewPanel.classList.add("visible");

    if (!hasLoadedLists) {
      previewTitle.textContent = currentMode === MODE_TODO ? "Today's to-dos" : "Quick notes";
      previewCount.textContent = "0";
      previewList.innerHTML = `<div class="preview-loading">Loading saved items...</div>`;
      return;
    }

    if (currentMode === MODE_TODO) {
      const sortedTodos = [...localTodos].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return b.ts - a.ts;
      });
      previewTitle.textContent = "Today's to-dos";
      previewCount.textContent = sortedTodos.length;

      if (sortedTodos.length === 0) {
        previewList.innerHTML = `<div class="preview-empty">No to-dos yet. Add one above and press Enter.</div>`;
        return;
      }

      previewList.innerHTML = sortedTodos.map((todo) => `
        <div class="preview-item ${todo.done ? "done" : ""}">
          <div class="preview-row">
            <span class="preview-check" aria-hidden="true"></span>
            <span class="preview-text">${escapeHtml(todo.text)}</span>
            <span class="preview-time">${formatRelativeTime(todo.ts)}</span>
          </div>
        </div>
      `).join("");
      return;
    }

    const sortedNotes = [...localNotes].sort((a, b) => b.ts - a.ts);
    previewTitle.textContent = "Quick notes";
    previewCount.textContent = sortedNotes.length;

    if (sortedNotes.length === 0) {
      previewList.innerHTML = `<div class="preview-empty">No quick notes yet. Add one above and press Enter.</div>`;
      return;
    }

    previewList.innerHTML = sortedNotes.map((note) => {
      const body = note.body || "";
      const title = note.title || body.split(/\s+/).slice(0, 6).join(" ") || "Untitled note";
      return `
        <div class="preview-item">
          <div class="preview-row note-row">
            <span class="preview-note-title">${escapeHtml(title)}</span>
            <span class="preview-time">${formatRelativeTime(note.ts)}</span>
          </div>
          <div class="preview-note-body">${escapeHtml(body)}</div>
        </div>
      `;
    }).join("");
  }

  function loadSavedLists() {
    if (!window.chrome || !chrome.storage || !chrome.storage.sync) {
      hasLoadedLists = true;
      renderPreview();
      return;
    }

    chrome.storage.sync.get(["theme", "todos", "notes"], (result) => {
      const theme = result.theme || "system";
      if (theme === "dark") {
        root.className = "dark-theme";
      } else if (theme === "light") {
        root.className = "light-theme";
      } else {
        root.className = "";
      }
      localTodos = result.todos || [];
      localNotes = result.notes || [];
      hasLoadedLists = true;
      renderPreview();
    });
  }

  function updateMode(nextMode) {
    currentMode = [MODE_IDEA, MODE_TODO, MODE_NOTE].includes(nextMode) ? nextMode : MODE_IDEA;
    tabButtons.forEach((button) => {
      const isActive = button.dataset.mode === currentMode;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    if (currentMode === MODE_TODO) {
      input.placeholder = "Add a quick to-do...";
    } else if (currentMode === MODE_NOTE) {
      input.placeholder = "Save a quick note...";
    } else {
      input.placeholder = "Capture a quick thought or idea...";
    }
    renderPreview();
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateMode(button.dataset.mode);
      input.focus();
    });
  });

  loadSavedLists();
  updateMode(MODE_IDEA);

  // Focus input field immediately
  if (input) {
    // Small timeout ensures focus fires cleanly after DOM paint
    setTimeout(() => input.focus(), 80);
  }

  // Dismiss overlay helper
  function dismiss() {
    // Add a quick fade-out transition before removing
    const backdrop = shadow.getElementById("overlay-backdrop");
    const card = shadow.getElementById("overlay-card");
    
    if (backdrop && card) {
      backdrop.style.transition = "opacity 0.15s ease-out";
      card.style.transition = "transform 0.15s ease-out, opacity 0.15s ease-out";
      
      backdrop.style.opacity = "0";
      card.style.transform = "translateY(-15px)";
      card.style.opacity = "0";
      
      setTimeout(() => {
        root.remove();
      }, 150);
    } else {
      root.remove();
    }
  }

  // Handle outside click dismissal
  const backdrop = shadow.getElementById("overlay-backdrop");
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      dismiss();
    }
  });

  // Handle keypresses inside input
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      dismiss();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const text = input.value.trim();
      
      if (text !== "") {
        const payload = {
          action: "save-idea",
          mode: currentMode,
          text: text
        };

        if (currentMode === MODE_IDEA) {
          const url = window.location.href;
          payload.url = url;
          payload.title = document.title || url;
        } else if (currentMode === MODE_NOTE) {
          payload.body = text;
        }
        
        // Send message to background script to perform the storage sync write
        chrome.runtime.sendMessage(
          payload,
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("QuickStash save error:", chrome.runtime.lastError.message);
            } else if (response && response.success) {
              console.log("QuickStash: saved.");
            }
            dismiss();
          }
        );
      } else {
        dismiss();
      }
    }
  });
})();
