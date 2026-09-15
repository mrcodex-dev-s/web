// Qelvuzo - Main App JavaScript

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Mobile Menu
    // =========================

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }


    // =========================
    // Like Buttons
    // =========================

    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const countElement = button.querySelector(".like-count");

            button.classList.toggle("liked");

            if (countElement) {

                let count = parseInt(countElement.textContent);

                if (button.classList.contains("liked")) {
                    count++;
                } else {
                    count--;
                }

                countElement.textContent = count;
            }

        });

    });


    // =========================
    // Follow Buttons
    // =========================

    const followButtons = document.querySelectorAll(".follow-btn");

    followButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (button.classList.contains("following")) {

                button.classList.remove("following");
                button.textContent = "Follow";

            } else {

                button.classList.add("following");
                button.textContent = "Following";

            }

        });

    });


    // =========================
    // Share Buttons
    // =========================

    const shareButtons = document.querySelectorAll(".share-btn");

    shareButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const post = button.closest(".post");

            if (!post) return;

            const text = post.innerText.substring(0, 150);

            try {

                await navigator.clipboard.writeText(text);

                const originalText = button.innerText;

                button.innerText = "Shared";

                setTimeout(() => {
                    button.innerText = originalText;
                }, 1500);

            } catch (error) {

                alert("Unable to share this post.");

            }

        });

    });


    // =========================
    // Search
    // =========================

    const searchInputs = document.querySelectorAll(".search-input");

    searchInputs.forEach(input => {

        input.addEventListener("input", () => {

            const query = input.value.toLowerCase().trim();

            const cards = document.querySelectorAll(
                ".person-card, .trend-card, .community-card"
            );

            cards.forEach(card => {

                const text = card.innerText.toLowerCase();

                if (text.includes(query)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });


    // =========================
    // Notification Mark Read
    // =========================

    const markAllRead = document.querySelector(".mark-all-read");

    if (markAllRead) {

        markAllRead.addEventListener("click", () => {

            const unreadItems = document.querySelectorAll(".notification.unread");

            unreadItems.forEach(item => {
                item.classList.remove("unread");
            });

            const unreadDots = document.querySelectorAll(".unread-dot");

            unreadDots.forEach(dot => {
                dot.style.display = "none";
            });

        });

    }


    // =========================
    // Chat Send Message
    // =========================

    const messageInput = document.querySelector(".message-input");
    const sendButton = document.querySelector(".send-btn");
    const chatMessages = document.querySelector(".chat-messages");

    function sendMessage() {

        if (!messageInput || !chatMessages) return;

        const message = messageInput.value.trim();

        if (message === "") return;

        const messageElement = document.createElement("div");

        messageElement.className = "message sent";

        messageElement.innerHTML = `
            <div class="message-bubble">
                ${escapeHTML(message)}
            </div>
        `;

        chatMessages.appendChild(messageElement);

        messageInput.value = "";

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }


    if (messageInput) {

        messageInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }

        });

    }


    // =========================
    // Safe HTML Escape
    // =========================

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }

});
