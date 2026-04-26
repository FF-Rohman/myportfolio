# Static Networking and Cybersecurity Portfolio

This is a fully static personal blog and portfolio for GitHub Pages. It uses only HTML, CSS, and vanilla JavaScript.

## Folder Structure

```text
.
├── assets/
│   ├── css/styles.css
│   ├── docs/resume.pdf
│   └── js/main.js
├── components/
│   ├── footer.html
│   └── navbar.html
├── data/
│   ├── posts.json
│   └── projects.json
├── posts/
│   ├── linux-terminal-notes.html
│   ├── subnetting-basics.html
│   └── wireshark-first-capture.html
├── about.html
├── blog.html
├── contact.html
├── index.html
├── projects.html
└── resume.html
```

## Editing Content

- Update GitHub, LinkedIn, and any custom copy in the HTML files and components.
- Add blog metadata to `data/posts.json`.
- Add each full article as a static HTML file in `posts/`.
- Add portfolio items to `data/projects.json`.
- Replace `assets/docs/resume.pdf` with your real resume PDF.
- Replace the Formspree URL in `contact.html` with your own form endpoint.

## GitHub Pages Notes

- Keep links relative so the site works on GitHub Pages and with a custom domain.
- No backend or server-side code is required.
- Because this site uses `fetch()` for components and JSON, preview it with a local static server instead of opening files directly.

Example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Future Upgrade Path

The current structure keeps content, presentation, and rendering logic separate. Later, the same content model can be migrated to a Node.js backend, MongoDB database, admin dashboard, or newsletter system without rewriting the visual layer from scratch.
