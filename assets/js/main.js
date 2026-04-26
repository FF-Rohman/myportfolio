(function () {
  const rootPath = getRootPath();

  document.addEventListener("DOMContentLoaded", async () => {
    await loadComponents();
    setupNavigation();
    setupRevealAnimations();
    await renderPosts();
    await renderProjects();
  });

  function getRootPath() {
    return window.location.pathname.includes("/posts/") ? "../" : "";
  }

  async function loadComponents() {
    const componentTargets = document.querySelectorAll("[data-component]");
    await Promise.all(
      Array.from(componentTargets).map(async (target) => {
        const name = target.dataset.component;
        const response = await fetch(`${rootPath}components/${name}.html`);
        if (!response.ok) {
          target.innerHTML = "";
          return;
        }
        target.innerHTML = await response.text();
      })
    );

    document.querySelectorAll("[data-link-root]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http")) {
        link.setAttribute("href", `${rootPath}${href}`);
      }
    });
  }

  function setupNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setupRevealAnimations() {
    const animated = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      animated.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animated.forEach((element) => observer.observe(element));
  }

  async function getPosts() {
    const response = await fetch(`${rootPath}data/posts.json`);
    if (!response.ok) return [];
    const posts = await response.json();
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async function renderPosts() {
    const previewTarget = document.querySelector("[data-posts-preview]");
    const listTarget = document.querySelector("[data-posts-list]");
    if (!previewTarget && !listTarget) return;

    const posts = await getPosts();

    if (previewTarget) {
      const limit = Number(previewTarget.dataset.limit || 3);
      previewTarget.innerHTML = posts.slice(0, limit).map(createPostCard).join("");
    }

    if (listTarget) {
      const filters = document.querySelectorAll("[data-category-filter]");
      const draw = (category) => {
        const visiblePosts = category === "All" ? posts : posts.filter((post) => post.category === category);
        listTarget.innerHTML = visiblePosts.map(createPostRow).join("");
      };

      filters.forEach((button) => {
        button.addEventListener("click", () => {
          filters.forEach((item) => item.classList.remove("is-active"));
          button.classList.add("is-active");
          draw(button.dataset.categoryFilter);
        });
      });

      draw("All");
    }
  }

  function createPostCard(post) {
    return `
      <article class="post-card">
        <p class="post-meta">${post.category} · ${formatDate(post.date)} · ${post.readTime}</p>
        <h3><a href="${rootPath}${post.url}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
      </article>
    `;
  }

  function createPostRow(post) {
    return `
      <article class="post-row">
        <div>
          <p class="post-meta">${post.category} · ${formatDate(post.date)} · ${post.readTime}</p>
          <h2><a href="${rootPath}${post.url}">${post.title}</a></h2>
          <p>${post.excerpt}</p>
        </div>
        <a class="read-link" href="${rootPath}${post.url}">Read</a>
      </article>
    `;
  }

  async function renderProjects() {
    const target = document.querySelector("[data-projects-list]");
    if (!target) return;

    const response = await fetch(`${rootPath}data/projects.json`);
    if (!response.ok) {
      target.innerHTML = "<p>Projects could not be loaded.</p>";
      return;
    }

    const projects = await response.json();
    target.innerHTML = projects.map(createProjectCard).join("");
  }

  function createProjectCard(project) {
    const tools = project.tools.map((tool) => `<span>${tool}</span>`).join("");
    const steps = project.steps ? project.steps.map((step) => `<li>${step}</li>`).join("") : "";
    return `
      <article class="project-card">
        <div class="project-card__top">
          <h2>${project.title}</h2>
          <span class="status">${project.status}</span>
        </div>
        <p>${project.description}</p>
        ${project.objective ? `<div class="project-detail"><h3>Objective</h3><p>${project.objective}</p></div>` : ""}
        ${steps ? `<div class="project-detail"><h3>Build notes</h3><ul>${steps}</ul></div>` : ""}
        ${project.learning ? `<div class="project-detail"><h3>Learning outcome</h3><p>${project.learning}</p></div>` : ""}
        <div class="tool-list">${tools}</div>
        <a class="read-link" href="${project.github}">GitHub repo</a>
      </article>
    `;
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(`${dateString}T00:00:00`));
  }
})();
