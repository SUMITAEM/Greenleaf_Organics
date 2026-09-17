(function () {
    "use strict";

    var STORAGE_KEY = "greenleaf-cart";

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) { /* storage full or unavailable */ }
    }

    function getCartCount() {
        return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
    }

    function getSubtotal() {
        return getCart().reduce(function (sum, item) {
            return sum + (item.numericPrice * item.qty);
        }, 0);
    }

    function addToCart(name, price, image) {
        var cart = getCart();
        var existing = null;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name) { existing = cart[i]; break; }
        }
        if (existing) {
            existing.qty++;
        } else {
            cart.push({
                name: name,
                price: price,
                numericPrice: parseFloat(price.replace(/[^0-9.]/g, "")) || 0,
                image: image,
                qty: 1
            });
        }
        saveCart(cart);
        updateCartUI();
    }

    function removeFromCart(name) {
        var cart = getCart().filter(function (item) { return item.name !== name; });
        saveCart(cart);
        updateCartUI();
        renderDrawerItems();
    }

    function changeQty(name, delta) {
        var cart = getCart();
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name) {
                cart[i].qty += delta;
                if (cart[i].qty <= 0) { cart.splice(i, 1); }
                break;
            }
        }
        saveCart(cart);
        updateCartUI();
        renderDrawerItems();
    }

    function clearCart() {
        saveCart([]);
        updateCartUI();
        renderDrawerItems();
    }

    function updateCartUI() {
        var count = getCartCount();
        var badges = document.querySelectorAll("#cart-count, .header-cart__count");
        for (var i = 0; i < badges.length; i++) {
            badges[i].textContent = count;
            badges[i].setAttribute("data-count", count);
        }
    }

    // --- Drawer ---

    function createDrawer() {
        if (document.getElementById("cart-drawer")) return;

        var overlay = document.createElement("div");
        overlay.className = "cart-overlay";
        overlay.id = "cart-overlay";
        overlay.addEventListener("click", closeDrawer);

        var drawer = document.createElement("div");
        drawer.className = "cart-drawer";
        drawer.id = "cart-drawer";
        drawer.innerHTML =
            '<div class="cart-drawer__header">' +
                '<h3>Your Cart</h3>' +
                '<button class="cart-drawer__close" id="cart-close">&times;</button>' +
            '</div>' +
            '<div class="cart-drawer__items" id="cart-items"></div>' +
            '<div class="cart-drawer__footer" id="cart-footer"></div>';

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        document.getElementById("cart-close").addEventListener("click", closeDrawer);
    }

    function openDrawer() {
        createDrawer();
        renderDrawerItems();
        document.getElementById("cart-overlay").classList.add("is-open");
        document.getElementById("cart-drawer").classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
        var overlay = document.getElementById("cart-overlay");
        var drawer = document.getElementById("cart-drawer");
        if (overlay) overlay.classList.remove("is-open");
        if (drawer) drawer.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    function renderDrawerItems() {
        var itemsEl = document.getElementById("cart-items");
        var footerEl = document.getElementById("cart-footer");
        if (!itemsEl || !footerEl) return;

        var cart = getCart();

        if (cart.length === 0) {
            itemsEl.innerHTML = '<div class="cart-drawer__empty">Your cart is empty</div>';
            footerEl.innerHTML = "";
            return;
        }

        var html = "";
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            html +=
                '<div class="cart-drawer__item">' +
                    '<img class="cart-drawer__item-image" src="' + item.image + '" alt="' + item.name + '"/>' +
                    '<div class="cart-drawer__item-details">' +
                        '<div class="cart-drawer__item-name">' + item.name + '</div>' +
                        '<div class="cart-drawer__item-price">' + item.price + '</div>' +
                        '<div class="cart-drawer__item-qty">' +
                            '<button data-action="minus" data-name="' + item.name + '">&#8722;</button>' +
                            '<span>' + item.qty + '</span>' +
                            '<button data-action="plus" data-name="' + item.name + '">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<button class="cart-drawer__item-remove" data-action="remove" data-name="' + item.name + '">&times;</button>' +
                '</div>';
        }
        itemsEl.innerHTML = html;

        footerEl.innerHTML =
            '<div class="cart-drawer__subtotal">' +
                '<span>Subtotal</span>' +
                '<span>$' + getSubtotal().toFixed(2) + '</span>' +
            '</div>' +
            '<button class="cart-drawer__clear" id="cart-clear">Clear Cart</button>';

        document.getElementById("cart-clear").addEventListener("click", clearCart);
    }

    // --- Event Delegation ---

    function init() {
        updateCartUI();

        document.addEventListener("click", function (e) {
            var target = e.target;

            // Add to Cart button
            if (target.classList.contains("cmp-productcard__add-to-cart")) {
                e.preventDefault();
                var name = target.getAttribute("data-product-name");
                var price = target.getAttribute("data-product-price");
                var image = target.getAttribute("data-product-image");
                addToCart(name, price, image);

                target.classList.add("added");
                var originalText = target.textContent;
                target.textContent = "Added!";
                setTimeout(function () {
                    target.classList.remove("added");
                    target.textContent = originalText;
                }, 1000);
                return;
            }

            // Cart icon click
            if (target.closest(".header-cart, #header-cart")) {
                openDrawer();
                return;
            }

            // Drawer quantity buttons
            var action = target.getAttribute("data-action");
            var itemName = target.getAttribute("data-name");
            if (action === "minus" && itemName) { changeQty(itemName, -1); }
            if (action === "plus" && itemName) { changeQty(itemName, 1); }
            if (action === "remove" && itemName) { removeFromCart(itemName); }
        });
    }

    window.greenleafAddToCart = addToCart;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
