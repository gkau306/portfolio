# 🌸 gurleen@portfolio

A little pink terminal you navigate with commands. Type `projects`, hit enter.

Live: https://gkau306.github.io/portfolio

No build step, no dependencies — plain HTML, CSS and ES modules. Push to `main` and
GitHub Pages serves it.

## Run locally

```bash
python3 .claude/devserver.py
```

Then open http://localhost:4321. It must be served over http, not opened as a file —
ES modules don't load from `file://`. The dev server sends `no-store`, so edits to
`js/*.js` show up on a plain reload instead of being cached.

## Editing

| File | What's in it |
| --- | --- |
| `js/content.js` | **All the words.** Bio, experience, projects, skills, awards, contact. Edit here first. |
| `js/commands.js` | The commands themselves and how each section is laid out. |
| `js/app.js` | Terminal engine — input, history, tab-completion, boot sequence, theme. |
| `js/ascii.js` | The ASCII banner. |
| `styles.css` | Pink. All the pink lives in the `:root` tokens at the top. |
| `assets/` | Project screenshots, under `assets/projects/<id>/`. |

### Adding a project

Append an object to the `projects` array in `js/content.js`:

```js
{
  id: "my-thing",              // used by `projects my-thing`
  name: "My Thing",
  tagline: "one line, lowercase-ish",
  role: "Solo build",
  when: "2026",
  badge: "Winner · Some Hackathon",   // optional, shows as a ★ pill
  stack: ["TypeScript", "Postgres"],
  bullets: ["what it does", "the interesting engineering bit"],
}
```

### Adding screenshots to a project

Put the files in `assets/projects/<project-id>/` and list them on the project:

```js
images: [
  { src: "assets/projects/erica/01-landing.png", alt: "caption shown under the full-size view" },
],
links: [{ label: "Case study ↗", href: "https://…" }],
```

Thumbnails appear on the project card; clicking one opens it full-size (Esc or
click to close). A missing file removes its own thumbnail, so nothing ever
renders as a broken image.

### Adding a command

Add an entry to `commands` in `js/commands.js`. It returns an HTML string:

```js
playlist: {
  desc: "what I code to",
  run: () => `${head("playlist")}<p class="lede">…</p>`,
},
```

Set `hidden: true` to keep it off `help` — that's how the easter eggs work
(`sudo`, `bunny`, `coffee`, `whoami`, `banner`, `ls`).

## Features

- Command navigation with tab-completion, `↑ ↓` history (persisted), `ctrl-l` to clear
- Everything is also clickable — recruiters don't have to know what a terminal is
- Deep links: `#projects`, `#experience`, `#contact` open straight to that section
- Light and dark pink themes, remembered across visits
- Responsive: the sidebar becomes a chip bar on mobile
- Respects `prefers-reduced-motion`

---

*Previously: a pixel bunny game. She's retired but she's fine — type `bunny`.*
