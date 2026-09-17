(function () {
    "use strict";

    function initFilters() {
        var cards = document.querySelectorAll(".cmp-productcard");
        if (cards.length < 2) return;

        var grid = cards[0].closest(".aem-Grid");
        if (!grid) return;

        var badges = {};
        for (var i = 0; i < cards.length; i++) {
            var badge = cards[i].querySelector(".cmp-productcard__badge");
            if (badge && badge.textContent.trim()) {
                badges[badge.textContent.trim()] = true;
            }
        }

        var badgeList = Object.keys(badges);
        if (badgeList.length === 0) return;

        var filterBar = document.createElement("div");
        filterBar.className = "product-filters";

        var badgeHtml = '<div class="product-filters__badges">' +
            '<button class="product-filters__badge is-active" data-filter="all">All</button>';
        for (var b = 0; b < badgeList.length; b++) {
            badgeHtml += '<button class="product-filters__badge" data-filter="' + badgeList[b] + '">' + badgeList[b] + '</button>';
        }
        badgeHtml += '</div>';

        var sortHtml = '<div class="product-filters__sort">' +
            '<label>Sort by:</label>' +
            '<select id="product-sort">' +
            '<option value="default">Default</option>' +
            '<option value="price-asc">Price: Low to High</option>' +
            '<option value="price-desc">Price: High to Low</option>' +
            '<option value="name-asc">Name: A-Z</option>' +
            '</select></div>';

        filterBar.innerHTML = badgeHtml + sortHtml;

        var titleEl = grid.querySelector(".title, .cmp-title");
        var firstCard = cards[0].closest(".aem-GridColumn") || cards[0];
        if (titleEl) {
            var titleCol = titleEl.closest(".aem-GridColumn") || titleEl;
            titleCol.parentNode.insertBefore(filterBar, titleCol.nextSibling);
        } else {
            grid.insertBefore(filterBar, firstCard);
        }

        var currentFilter = "all";

        filterBar.addEventListener("click", function (e) {
            var btn = e.target.closest(".product-filters__badge");
            if (!btn) return;
            currentFilter = btn.getAttribute("data-filter");
            var allBtns = filterBar.querySelectorAll(".product-filters__badge");
            for (var j = 0; j < allBtns.length; j++) allBtns[j].classList.remove("is-active");
            btn.classList.add("is-active");
            applyFilter();
        });

        var sortSelect = document.getElementById("product-sort");
        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                applySort(sortSelect.value);
            });
        }

        function applyFilter() {
            for (var k = 0; k < cards.length; k++) {
                var wrapper = cards[k].closest(".aem-GridColumn") || cards[k];
                if (currentFilter === "all") {
                    wrapper.style.display = "";
                } else {
                    var cardBadge = cards[k].querySelector(".cmp-productcard__badge");
                    var badgeText = cardBadge ? cardBadge.textContent.trim() : "";
                    wrapper.style.display = (badgeText === currentFilter) ? "" : "none";
                }
            }
        }

        function applySort(sortBy) {
            var items = [];
            for (var m = 0; m < cards.length; m++) {
                var wrapper = cards[m].closest(".aem-GridColumn") || cards[m];
                var priceEl = cards[m].querySelector(".cmp-productcard__price");
                var nameEl = cards[m].querySelector(".cmp-productcard__name");
                items.push({
                    el: wrapper,
                    price: priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, "")) : 0,
                    name: nameEl ? nameEl.textContent.trim() : ""
                });
            }

            if (sortBy === "price-asc") items.sort(function (a, b) { return a.price - b.price; });
            else if (sortBy === "price-desc") items.sort(function (a, b) { return b.price - a.price; });
            else if (sortBy === "name-asc") items.sort(function (a, b) { return a.name.localeCompare(b.name); });

            for (var n = 0; n < items.length; n++) {
                grid.appendChild(items[n].el);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initFilters);
    } else {
        initFilters();
    }
})();
