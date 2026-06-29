// QuickStash — Service Worker (Phase 2)

// Listen for keyboard command shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "capture-idea") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        handleAction(activeTab);
      }
    });
  }
});

// Listen for toolbar icon click
chrome.action.onClicked.addListener((tab) => {
  // Always open the dashboard when the user clicks the toolbar icon
  openDashboard();
});

// Common handler for the hotkey command
function handleAction(tab) {
  if (!tab || !tab.id) {
    console.warn("No active tab found.");
    return;
  }

  const url = tab.url || "";
  // Check if we are allowed to inject scripts on this page
  if (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:") ||
    url.includes("chrome.google.com/webstore") ||
    url.includes("chromewebstore.google.com")
  ) {
    // Fallback: open dashboard in a new tab if injection is not allowed
    openDashboard();
  } else {
    // Inject the capture overlay script into the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["capture-overlay.js"]
    }).then(() => {
      console.log("Successfully injected capture-overlay.js into tab:", tab.id);
    }).catch((error) => {
      console.error("Error injecting capture-overlay.js, falling back to dashboard:", error);
      openDashboard();
    });
  }
}

// Helper to open the dashboard in a new tab
function openDashboard() {
  chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
}

// Listen for messages from the injected capture-overlay
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === "save-idea") {
    const mode = message.mode === "todo" ? "todo" : "idea";

    if (mode === "todo") {
      const newTodo = {
        id: "todo-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        text: message.text,
        done: false,
        ts: Date.now()
      };

      chrome.storage.sync.get("todos", (result) => {
        const todos = result.todos || [];
        todos.push(newTodo);

        chrome.storage.sync.set({ todos }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving todo to storage:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log("New todo saved successfully:", newTodo);
            sendResponse({ success: true });
          }
        });
      });
    } else {
      const newIdea = {
        id: "idea-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        text: message.text,
        url: message.url,
        title: message.title,
        ts: Date.now()
      };

      // Keep storage writes inside the background worker
      chrome.storage.sync.get("ideas", (result) => {
        const ideas = result.ideas || [];
        ideas.push(newIdea);
        
        chrome.storage.sync.set({ ideas }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving idea to storage:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log("New idea saved successfully:", newIdea);
            sendResponse({ success: true });
          }
        });
      });
    }

    // Return true to indicate we will send response asynchronously
    return true;
  }
});
