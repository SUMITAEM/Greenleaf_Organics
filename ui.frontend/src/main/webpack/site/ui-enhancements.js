(function () {
    "use strict";

    // ── Back to Top Button ──
    function initBackToTop() {
        var btn = document.createElement("button");
        btn.className = "back-to-top";
        btn.setAttribute("aria-label", "Back to top");
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
        document.body.appendChild(btn);

        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                btn.classList.add("is-visible");
            } else {
                btn.classList.remove("is-visible");
            }
        });

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ── Mobile Hamburger Menu ──
    function initMobileMenu() {
        var header = document.querySelector("header.experiencefragment");
        if (!header) return;

        var nav = header.querySelector(".cmp-navigation");
        if (!nav) return;

        var burger = document.createElement("button");
        burger.className = "mobile-menu-toggle";
        burger.setAttribute("aria-label", "Toggle menu");
        burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

        var container = header.querySelector(".aem-Grid") || header.querySelector(".cmp-container");
        if (container) container.appendChild(burger);

        var overlay = document.createElement("div");
        overlay.className = "mobile-menu-overlay";
        document.body.appendChild(overlay);

        burger.addEventListener("click", function () {
            nav.classList.toggle("is-open");
            overlay.classList.toggle("is-open");
            document.body.style.overflow = nav.classList.contains("is-open") ? "hidden" : "";
            burger.innerHTML = nav.classList.contains("is-open")
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });

        overlay.addEventListener("click", function () {
            nav.classList.remove("is-open");
            overlay.classList.remove("is-open");
            document.body.style.overflow = "";
            burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });
    }

    // ── Page Loader ──
    function initLoader() {
        var loader = document.createElement("div");
        loader.className = "page-loader";
        loader.innerHTML = '<div class="page-loader__spinner"></div>';
        document.body.insertBefore(loader, document.body.firstChild);

        window.addEventListener("load", function () {
            loader.classList.add("is-hidden");
            setTimeout(function () { loader.remove(); }, 500);
        });
    }

    // ── Init ──
    initLoader();

    function initAll() {
        initBackToTop();
        initMobileMenu();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
