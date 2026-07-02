// QuickStash — Dashboard Controller (Phase 1)

// SVGs for UI Icons
const SVG_LINK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M11.603 7.965a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" clip-rule="evenodd" /></svg>`;
const SVG_TRASH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.223 1.484l.22-.034v9.108c0 1.782 1.45 3.233 3.234 3.233h5.178c1.783 0 3.233-1.45 3.233-3.233V5.44l.22.035a.75.75 0 10.224-1.485 41.05 41.05 0 00-2.364-.297V3.75A2.75 2.75 0 0011.25 1h-2.5zM7.5 3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.425c-.88-.053-1.767-.085-2.659-.092a48.667 48.667 0 00-2.341.092V3.75zM6.75 6v9c0 .414.336.75.75.75h5.178a.75.75 0 00.75-.75V6h-6.678z" clip-rule="evenodd" /></svg>`;
const SVG_LIGHTBULB = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a3 3 0 00-3-3H9.75a3 3 0 00-3 3v5.25m6-5.25a3 3 0 013-3h.75a3 3 0 013 3v5.25m-8.3-9.809a9 9 0 1110.6 0M12 21a8.966 8.966 0 01-5.9-2.29" /></svg>`;
const SVG_CHECKLIST = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0013.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0112 3m0 0c2.917 0 5.747.294 8.5.862m-21 1.402L3 20.25a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 20.25V5.262M3 20.25V5.262" /></svg>`;
const SVG_NOTE = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`;

// Cache in-memory lists
let localIdeas = [];
let localTodos = [];
let localNotes = [];

// Relative Time Formatter
function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Clean Domain Extractor
function getDomain(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname.replace("www.", "");
  } catch (e) {
    return "link";
  }
}

// Escapes raw strings to prevent XSS
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Render Ideas list
function renderIdeas(ideasArray) {
  const container = document.getElementById("ideas-list");
  const countBadge = document.getElementById("ideas-count");
  countBadge.textContent = ideasArray.length;
  
  if (ideasArray.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${SVG_LIGHTBULB}</div>
        <p>Your ideas inbox is empty.</p>
        <p class="empty-hint">Press Cmd+Shift+Y on Mac or Ctrl+Shift+Y on Windows to capture an idea from any webpage.</p>
      </div>
    `;
    return;
  }
  
  // Sort ideas: newest first
  const sortedIdeas = [...ideasArray].sort((a, b) => b.ts - a.ts);
  
  container.innerHTML = sortedIdeas.map(idea => {
    const timeStr = formatRelativeTime(idea.ts);
    const domain = idea.url ? getDomain(idea.url) : "";
    
    return `
      <div class="idea-item" data-id="${idea.id}" role="listitem">
        <div class="item-text">${escapeHtml(idea.text)}</div>
        <div class="idea-meta">
          ${idea.url ? `
            <a href="${escapeHtml(idea.url)}" target="_blank" class="idea-link" title="${escapeHtml(idea.title || idea.url)}">
              ${SVG_LINK}
              <span>${escapeHtml(domain)}</span>
            </a>
          ` : ""}
          <span class="idea-time" title="${new Date(idea.ts).toLocaleString()}">${timeStr}</span>
        </div>
        <button class="delete-btn" aria-label="Delete idea" data-action="delete-idea">
          ${SVG_TRASH}
        </button>
      </div>
    `;
  }).join("");
}

