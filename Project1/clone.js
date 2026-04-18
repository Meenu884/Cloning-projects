const repos = [
    {
      name: "react-ui-components",
      description: "Reusable React UI components for fast frontends.",
      language: "React",
      stars: 124,
      forks: 18,
      updatedAt: "2026-03-10",
      cloneUrl: "https://github.com/example/react-ui-components.git"
    },
    {
      name: "html-css-layouts",
      description: "Practice layouts: navbar, cards, responsive sections.",
      language: "CSS",
      stars: 90,
      forks: 9,
      updatedAt: "2026-02-28",
      cloneUrl: "https://github.com/example/html-css-layouts.git"
    },
    {
      name: "javascript-mini-projects",
      description: "Small JS apps: modal, theme toggle, filtering demos.",
      language: "JavaScript",
      stars: 211,
      forks: 37,
      updatedAt: "2026-03-01",
      cloneUrl: "https://github.com/example/javascript-mini-projects.git"
    },
    {
      name: "simple-html-pages",
      description: "Beginner-friendly HTML pages and templates.",
      language: "HTML",
      stars: 58,
      forks: 6,
      updatedAt: "2026-01-20",
      cloneUrl: "https://github.com/example/simple-html-pages.git"
    },
    {
      name: "portfolio-react",
      description: "Portfolio UI built with React and simple routing ideas.",
      language: "React",
      stars: 76,
      forks: 10,
      updatedAt: "2026-03-12",
      cloneUrl: "https://github.com/example/portfolio-react.git"
    },
    {
      name: "css-animations-lab",
      description: "Hover effects and small animations for UI practice.",
      language: "CSS",
      stars: 133,
      forks: 21,
      updatedAt: "2026-02-15",
      cloneUrl: "https://github.com/example/css-animations-lab.git"
    }
  ];
  
  const $ = (sel) => document.querySelector(sel);
  
  const repoGrid = $("#repoGrid");
  const emptyState = $("#emptyState");
  const repoCount = $("#repoCount");
  const searchInput = $("#searchInput");
  const activeLangBadge = $("#activeLangBadge");
  const toast = $("#toast");
  const themeBtn = $("#themeBtn");
  const cloneAllBtn = $("#cloneAllBtn");
  
  let activeLang = "all";
  
  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }
  
  function langColor(lang) {
    // Just for visual variety
    const map = {
      "JavaScript": "rgba(245,158,11,.30)",
      "HTML": "rgba(239,68,68,.25)",
      "CSS": "rgba(59,130,246,.25)",
      "React": "rgba(124,58,237,.25)"
    };
    return map[lang] || "rgba(255,255,255,.08)";
  }
  
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove("is-show"), 1600);
  }
  
  function matchesRepo(repo) {
    const q = (searchInput.value || "").trim().toLowerCase();
    const langOk = activeLang === "all" ? true : repo.language === activeLang;
    const queryOk = !q
      ? true
      : (repo.name.toLowerCase().includes(q) || repo.description.toLowerCase().includes(q));
    return langOk && queryOk;
  }
  
  function render() {
    const filtered = repos.filter(matchesRepo);
  
    repoGrid.innerHTML = "";
    emptyState.style.display = filtered.length ? "none" : "block";
    repoCount.textContent = `${filtered.length} repositories found`;
  
    activeLangBadge.textContent = `Showing: ${activeLang === "all" ? "All" : activeLang}`;
  
    if (!filtered.length) return;
  
    for (const repo of filtered) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card__title">
          <div class="card__name">${repo.name}</div>
          <div class="card__lang" style="background:${langColor(repo.language)}; border-color:rgba(255,255,255,.10)">
            ${repo.language}
          </div>
        </div>
        <div class="card__desc">${repo.description}</div>
        <div class="card__meta">
          <span class="meta-pill">★ ${repo.stars}</span>
          <span class="meta-pill">⑂ ${repo.forks}</span>
          <span class="meta-pill">Updated ${formatDate(repo.updatedAt)}</span>
        </div>
        <div class="card__actions">
          <button class="small-btn" type="button" data-action="copy" data-url="${repo.cloneUrl}">
            Copy clone URL
          </button>
        </div>
      `;
  
      card.addEventListener("click", async (e) => {
        const btn = e.target.closest("button[data-action='copy']");
        if (!btn) return;
  
        const url = btn.getAttribute("data-url");
        try {
          await navigator.clipboard.writeText(url);
          showToast("Clone URL copied!");
        } catch {
          // Fallback if clipboard permission fails
          showToast("Copy failed (clipboard blocked).");
        }
        e.stopPropagation();
      });
  
      repoGrid.appendChild(card);
    }
  }
  
  function initFilters() {
    const chips = document.querySelectorAll(".chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeLang = chip.getAttribute("data-lang") || "all";
        render();
      });
    });
  }
  
  function initSearch() {
    searchInput.addEventListener("input", render);
  }
  
  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.body.classList.add("light");
  
    themeBtn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }
  
  async function copyAllUrls() {
    const urls = repos.map(r => r.cloneUrl).join("\n");
    try {
      await navigator.clipboard.writeText(urls);
      showToast("All clone URLs copied!");
    } catch {
      showToast("Copy failed (clipboard blocked).");
    }
  }
  
  function initCloneAll() {
    cloneAllBtn.addEventListener("click", copyAllUrls);
  }
  
  initFilters();
  initSearch();
  initTheme();
  initCloneAll();
  render();