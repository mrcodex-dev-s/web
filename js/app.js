// Qelvuzo — Main App JavaScript

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
       ========================= */

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }


    /* =========================
       LIKE SYSTEM
       ========================= */

    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const post = button.closest(".post, .post-card");

            if (!post) return;

            const countElement =
                post.querySelector(".like-count");

            const alreadyLiked =
                button.classList.contains("liked");

            if (countElement) {

                let count =
                    parseInt(countElement.textContent) || 0;

                if (alreadyLiked) {
                    count = Math.max(0, count - 1);
                } else {
                    count++;
                }

                countElement.textContent = count;
            }

            button.classList.toggle("liked");

            // Change button text
            if (button.classList.contains("liked")) {
                button.innerHTML = "♥ Liked";
            } else {
                button.innerHTML = "♡ Like";
            }

        });

    });


    /* =========================
       FOLLOW SYSTEM
       ========================= */

    const followButtons =
        document.querySelectorAll(".follow-btn");

    followButtons.forEach(button => {

        button.addEventListener("click", () => {

            const following =
                button.classList.contains("following");

            if (following) {

                button.classList.remove("following");

                button.textContent = "Follow";

            } else {

                button.classList.add("following");

                button.textContent = "Following";

            }

        });

    });


    /* =========================
       SHARE SYSTEM
       ========================= */

    const shareButtons =
        document.querySelectorAll(".share-btn");

    shareButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const post =
                button.closest(".post, .post-card");

            if (!post) return;

            const text =
                post.innerText.substring(0, 250);

            try {

                if (navigator.share) {

                    await navigator.share({
                        title: "Qelvuzo",
                        text: text
                    });

                } else if (navigator.clipboard) {

                    await navigator.clipboard.writeText(text);

                    const original =
                        button.innerText;

                    button.innerText = "Shared";

                    setTimeout(() => {
                        button.innerText = original;
                    }, 1500);

                } else {

                    alert("Sharing is not available.");

                }

            } catch (error) {

                // User cancelled native share.
                console.log("Share cancelled.");

            }

        });

    });


    /* =========================
       SEARCH
       ========================= */

    const searchInputs =
        document.querySelectorAll(".search-input");

    searchInputs.forEach(input => {

        input.addEventListener("input", () => {

            const query =
                input.value.toLowerCase().trim();

            const cards =
                document.querySelectorAll(
                    ".person-card, " +
                    ".trend-card, " +
                    ".community-card, " +
                    ".popular-post"
                );

            cards.forEach(card => {

                const text =
                    card.innerText.toLowerCase();

                if (query === "" || text.includes(query)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });


    /* =========================
       NOTIFICATIONS
       ========================= */

    const markAllRead =
        document.querySelector(".mark-all-read");

    if (markAllRead) {

        markAllRead.addEventListener("click", () => {

            const unreadItems =
                document.querySelectorAll(
                    ".notification.unread"
                );

            unreadItems.forEach(item => {
                item.classList.remove("unread");
            });


            const unreadDots =
                document.querySelectorAll(".unread-dot");

            unreadDots.forEach(dot => {
                dot.style.display = "none";
            });

        });

    }


    /* =========================
       CHAT SYSTEM
       ========================= */

    const messageInput =
        document.querySelector(".message-input");

    const sendButton =
        document.querySelector(".send-btn");

    const chatMessages =
        document.querySelector(".chat-messages");


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    function sendMessage() {

        if (!messageInput || !chatMessages) {
            return;
        }

        const message =
            messageInput.value.trim();

        if (message === "") {
            return;
        }


        const messageElement =
            document.createElement("div");

        messageElement.className =
            "message sent";


        messageElement.innerHTML = `
            <div class="message-bubble">
                ${escapeHTML(message)}
            </div>
        `;


        chatMessages.appendChild(messageElement);


        messageInput.value = "";


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );

    }


    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    /* =========================
       COMMENT BUTTON
       ========================= */

    const commentButtons =
        document.querySelectorAll(".comment-btn");

    commentButtons.forEach(button => {

        button.addEventListener("click", () => {

            const post =
                button.closest(".post, .post-card");

            if (!post) return;

            let commentBox =
                post.querySelector(".comment-box");


            // Create comment box if it doesn't exist
            if (!commentBox) {

                commentBox =
                    document.createElement("div");

                commentBox.className =
                    "comment-box";

                commentBox.style.marginTop = "12px";

                commentBox.innerHTML = `
                    <input
                        type="text"
                        class="comment-input"
                        placeholder="Write a comment..."
                    >

                    <button
                        type="button"
                        class="comment-submit"
                    >
                        Comment
                    </button>

                    <div class="comments-list"></div>
                `;

                post.appendChild(commentBox);

            }


            const input =
                commentBox.querySelector(
                    ".comment-input"
                );

            if (input) {
                input.focus();
            }


            const submit =
                commentBox.querySelector(
                    ".comment-submit"
                );


            if (submit && !submit.dataset.connected) {

                submit.dataset.connected = "true";


                submit.addEventListener(
                    "click",
                    () => {

                        const value =
                            input.value.trim();

                        if (!value) return;


                        const commentsList =
                            commentBox.querySelector(
                                ".comments-list"
                            );


                        const comment =
                            document.createElement("div");

                        comment.style.marginTop = "8px";

                        comment.style.padding = "9px 12px";

                        comment.style.background =
                            "#f5f4ff";

                        comment.style.borderRadius =
                            "10px";

                        comment.style.fontSize =
                            "13px";


                        comment.innerHTML = `
                            <strong>You</strong>
                            <br>
                            ${escapeHTML(value)}
                        `;


                        commentsList.appendChild(comment);


                        input.value = "";

                    }
                );

            }

        });

    });


    /* =========================
       ACTIVE NAVIGATION
       ========================= */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const navLinks =
        document.querySelectorAll(
            "a[href]"
        );


    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (
            href &&
            href !== "#" &&
            href === currentPage
        ) {

            link.classList.add("active");

        }

    });


    /* =========================
       ESC KEY
       ========================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                if (sidebar) {
                    sidebar.classList.remove("active");
                }

            }

        }
    );


});
