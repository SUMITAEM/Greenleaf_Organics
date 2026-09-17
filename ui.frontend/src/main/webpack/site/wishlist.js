(function () {
    "use strict";

    var STORAGE_KEY = "greenleaf-wishlist";

    function getWishlist() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch (e) { return []; }
    }

    function saveWishlist(list) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
        catch (e) { /* storage unavailable */ }
    }

    function isWishlisted(name) {
        return getWishlist().some(function (item) { return item.name === name; });
    }

    function toggleWishlist(name, price, image) {
        var list = getWishlist();
        var idx = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].name === name) { idx = i; break; }
        }
        if (idx >= 0) {
            list.splice(idx, 1);
        } else {
            list.push({ name: name, price: price, image: image });
        }
        saveWishlist(list);
        updateWishlistUI();
        return idx < 0;
    }

    function removeFromWishlist(name) {
        var list = getWishlist().filter(function (item) { return item.name !== name; });
        saveWishlist(list);
        updateWishlistUI();
        renderWishlistDrawer();
    }

    function updateWishlistUI() {
        var count = getWishlist().length;
        var badges = document.querySelectorAll(".header-wishlist__count");
        for (var i = 0; i < badges.length; i++) {
            badges[i].textContent = count;
            badges[i].setAttribute("data-count", count);
        }
        var btns = document.querySelectorAll(".cmp-productcard__wishlist");
        for (var j = 0; j < btns.length; j++) {
            var name = btns[j].getAttribute("data-product-name");
            if (isWishlisted(name)) {
                btns[j].classList.add("is-wishlisted");
            } else {
                btns[j].classList.remove("is-wishlisted");
            }
        }
    }

    function createWishlistDrawer() {
        if (document.getElementById("wishlist-drawer")) return;
        var overlay = document.createElement("div");
        overlay.className = "cart-overlay";
        overlay.id = "wishlist-overlay";
        overlay.addEventListener("click", closeWishlistDrawer);

        var drawer = document.createElement("div");
        drawer.className = "cart-drawer";
        drawer.id = "wishlist-drawer";
        drawer.innerHTML =
            '<div class="cart-drawer__header"><h3>Your Wishlist</h3>' +
            '<button class="cart-drawer__close" id="wishlist-close">&times;</button></div>' +
            '<div class="cart-drawer__items" id="wishlist-items"></div>';

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);
        document.getElementById("wishlist-close").addEventListener("click", closeWishlistDrawer);
    }

    function openWishlistDrawer() {
        createWishlistDrawer();
        renderWishlistDrawer();
        document.getElementById("wishlist-overlay").classList.add("is-open");
        document.getElementById("wishlist-drawer").classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function closeWishlistDrawer() {
        var o = document.getElementById("wishlist-overlay");
        var d = document.getElementById("wishlist-drawer");
        if (o) o.classList.remove("is-open");
        if (d) d.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    function renderWishlistDrawer() {
        var el = document.getElementById("wishlist-items");
        if (!el) return;
        var list = getWishlist();
        if (list.length === 0) {
            el.innerHTML = '<div class="cart-drawer__empty">Your wishlist is empty</div>';
            return;
        }
        var html = "";
        for (var i = 0; i < list.length; i++) {
            html +=
                '<div class="cart-drawer__item">' +
                '<img class="cart-drawer__item-image" src="' + list[i].image + '" alt="' + list[i].name + '"/>' +
                '<div class="cart-drawer__item-details">' +
                '<div class="cart-drawer__item-name">' + list[i].name + '</div>' +
                '<div class="cart-drawer__item-price">' + list[i].price + '</div>' +
                '<button class="wishlist-drawer__move-to-cart" data-action="move-to-cart" data-name="' + list[i].name + '" data-price="' + list[i].price + '" data-image="' + list[i].image + '">Move to Cart</button>' +
                '</div>' +
                '<button class="cart-drawer__item-remove" data-action="remove-wishlist" data-name="' + list[i].name + '">&times;</button>' +
                '</div>';
        }
        el.innerHTML = html;
    }

    function init() {
        updateWishlistUI();

        document.addEventListener("click", function (e) {
            var target = e.target.closest("[data-action], .cmp-productcard__wishlist, .header-wishlist");

            if (!target) return;

            if (target.classList.contains("cmp-productcard__wishlist")) {
                e.preventDefault();
                var name = target.getAttribute("data-product-name");
                var price = target.getAttribute("data-product-price");
                var image = target.getAttribute("data-product-image");
                toggleWishlist(name, price, image);
                return;
            }

            if (target.closest(".header-wishlist")) {
                openWishlistDrawer();
                return;
            }

            var action = target.getAttribute("data-action");
            var itemName = target.getAttribute("data-name");

            if (action === "remove-wishlist" && itemName) {
                removeFromWishlist(itemName);
            }

            if (action === "move-to-cart" && itemName) {
                var p = target.getAttribute("data-price");
                var img = target.getAttribute("data-image");
                if (window.greenleafAddToCart) {
                    window.greenleafAddToCart(itemName, p, img);
                }
                removeFromWishlist(itemName);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
