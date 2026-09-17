(function () {
    "use strict";

    function showToast(message, isSuccess) {
        var existing = document.getElementById("greenleaf-toast");
        if (existing) existing.remove();

        var toast = document.createElement("div");
        toast.id = "greenleaf-toast";
        toast.className = "greenleaf-toast " + (isSuccess ? "greenleaf-toast--success" : "greenleaf-toast--error");
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function () { toast.classList.add("is-visible"); }, 10);
        setTimeout(function () {
            toast.classList.remove("is-visible");
            setTimeout(function () { toast.remove(); }, 300);
        }, 4000);
    }

    function submitForm(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    callback(response);
                } catch (e) {
                    callback({ success: false, message: "Something went wrong. Please try again." });
                }
            }
        };
        xhr.send(data);
    }

    function encodeFormData(params) {
        var parts = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
            }
        }
        return parts.join("&");
    }

    function initNewsletterForms() {
        var forms = document.querySelectorAll('[data-ajax-form="newsletter"]');
        for (var i = 0; i < forms.length; i++) {
            (function (form) {
                form.addEventListener("submit", function (e) {
                    e.preventDefault();
                    var emailInput = form.querySelector('input[name="email"]');
                    var button = form.querySelector('button[type="submit"]');
                    var msgEl = form.querySelector(".cmp-newslettersignup__message");

                    if (!emailInput || !emailInput.value) return;

                    button.disabled = true;
                    button.textContent = "Subscribing...";

                    submitForm("/bin/greenleaf/subscribe",
                        encodeFormData({ email: emailInput.value }),
                        function (res) {
                            showToast(res.message, res.success);
                            button.disabled = false;
                            button.textContent = "Subscribe";
                            if (res.success) {
                                emailInput.value = "";
                            }
                            if (msgEl) {
                                msgEl.textContent = res.message;
                                msgEl.style.display = "block";
                                msgEl.style.color = res.success ? "#4A7C23" : "#c62828";
                            }
                        }
                    );
                });
            })(forms[i]);
        }
    }

    function initContactForm() {
        var form = document.getElementById("contact-form");
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var nameInput = form.querySelector('input[name="name"]');
            var emailInput = form.querySelector('input[name="email"]');
            var messageInput = form.querySelector('textarea[name="message"]');
            var button = form.querySelector('button[type="submit"]');

            if (!nameInput || !emailInput || !messageInput) return;
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                showToast("Please fill in all fields.", false);
                return;
            }

            button.disabled = true;
            button.textContent = "Sending...";

            submitForm("/bin/greenleaf/contact",
                encodeFormData({
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                }),
                function (res) {
                    showToast(res.message, res.success);
                    button.disabled = false;
                    button.textContent = "Send Message";
                    if (res.success) {
                        nameInput.value = "";
                        emailInput.value = "";
                        messageInput.value = "";
                    }
                }
            );
        });
    }

    function init() {
        initNewsletterForms();
        initContactForm();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
