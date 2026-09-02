// Terminal engine: input, history, completion, output.

import { commands, commandNames } from "./commands.js";
import { profile } from "./content.js";
import { banner } from "./ascii.js";

const out = document.getElementById("output");
const input = document.getElementById("input");
const form = document.getElementById("prompt-form");
const screen = document.getElementById("screen");

const HISTORY_KEY = "gk_history";
const THEME_KEY = "gk_theme";

let history = [];
let histIndex = 0;
let busy = false;

/* ---------- theme ---------- */
const theme = () => document.documentElement.dataset.theme || "light";
function setTheme(next) {
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch {}
  document.getElementById("theme-btn").textContent = next === "dark" ? "☾ dark" : "☀ light";
}
try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) setTheme(saved);
} catch {}

/* ---------- output ---------- */
function append(html, cls = "") {
  if (!html) return null;
  const block = document.createElement("div");
  block.className = `block ${cls}`.trim();
  block.innerHTML = html;
  out.appendChild(block);
  requestAnimationFrame(() => block.classList.add("in"));
  scroll();
  return block;
}

function scroll() {
  screen.scrollTop = screen.scrollHeight;
}

function echoCommand(raw) {
  append(
    `<span class="prompt-user">${profile.handle}</span><span class="prompt-sep">@</span><span class="prompt-host">portfolio</span><span class="prompt-path">~</span><span class="prompt-caret">❯</span> <span class="echo">${raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")}</span>`,
    "echoed"
  );
}

const ctx = { clear: () => (out.innerHTML = ""), setTheme, theme };

/* ---------- running ---------- */
function run(raw) {
  const line = raw.trim();
  if (!line) return;
  echoCommand(line);
  if (history[history.length - 1] !== line) history.push(line);
  histIndex = history.length;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50))); } catch {}

  const [name, ...args] = line.split(/\s+/);
  const cmd = commands[name.toLowerCase()];
  if (!cmd) {
    append(
      `<p class="err">command not found: ${name.replace(/</g, "&lt;")} — type <button class="inline-cmd" data-cmd="help">help</button> for the list</p>`
    );
    return;
  }
  append(cmd.run(args, ctx));
  if (!["clear", "theme"].includes(name.toLowerCase())) {
    history.length && (location.hash = name.toLowerCase());
  }
}

/* type a command into the prompt, then run it (used by clickable commands) */
function typeAndRun(text) {
  if (busy) return;
  busy = true;
  input.value = "";
  let i = 0;
  const tick = () => {
    input.value = text.slice(0, ++i);
    if (i < text.length) return setTimeout(tick, 28);
    setTimeout(() => {
      input.value = "";
      busy = false;
      run(text);
      input.focus();
    }, 140);
  };
  tick();
}

/* ---------- input ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = input.value;
  input.value = "";
  run(v);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    run(v);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIndex > 0) input.value = history[--histIndex] ?? "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (histIndex < history.length - 1) input.value = history[++histIndex] ?? "";
    else {
      histIndex = history.length;
      input.value = "";
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const v = input.value.trim().toLowerCase();
    if (!v) return;
    const matches = commandNames.filter((c) => c.startsWith(v) && !commands[c].hidden);
    if (matches.length === 1) input.value = matches[0] + " ";
    else if (matches.length > 1) append(`<p class="muted">${matches.join("  ")}</p>`);
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    ctx.clear();
  }
});

/* clicking any [data-cmd] runs it */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-cmd]");
  if (!el) return;
  typeAndRun(el.dataset.cmd);
});

/* keep focus on the prompt unless the user is selecting text or clicking a link */
document.addEventListener("mouseup", (e) => {
  if (window.getSelection().toString()) return;
  if (e.target.closest("a, button")) return;
  input.focus();
});

document.getElementById("theme-btn").addEventListener("click", () =>
  setTheme(theme() === "dark" ? "light" : "dark")
);

/* ---------- boot ---------- */
const bootLines = [
  `<pre class="ascii banner">${banner}</pre>`,
  `<p class="sub">${profile.role}<br><span class="muted">${profile.location}</span></p>`,
  `<p class="boot-hint">type a command, or click one below — start with <button class="inline-cmd" data-cmd="about">about</button> or <button class="inline-cmd" data-cmd="projects">projects</button></p>`,
];

function boot() {
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    histIndex = history.length;
  } catch {}

  bootLines.forEach((html, i) => setTimeout(() => append(html, "boot"), i * 220));

  const hash = location.hash.replace("#", "").toLowerCase();
  if (hash && commands[hash]) {
    setTimeout(() => typeAndRun(hash), bootLines.length * 220 + 200);
  }
  setTimeout(() => input.focus(), 400);
}

boot();
