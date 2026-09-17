(function () {
    "use strict";

    function isBlogArticle() {
        return window.location.pathname.indexOf("/blog/") > -1
            && window.location.pathname.indexOf("/blog.") === -1;
    }

    function getPageName() {
        var parts = window.location.pathname.replace(".html", "").split("/");
        return parts[parts.length - 1];
    }

    function initComments() {
        if (!isBlogArticle()) return;

        var main = document.querySelector("main.container") || document.querySelector(".root.responsivegrid");
        if (!main) return;

        var section = document.createElement("div");
        section.className = "blog-comments";
        section.innerHTML =
            '<h3 class="blog-comments__title">Comments</h3>' +
            '<div class="blog-comments__form">' +
                '<input class="blog-comments__input" type="text" name="commenter" placeholder="Your name" required/>' +
                '<textarea class="blog-comments__textarea" name="comment" placeholder="Write a comment..." required></textarea>' +
                '<button class="blog-comments__submit" type="button" id="comment-submit">Post Comment</button>' +
            '</div>' +
            '<ul class="blog-comments__list" id="comments-list">' +
                '<li class="blog-comments__empty">No comments yet. Be the first!</li>' +
            '</ul>';

        var footer = document.querySelector("footer.experiencefragment");
        if (footer) {
            footer.parentNode.insertBefore(section, footer);
        } else {
            main.appendChild(section);
        }

        loadComments();

        document.getElementById("comment-submit").addEventListener("click", function () {
            var nameInput = section.querySelector('input[name="commenter"]');
            var commentInput = section.querySelector('textarea[name="comment"]');
            var btn = document.getElementById("comment-submit");

            if (!nameInput.value.trim() || !commentInput.value.trim()) {
                if (window.showToast) window.showToast("Please fill in both fields.", false);
                return;
            }

            btn.disabled = true;
            btn.textContent = "Posting...";

            var data = "name=" + encodeURIComponent(nameInput.value.trim()) +
                       "&comment=" + encodeURIComponent(commentInput.value.trim()) +
                       "&pagePath=" + encodeURIComponent(getPageName());

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/bin/greenleaf/comment", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    btn.disabled = false;
                    btn.textContent = "Post Comment";
                    try {
                        var res = JSON.parse(xhr.responseText);
                        if (res.success) {
                            nameInput.value = "";
                            commentInput.value = "";
                            loadComments();
                            if (window.showToast) window.showToast("Comment posted!", true);
                        } else {
                            if (window.showToast) window.showToast(res.message || "Failed to post.", false);
                        }
                    } catch (e) {
                        if (window.showToast) window.showToast("Something went wrong.", false);
                    }
                }
            };
            xhr.send(data);
        });
    }

    function loadComments() {
        var pageName = getPageName();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/bin/greenleaf/comment?pagePath=" + encodeURIComponent(pageName), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var res = JSON.parse(xhr.responseText);
                    renderComments(res.comments || []);
                } catch (e) { /* ignore */ }
            }
        };
        xhr.send();
    }

    function renderComments(comments) {
        var list = document.getElementById("comments-list");
        if (!list) return;

        if (comments.length === 0) {
            list.innerHTML = '<li class="blog-comments__empty">No comments yet. Be the first!</li>';
            return;
        }

        var html = "";
        for (var i = 0; i < comments.length; i++) {
            var c = comments[i];
            html += '<li class="blog-comments__item">' +
                '<div class="blog-comments__author">' + escapeHtml(c.name) + '</div>' +
                '<div class="blog-comments__date">' + (c.date || "") + '</div>' +
                '<p class="blog-comments__text">' + escapeHtml(c.comment) + '</p>' +
                '</li>';
        }
        list.innerHTML = html;
    }

    function escapeHtml(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initComments);
    } else {
        initComments();
    }
})();