// Render Todos list
function renderTodos(todosArray) {
  const container = document.getElementById("todos-list");
  const countBadge = document.getElementById("todos-count");
  countBadge.textContent = todosArray.length;
  
  if (todosArray.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${SVG_CHECKLIST}</div>
        <p>No tasks for today. Add one above to focus your day.</p>
      </div>
    `;
    return;
  }
  
  // Sort todos: done at the bottom, active at the top; secondary sort by timestamp newest first
  const sortedTodos = [...todosArray].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    return b.ts - a.ts;
  });
  
  container.innerHTML = sortedTodos.map(todo => {
    return `
      <div class="todo-item ${todo.done ? "done" : ""}" data-id="${todo.id}" role="listitem">
        <div class="todo-checkbox-wrapper">
          <input type="checkbox" ${todo.done ? "checked" : ""} data-action="toggle-todo" aria-label="Toggle task completion">
          <div class="custom-checkbox"></div>
        </div>
        <div class="item-text">${escapeHtml(todo.text)}</div>
        <button class="delete-btn" aria-label="Delete task" data-action="delete-todo">
          ${SVG_TRASH}
        </button>
      </div>
    `;
  }).join("");
}

// Render Quick Notes list
function renderNotes(notesArray) {
  const container = document.getElementById("notes-list");
  const countBadge = document.getElementById("notes-count");
  countBadge.textContent = notesArray.length;

  if (notesArray.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${SVG_NOTE}</div>
        <p>No quick notes yet. Save a note when a thought needs more room.</p>
      </div>
    `;
    return;
  }

  const sortedNotes = [...notesArray].sort((a, b) => b.ts - a.ts);

  container.innerHTML = sortedNotes.map(note => {
    const timeStr = formatRelativeTime(note.ts);
    const noteBody = note.body || "";
    const fallbackTitle = noteBody.split(/\s+/).slice(0, 6).join(" ");

    return `
      <article class="note-item" data-id="${note.id}" role="listitem">
        <div class="note-topline">
          <h3>${escapeHtml(note.title || fallbackTitle || "Untitled note")}</h3>
          <span class="idea-time" title="${new Date(note.ts).toLocaleString()}">${timeStr}</span>
        </div>
        <div class="note-body">${escapeHtml(noteBody)}</div>
        <button class="delete-btn" aria-label="Delete note" data-action="delete-note">
          ${SVG_TRASH}
        </button>
      </article>
    `;
  }).join("");
}

// Load from chrome.storage.sync
function loadFromStorage() {
  chrome.storage.sync.get(["ideas", "todos", "notes"], (result) => {
    let ideas = result.ideas || [];
    let todos = result.todos || [];
    let notes = result.notes || [];
    
    // Seed initial data if completely empty on first launch
    if (!result.ideas && !result.todos && !result.notes) {
      ideas = [
        {
          id: "seed-idea-1",
          text: "Welcome to QuickStash! This is your raw ideas inbox. Capture thoughts from any webpage instantly using the hotkey.",
          url: "https://github.com",
          title: "GitHub: Let’s build from here",
          ts: Date.now()
        }
      ];
      todos = [
        {
          id: "seed-todo-1",
          text: "Add your first to-do item for today in the box below",
          done: false,
          ts: Date.now()
        }
      ];
      notes = [
        {
          id: "seed-note-1",
          title: "Scratchpad",
          body: "Quick notes are for fragments that need more space than a task: meeting takeaways, draft copy, research trails, or a small plan.",
          ts: Date.now()
        }
      ];
      chrome.storage.sync.set({ ideas, todos, notes });
    }
    
    localIdeas = ideas;
    localTodos = todos;
    localNotes = notes;
    
    renderIdeas(localIdeas);
    renderTodos(localTodos);
    renderNotes(localNotes);
  });
}

// Save to storage
function saveTodosToStorage(todos) {
  localTodos = todos;
  chrome.storage.sync.set({ todos }, () => {
    renderTodos(localTodos);
  });
}

function saveIdeasToStorage(ideas) {
  localIdeas = ideas;
  chrome.storage.sync.set({ ideas }, () => {
    renderIdeas(localIdeas);
  });
}

function saveNotesToStorage(notes) {
  localNotes = notes;
  chrome.storage.sync.set({ notes }, () => {
    renderNotes(localNotes);
  });
}

// Add a Todo
function addNewTodo(text) {
  const newTodo = {
    id: "todo-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
    text: text,
    done: false,
    ts: Date.now()
  };
  const updatedTodos = [newTodo, ...localTodos];
  saveTodosToStorage(updatedTodos);
}

// Add a Note
function addNewNote(title, body) {
  const newNote = {
    id: "note-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
    title: title,
    body: body,
    ts: Date.now()
  };
  const updatedNotes = [newNote, ...localNotes];
  saveNotesToStorage(updatedNotes);
}

// Toggle Todo Done Status
function toggleTodoDone(id, isChecked) {
  const updatedTodos = localTodos.map(todo => {
    if (todo.id === id) {
      return { ...todo, done: isChecked };
    }
    return todo;
  });
  saveTodosToStorage(updatedTodos);
}

// Delete Todo
function deleteTodoItem(id) {
  const updatedTodos = localTodos.filter(todo => todo.id !== id);
  saveTodosToStorage(updatedTodos);
}

// Delete Idea
function deleteIdeaItem(id) {
  const updatedIdeas = localIdeas.filter(idea => idea.id !== id);
  saveIdeasToStorage(updatedIdeas);
}

