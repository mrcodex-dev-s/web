// ==========================================
// QELVUZO BACKEND API
// ==========================================

const API_BASE_URL =
    "https://green-brook-81d9.mr-codex1241.workers.dev";


// ==========================================
// GENERIC API REQUEST
// ==========================================

async function apiRequest(endpoint, options = {}) {
    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };

    if (options.body !== undefined) {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
    );

    let data;

    try {
        data = await response.json();
    } catch (error) {
        throw new Error("Invalid API response");
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.error || `API request failed: ${response.status}`
        );
    }

    return data;
}


// ==========================================
// HEALTH
// ==========================================

async function qelvuzoHealth() {
    return await apiRequest("/api/health");
}


// ==========================================
// USERS
// ==========================================

async function getUsers() {
    return await apiRequest("/api/users");
}

async function createUser(user) {
    return await apiRequest("/api/users", {
        method: "POST",
        body: user
    });
}


// ==========================================
// POSTS
// ==========================================

async function getPosts() {
    return await apiRequest("/api/posts");
}

async function createPost({
    id,
    user_id,
    content = null,
    image_url = null
}) {
    return await apiRequest("/api/posts", {
        method: "POST",
        body: {
            id,
            user_id,
            content,
            image_url
        }
    });
}


// ==========================================
// LIKES
// ==========================================

async function likePost(postId, userId) {
    return await apiRequest(
        `/api/posts/${encodeURIComponent(postId)}/like`,
        {
            method: "POST",
            body: {
                user_id: userId
            }
        }
    );
}

async function unlikePost(postId, userId) {
    return await apiRequest(
        `/api/posts/${encodeURIComponent(postId)}/like`,
        {
            method: "DELETE",
            body: {
                user_id: userId
            }
        }
    );
}

async function getPostLikes(postId) {
    return await apiRequest(
        `/api/posts/${encodeURIComponent(postId)}/likes`
    );
}


// ==========================================
// COMMENTS
// ==========================================

async function getComments(postId) {
    return await apiRequest(
        `/api/posts/${encodeURIComponent(postId)}/comments`
    );
}

async function createComment(
    postId,
    userId,
    content
) {
    return await apiRequest(
        `/api/posts/${encodeURIComponent(postId)}/comments`,
        {
            method: "POST",
            body: {
                user_id: userId,
                content
            }
        }
    );
}

async function deleteComment(commentId) {
    return await apiRequest(
        `/api/comments/${encodeURIComponent(commentId)}`,
        {
            method: "DELETE"
        }
    );
}


// ==========================================
// FOLLOW
// ==========================================

async function followUser(
    followingId,
    followerId
) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(followingId)}/follow`,
        {
            method: "POST",
            body: {
                follower_id: followerId
            }
        }
    );
}

async function unfollowUser(
    followingId,
    followerId
) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(followingId)}/follow`,
        {
            method: "DELETE",
            body: {
                follower_id: followerId
            }
        }
    );
}

async function getFollowers(userId) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/followers`
    );
}

async function getFollowing(userId) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/following`
    );
}


// ==========================================
// NOTIFICATIONS
// ==========================================

async function getNotifications(userId) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/notifications`
    );
}

async function markNotificationRead(
    notificationId
) {
    return await apiRequest(
        `/api/notifications/${encodeURIComponent(notificationId)}/read`,
        {
            method: "PATCH"
        }
    );
}

async function markAllNotificationsRead(userId) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/notifications/read-all`,
        {
            method: "PATCH"
        }
    );
}

async function deleteNotification(notificationId) {
    return await apiRequest(
        `/api/notifications/${encodeURIComponent(notificationId)}`,
        {
            method: "DELETE"
        }
    );
}


// ==========================================
// STORIES
// ==========================================

async function getStories() {
    return await apiRequest("/api/stories");
}

