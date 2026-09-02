// Command registry. Each command returns an HTML string (or "" when it handles
// its own output through ctx).

import { profile, education, experience, projects, skills, awards, contact } from "./content.js";
import { banner, bunny } from "./ascii.js";

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

const head = (title, sub = "") =>
  `<h2 class="sec-title">${esc(title)}${sub ? `<span class="sec-sub">${esc(sub)}</span>` : ""}</h2>`;

const tags = (items) =>
  `<p class="tags">${items.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</p>`;

const bullets = (items) =>
  `<ul class="bullets">${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;

const cmdLink = (c, label = c) =>
  `<button class="inline-cmd" data-cmd="${esc(c)}">${esc(label)}</button>`;

const extLink = (href, label) =>
  `<a class="link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

function projectCard(p, compact) {
  const meta = [p.role, p.when].filter(Boolean).join(" · ");
  return `
    <article class="card">
      <div class="card-head">
        <span class="card-name">${esc(p.name)}</span>
        <span class="card-meta">${esc(meta)}</span>
      </div>
      <p class="card-tagline">${esc(p.tagline)}</p>
      ${p.badge ? `<p class="badge">★ ${esc(p.badge)}</p>` : ""}
      ${tags(p.stack)}
      ${compact
        ? `<p class="hint-line">${cmdLink(`projects ${p.id}`, `read more →`)}</p>`
        : bullets(p.bullets)}
    </article>`;
}

function jobCard(j) {
  return `
    <article class="card">
      <div class="card-head">
        <span class="card-name">${esc(j.role)}</span>
        <span class="card-meta">${esc(j.when)}</span>
      </div>
      <p class="card-tagline">${esc(j.org)} — ${esc(j.where)}</p>
      ${tags(j.stack)}
      ${bullets(j.bullets)}
    </article>`;
}

export const commands = {
  help: {
    desc: "list every command",
    run: () => {
      const rows = Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(
          ([name, c]) =>
            `<tr><td>${cmdLink(name)}</td><td class="muted">${esc(c.desc)}</td></tr>`
        )
        .join("");
      return `
        ${head("commands", "click one, or type it and hit enter")}
        <table class="help">${rows}</table>
        <p class="hint-line muted">tab completes · ↑ ↓ walks history · a few commands aren't on this list</p>`;
    },
  },

  about: {
    desc: "who I am",
    run: () => `
      ${head("about", profile.role)}
      <p class="lede">${profile.blurb.join("<br>")}</p>
      <p class="hint-line">${cmdLink("projects")} ${cmdLink("experience")} ${cmdLink("contact")}</p>`,
  },

  projects: {
    desc: "things I've built",
    usage: "projects [name]",
    run: (args) => {
      const key = (args[0] || "").toLowerCase();
      if (key) {
        const p = projects.find(
          (x) => x.id === key || x.name.toLowerCase().startsWith(key)
        );
        if (!p)
          return `<p class="err">no project called "${esc(key)}". try ${cmdLink("projects")}</p>`;
        return `${head(p.name, p.tagline)}${projectCard(p, false)}`;
      }
      return `
        ${head("projects", `${projects.length} of them`)}
        ${projects.map((p) => projectCard(p, true)).join("")}`;
    },
  },

  experience: {
    desc: "where I've worked",
    run: () => `
      ${head("experience")}
      ${experience.map(jobCard).join("")}`,
  },

  skills: {
    desc: "the toolbox",
    run: () => `
      ${head("skills")}
      ${skills
        .map(
          (s) => `<div class="skill-row"><span class="skill-group">${esc(s.group)}</span>${tags(s.items)}</div>`
        )
        .join("")}`,
  },

  awards: {
    desc: "wins & leadership",
    run: () => `
      ${head("awards & leadership")}
      <ul class="awards">${awards
        .map(
          (a) =>
            `<li><span class="award-what">${esc(a.what)}</span>${
              a.detail ? `<span class="muted"> — ${esc(a.detail)}</span>` : ""
            }</li>`
        )
        .join("")}</ul>`,
  },

  education: {
    desc: "the degree",
    run: () => `
      ${head("education")}
      <p class="lede"><b>${esc(education.school)}</b><br>${esc(education.degree)}<br><span class="muted">${esc(education.years)}</span></p>`,
  },

  contact: {
    desc: "say hi",
    run: () => `
      ${head("contact", "I reply to everything")}
      <table class="kv">
        <tr><td class="muted">email</td><td>${extLink("mailto:" + contact.email, contact.email)}</td></tr>
        <tr><td class="muted">github</td><td>${extLink(contact.github, "github.com/gkau306")}</td></tr>
        <tr><td class="muted">linkedin</td><td>${extLink(contact.linkedin, "in/gurleen-kaur")}</td></tr>
        <tr><td class="muted">location</td><td>${esc(profile.location)}</td></tr>
      </table>
      <p class="hint-line">${cmdLink("resume", "or grab the resume →")}</p>`,
  },

  resume: {
    desc: "download the PDF",
    run: () => `
      ${head("resume")}
      <p class="lede">${extLink(contact.resume, "Gurleen_Kaur_Resume.pdf ↓")}</p>`,
  },

  theme: {
    desc: "toggle light / dark pink",
    run: (args, ctx) => {
      const next = args[0] || (ctx.theme() === "dark" ? "light" : "dark");
      if (!["light", "dark"].includes(next))
        return `<p class="err">usage: theme [light|dark]</p>`;
      ctx.setTheme(next);
      return `<p class="ok">theme → ${next} 🌸</p>`;
    },
  },

  clear: {
    desc: "wipe the screen",
    run: (args, ctx) => {
      ctx.clear();
      return "";
    },
  },

  // --- easter eggs ---------------------------------------------------------
  banner: { hidden: true, desc: "the big name", run: () => `<pre class="ascii">${banner}</pre>` },
  whoami: { hidden: true, desc: "you", run: () => `<p class="ok">a very good visitor</p>` },
  ls: {
    hidden: true,
    desc: "list sections",
    run: () =>
      `<p class="ls">${["about", "projects", "experience", "skills", "awards", "education", "contact", "resume"]
        .map((c) => cmdLink(c))
        .join("")}</p>`,
  },
  sudo: {
    hidden: true,
    desc: "nice try",
    run: () => `<p class="err">gurleen is not in the sudoers file. this incident has been reported 🌸</p>`,
  },
  bunny: {
    hidden: true,
    desc: "the old portfolio",
    run: () => `<pre class="ascii small">${bunny}</pre><p class="muted">this site used to be a pixel bunny game. she's retired now, but she's fine.</p>`,
  },
  coffee: {
    hidden: true,
    desc: "brew",
    run: () => `<p class="ok">☕ brewing... error 418: I'm a teapot. and a compsci student. mostly the second one.</p>`,
  },
  cd: { hidden: true, desc: "go somewhere", run: (a) => `<p class="muted">there's nowhere to go — try ${cmdLink("ls")}</p>` },
  exit: { hidden: true, desc: "leave", run: () => `<p class="muted">you can't exit, you're just on a website 🌸</p>` },
};

export const commandNames = Object.keys(commands);
