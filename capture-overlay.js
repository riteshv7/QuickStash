// QuickStash — On-page Capture Overlay (Phase 2)
(function () {
  const OVERLAY_ID = "quickstash-capture-overlay-container";
  const MODE_IDEA = "idea";
  const MODE_TODO = "todo";

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
      }
      
      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(8, 10, 15, 0.4);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 12vh;
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .card {
        background: rgba(15, 22, 42, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        width: 520px;
        max-width: 90%;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
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
        background: linear-gradient(135deg, #818cf8, #3b82f6);
        box-shadow: 0 0 8px #818cf8;
      }
      
      .logo-text {
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #f8fafc;
      }
      
      .shortcuts {
        font-size: 0.75rem;
        color: #64748b;
        display: flex;
        gap: 0.75rem;
      }
      
      .shortcut-badge {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        color: #94a3b8;
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
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
        color: #94a3b8;
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        font: inherit;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tab-button:hover {
        border-color: rgba(255, 255, 255, 0.18);
        color: #cbd5e1;
      }

      .tab-button.active {
        background: rgba(129, 140, 248, 0.18);
        border-color: rgba(129, 140, 248, 0.45);
        color: #f8fafc;
        box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.12);
      }
      
      input[type="text"] {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: #f8fafc;
        font-size: 0.975rem;
        padding: 0.75rem 1rem;
        font-family: inherit;
        outline: none;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
      }
      
      input[type="text"]:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      input[type="text"]::placeholder {
        color: #475569;
      }
      
      /* Keyframes */
      @keyframes fadeIn {
        to { background: rgba(8, 10, 15, 0.5); }
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
          <button type="button" class="tab-button active" id="idea-tab" data-mode="idea" role="tab" aria-selected="true">💡 Idea</button>
          <button type="button" class="tab-button" id="todo-tab" data-mode="todo" role="tab" aria-selected="false">✅ To-do</button>
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
  let currentMode = MODE_IDEA;

  function updateMode(nextMode) {
    currentMode = nextMode === MODE_TODO ? MODE_TODO : MODE_IDEA;
    tabButtons.forEach((button) => {
      const isActive = button.dataset.mode === currentMode;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    input.placeholder = currentMode === MODE_IDEA
      ? "Capture a quick thought or idea..."
      : "Add a quick to-do...";
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateMode(button.dataset.mode);
      input.focus();
    });
  });

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
        }
        
        // Send message to background script to perform the storage sync write
        chrome.runtime.sendMessage(
          payload,
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("QuickStash save error:", chrome.runtime.lastError.message);
            } else if (response && response.success) {
              console.log("QuickStash: Idea stashed!");
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