async function getUserStories(userId) {
    return await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/stories`
    );
}

async function createStory({
    user_id,
    media_url,
    media_type = "image",
    caption = null,
    expires_at = null
}) {
    return await apiRequest("/api/stories", {
        method: "POST",
        body: {
            user_id,
            media_url,
            media_type,
            caption,
            expires_at
        }
    });
}

async function viewStory(storyId, userId) {
    return await apiRequest(
        `/api/stories/${encodeURIComponent(storyId)}/view`,
        {
            method: "POST",
            body: {
                user_id: userId
            }
        }
    );
}

async function deleteStory(storyId, userId) {
    return await apiRequest(
        `/api/stories/${encodeURIComponent(storyId)}`,
        {
            method: "DELETE",
            body: {
                user_id: userId
            }
        }
    );
}


// ==========================================
// CONVERSATIONS
// ==========================================

async function createConversation(
    userId,
    otherUserId
) {
    return await apiRequest(
        "/api/conversations",
        {
            method: "POST",
            body: {
                user_id: userId,
                other_user_id: otherUserId
            }
        }
    );
}

async function getConversations(userId) {
    return await apiRequest(
        `/api/conversations?user_id=${encodeURIComponent(userId)}`
    );
}


// ==========================================
// MESSAGES
// ==========================================

async function sendMessage(
    conversationId,
    senderId,
    content
) {
    return await apiRequest(
        `/api/conversations/${encodeURIComponent(conversationId)}/messages`,
        {
            method: "POST",
            body: {
                sender_id: senderId,
                content
            }
        }
    );
}

async function getMessages(
    conversationId,
    userId,
    limit = 50,
    before = null
) {
    let endpoint =
        `/api/conversations/${encodeURIComponent(conversationId)}/messages` +
        `?user_id=${encodeURIComponent(userId)}` +
        `&limit=${limit}`;

    if (before) {
        endpoint +=
            `&before=${encodeURIComponent(before)}`;
    }

    return await apiRequest(endpoint);
}

async function markMessageRead(
    messageId,
    userId
) {
    return await apiRequest(
        `/api/messages/${encodeURIComponent(messageId)}/read`,
        {
            method: "POST",
            body: {
                user_id: userId
            }
        }
    );
}

async function getUnreadCount(
    conversationId,
    userId
) {
    return await apiRequest(
        `/api/conversations/${encodeURIComponent(conversationId)}/unread` +
        `?user_id=${encodeURIComponent(userId)}`
    );
}


// ==========================================
// API TEST
// ==========================================

async function testQelvuzoAPI() {
    try {
        const health = await qelvuzoHealth();

        console.log(
            "Qelvuzo API connected:",
            health
        );

        const posts = await getPosts();

        console.log(
            "Qelvuzo posts:",
            posts
        );

        return {
            health,
            posts
        };

    } catch (error) {
        console.error(
            "Qelvuzo API error:",
            error
        );

        return null;
    }
}


// ==========================================
// INITIAL API TEST
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        testQelvuzoAPI();
    }
);


// ==========================================
// LOAD POSTS
// ==========================================

async function loadQelvuzoPosts() {
  try {
    const data = await getPosts();

    console.log("Qelvuzo posts loaded:", data);

    return data.posts || [];

  } catch (error) {
    console.error(
      "Failed to load Qelvuzo posts:",
      error
    );

    return [];
  }
}

// ==========================================
// QELVUZO POSTS
// ==========================================

async function getQelvuzoPosts() {
    try {
        const data = await apiRequest("/api/posts");

        console.log("Qelvuzo Posts:", data);

        return data.posts || [];
    } catch (error) {
        console.error("Posts API Error:", error);
        return [];
    }
}
// ==========================================
// API HEALTH
// ==========================================

async function checkQelvuzoAPI() {
  try {
    const data = await apiRequest("/api/health");

    console.log(
      "Qelvuzo API connected:",
      data
    );

    return data;

  } catch (error) {

    console.error(
      "Qelvuzo API connection failed:",
      error
    );

    return null;
  }
}// Qelvuzo — Main App JavaScript

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
// ==========================================
// API CONNECTION TEST
// ==========================================

checkQelvuzoAPI();

});

// ==========================================
// TEST POSTS API
// ==========================================

loadQelvuzoPosts();
// ==========================================
// LOAD REAL POSTS
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    const posts = await getQelvuzoPosts();

    console.log("Real D1 posts:", posts);
});
