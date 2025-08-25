document.addEventListener("DOMContentLoaded", async function () {
  const host = document.getElementById("menu");

  // 1) Inject the sidebar HTML
  const res = await fetch("/menu/menu.html", { cache: "no-store" });
  host.innerHTML = await res.text();

  // 2) Re-init Perfect Scrollbar on the injected menu
  const menuInner = document.querySelector("#layout-menu .menu-inner");
  if (window.PerfectScrollbar && menuInner) {
    if (menuInner._psInstance?.destroy) {
      menuInner._psInstance.destroy();
    }
    menuInner._psInstance = new PerfectScrollbar(menuInner);
  }

  // 3) Re-init the template’s Menu (enables collapse/expand)
  const layoutMenuEl = document.getElementById("layout-menu");
  if (window.Menu && layoutMenuEl) {
    window._menuInstance?.destroy?.();
    window._menuInstance = new Menu(layoutMenuEl, {
      // orientation: 'vertical',
      // closeChildren: false
    });
  } else {
    console.warn("Menu class not found. Check that ../assets/vendor/js/menu.js is loaded.");
  }

  // 4) Re-bind the navbar hamburger toggle
  document.addEventListener("click", function (e) {
    const toggler = e.target.closest(".layout-menu-toggle");
    if (!toggler) return;

    e.preventDefault();
    if (window.Helpers?.toggleCollapsed) {
      window.Helpers.toggleCollapsed();
    } else {
      document.documentElement.classList.toggle("layout-menu-collapsed");
    }
  });

// 5) Mark active link based on current page
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#layout-menu a.menu-link[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.endsWith(current)) {
      const item = a.closest(".menu-item");
      if (!item) return;

      // Highlight the current item
      item.classList.add("active");

      // If it's inside a submenu, open parent group and highlight parent too
      let parent = item.closest(".menu-sub")?.closest(".menu-item");
      while (parent) {
        parent.classList.add("open", "active"); // ✅ also add "active" to parent
        parent = parent.closest(".menu-sub")?.closest(".menu-item");
      }
    }
  });

// 6) Special rule: If NOT on index.html, remove active from index
  if (current !== "index.html") {
    const indexItem = document.querySelector(
      '#layout-menu a.menu-link[href="index.html"]'
    )?.closest(".menu-item");

    if (indexItem) {
      indexItem.classList.remove("active", "open");
    }
  }

});