// Delete Note
function deleteNoteItem(id) {
  const updatedNotes = localNotes.filter(note => note.id !== id);
  saveNotesToStorage(updatedNotes);
}

// Initialize Date in Header
function initHeaderDate() {
  const dateEl = document.getElementById("current-date");
  const options = { weekday: "long", month: "short", day: "numeric" };
  dateEl.textContent = new Date().toLocaleDateString("en-US", options);
}

// Set up event listeners
function initEventHandlers() {
  // Inbox container events
  document.getElementById("ideas-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='delete-idea']");
    if (btn) {
      const card = btn.closest(".idea-item");
      if (card) {
        deleteIdeaItem(card.dataset.id);
      }
    }
  });

  // Today/Todos container events
  document.getElementById("todos-list").addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-action='toggle-todo']");
    const deleteBtn = e.target.closest("[data-action='delete-todo']");
    const card = e.target.closest(".todo-item");
    
    if (!card) return;
    
    if (toggle) {
      toggleTodoDone(card.dataset.id, toggle.checked);
    } else if (deleteBtn) {
      deleteTodoItem(card.dataset.id);
    } else {
      // Allow clicking the item body to toggle the checkbox
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox && e.target !== checkbox && !e.target.closest(".delete-btn")) {
        checkbox.checked = !checkbox.checked;
        toggleTodoDone(card.dataset.id, checkbox.checked);
      }
    }
  });

  // Add todo input event
  const todoInput = document.getElementById("todo-input");
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = todoInput.value.trim();
      if (text !== "") {
        addNewTodo(text);
        todoInput.value = "";
      }
    }
  });

  const noteForm = document.getElementById("note-form");
  const noteTitleInput = document.getElementById("note-title-input");
  const noteBodyInput = document.getElementById("note-body-input");
  const noteError = document.getElementById("note-error");

  function submitNote() {
    const title = noteTitleInput.value.trim();
    const body = noteBodyInput.value.trim();

    if (body === "") {
      noteError.textContent = "Write a note before saving.";
      noteBodyInput.focus();
      return;
    }

    noteError.textContent = "";
    addNewNote(title, body);
    noteTitleInput.value = "";
    noteBodyInput.value = "";
    noteBodyInput.focus();
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitNote();
  });

  noteBodyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitNote();
    }
  });

  noteBodyInput.addEventListener("input", () => {
    if (noteError.textContent) {
      noteError.textContent = "";
    }
  });

  document.getElementById("notes-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='delete-note']");
    if (btn) {
      const card = btn.closest(".note-item");
      if (card) {
        deleteNoteItem(card.dataset.id);
      }
    }
  });
}

// Theme Management
let currentTheme = "system";

function applyTheme(theme) {
  currentTheme = theme;
  const rootEl = document.documentElement;
  
  if (theme === "dark") {
    rootEl.classList.add("dark-theme");
    rootEl.classList.remove("light-theme");
  } else if (theme === "light") {
    rootEl.classList.add("light-theme");
    rootEl.classList.remove("dark-theme");
  } else {
    rootEl.classList.remove("dark-theme");
    rootEl.classList.remove("light-theme");
  }
  
  // Highlight active selector button
  const buttons = document.querySelectorAll(".theme-btn");
  buttons.forEach(btn => {
    const isActive = btn.dataset.theme === theme;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", String(isActive));
  });
}

function initTheme() {
  chrome.storage.sync.get("theme", (result) => {
    const savedTheme = result.theme || "system";
    applyTheme(savedTheme);
  });

  const selector = document.getElementById("theme-selector");
  if (selector) {
    selector.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-btn");
      if (btn) {
        const theme = btn.dataset.theme;
        applyTheme(theme);
        chrome.storage.sync.set({ theme });
      }
    });
  }
}

// Watch for storage changes (updates dashboard dynamically across multiple open tabs/windows)
function initStorageListener() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync") {
      if (changes.ideas) {
        localIdeas = changes.ideas.newValue || [];
        renderIdeas(localIdeas);
      }
      if (changes.todos) {
        localTodos = changes.todos.newValue || [];
        renderTodos(localTodos);
      }
      if (changes.notes) {
        localNotes = changes.notes.newValue || [];
        renderNotes(localNotes);
      }
      if (changes.theme) {
        applyTheme(changes.theme.newValue || "system");
      }
    }
  });
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initHeaderDate();
  loadFromStorage();
  initEventHandlers();
  initStorageListener();
});
