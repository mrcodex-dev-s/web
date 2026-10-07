// ======================================================
// QELVUZO — MAIN APP + BACKEND INTEGRATION
// ======================================================


// ======================================================
// API CONFIG
// ======================================================

const API_BASE_URL =
    "https://green-brook-81d9.mr-codex1241.workers.dev";


// ======================================================
// CURRENT USER
// ======================================================

// আপাতত testing user.
// Login system connect করার সময় এখানে real logged-in
// user ID বসানো হবে.

const CURRENT_USER_ID =
    localStorage.getItem("qelvuzo_user_id") || "user-1";


// ======================================================
// GENERIC API REQUEST
// ======================================================

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


    let data = null;


    try {
        data = await response.json();
    } catch (error) {
        throw new Error("Invalid API response");
    }


    if (!response.ok || data.success === false) {

        throw new Error(
            data?.error ||
            `API request failed: ${response.status}`
        );

    }


    return data;
}


// ======================================================
// HEALTH
// ======================================================

async function qelvuzoHealth() {
    return await apiRequest("/api/health");
}


// ======================================================
// USERS
// ======================================================

async function getUsers() {
    return await apiRequest("/api/users");
}


async function createUser(user) {

    return await apiRequest("/api/users", {
        method: "POST",
        body: user
    });

}


// ======================================================
// POSTS
// ======================================================

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


// ======================================================
// LIKES
// ======================================================

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


// ======================================================
// COMMENTS
// ======================================================

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


// ======================================================
// FOLLOW
// ======================================================

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


// ======================================================
// NOTIFICATIONS
// ======================================================

async function getNotifications(userId) {

    return await apiRequest(
        `/api/users/${encodeURIComponent(userId)}/notifications`
    );

}


async function markNotificationRead(notificationId) {

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


// ======================================================
// STORIES
// ======================================================

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


// ======================================================
// CONVERSATIONS
// ======================================================

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


// ======================================================
// MESSAGES
// ======================================================

async function sendQelvuzoMessage(
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


// ======================================================
// HELPERS
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;
}


// ======================================================
// GET POST ID
// ======================================================

function getPostId(postElement) {

    if (!postElement) {
        return null;
    }


    return (
        postElement.dataset.postId ||
        postElement.getAttribute("data-post-id")
    );

}


// ======================================================
// LIKE UI
// ======================================================

function updateLikeUI(
    post,
    liked,
    count
) {

    if (!post) {
        return;
    }


    const button =
        post.querySelector(".like-btn");


    const countElement =
        post.querySelector(".like-count");


    if (countElement && count !== undefined) {

        countElement.textContent =
            Number(count) || 0;

    }


    if (!button) {
        return;
    }


    button.classList.toggle(
        "liked",
        liked
    );


    button.innerHTML =
        liked
            ? "♥ Liked"
            : "♡ Like";
}


// ======================================================
// REAL LIKE SYSTEM
// ======================================================

async function handleLike(button) {

    const post =
        button.closest(".post-card, .post");


    if (!post) {
        return;
    }


    const postId =
        getPostId(post);


    if (!postId) {

        console.warn(
            "Post ID missing."
        );

        return;
    }


    const countElement =
        post.querySelector(".like-count");


    let currentCount =
        parseInt(
            countElement?.textContent || "0"
        );


    const wasLiked =
        button.classList.contains("liked");


    button.disabled = true;


    try {

        if (wasLiked) {

            await unlikePost(
                postId,
                CURRENT_USER_ID
            );


            currentCount =
                Math.max(
                    0,
                    currentCount - 1
                );


            updateLikeUI(
                post,
                false,
                currentCount
            );

        } else {

            await likePost(
                postId,
                CURRENT_USER_ID
            );


            currentCount++;

            updateLikeUI(
                post,
                true,
                currentCount
            );

        }

    } catch (error) {

        console.error(
            "Like API error:",
            error
        );

    } finally {

        button.disabled = false;

    }

}


// ======================================================
// REAL FOLLOW SYSTEM
// ======================================================

async function handleFollow(button) {

    const followingId =
        button.dataset.userId;


    if (!followingId) {

        console.warn(
            "Following user ID missing."
        );

        return;
    }


    const isFollowing =
        button.classList.contains("following");


    button.disabled = true;


    try {

        if (isFollowing) {

            await unfollowUser(
                followingId,
                CURRENT_USER_ID
            );


            button.classList.remove(
                "following"
            );

            button.textContent =
                "Follow";

        } else {

            await followUser(
                followingId,
                CURRENT_USER_ID
            );


            button.classList.add(
                "following"
            );

            button.textContent =
                "Following";

        }

    } catch (error) {

        console.error(
            "Follow API error:",
            error
        );

    } finally {

        button.disabled = false;

    }

}


// ======================================================
// COMMENTS UI
// ======================================================

function createCommentBox(post) {

    let commentBox =
        post.querySelector(".comment-box");


    if (commentBox) {
        return commentBox;
    }


    commentBox =
        document.createElement("div");


    commentBox.className =
        "comment-box";


    commentBox.style.marginTop =
        "12px";


    commentBox.innerHTML = `

        <div
            style="
                display:flex;
                gap:8px;
            "
        >

            <input
                type="text"
                class="comment-input"
                placeholder="Write a comment..."
                style="
                    flex:1;
                    border:1px solid var(--border);
                    border-radius:10px;
                    padding:10px 12px;
                    outline:none;
                "
            >

            <button
                type="button"
                class="comment-submit"
                style="
                    border:0;
                    border-radius:10px;
                    padding:10px 14px;
                    background:var(--primary);
                    color:white;
                    cursor:pointer;
                "
            >
                Comment
            </button>

        </div>

        <div
            class="comments-list"
            style="margin-top:10px;"
        ></div>

    `;


    post.appendChild(
        commentBox
    );


    return commentBox;
}


// ======================================================
// LOAD COMMENTS
// ======================================================

async function loadComments(
    post,
    postId
) {

    const commentBox =
        createCommentBox(post);


    const list =
        commentBox.querySelector(
            ".comments-list"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        "<div style='font-size:12px;color:var(--muted);'>Loading...</div>";


    try {

        const data =
            await getComments(postId);


        const comments =
            data.comments || [];


        list.innerHTML = "";


        if (!comments.length) {

            list.innerHTML =
                "<div style='font-size:12px;color:var(--muted);'>No comments yet.</div>";

            return;
        }


        comments.forEach(comment => {

            const item =
                document.createElement("div");


            item.style.marginTop =
                "8px";


            item.style.padding =
                "9px 12px";


            item.style.background =
                "#f5f4ff";


            item.style.borderRadius =
                "10px";


            item.style.fontSize =
                "13px";


            const username =
                comment.username ||
                comment.name ||
                comment.user_name ||
                "User";


            item.innerHTML = `

                <strong>
                    ${escapeHTML(username)}
                </strong>

                <br>

                ${escapeHTML(
                    comment.content || ""
                )}

            `;


            list.appendChild(item);

        });


    } catch (error) {

        console.error(
            "Comments API error:",
            error
        );


        list.innerHTML =
            "<div style='font-size:12px;color:#b00020;'>Failed to load comments.</div>";

    }

}


// ======================================================
// SUBMIT COMMENT
// ======================================================

async function submitComment(
    post,
    input
) {

    const postId =
        getPostId(post);


    if (!postId) {
        return;
    }


    const content =
        input.value.trim();


    if (!content) {
        return;
    }


    const button =
        post.querySelector(
            ".comment-submit"
        );


    if (button) {
        button.disabled = true;
    }


    try {

        await createComment(
            postId,
            CURRENT_USER_ID,
            content
        );


        input.value = "";


        await loadComments(
            post,
            postId
        );


    } catch (error) {

        console.error(
            "Create comment API error:",
            error
        );

        alert(
            "Could not post your comment."
        );

    } finally {

        if (button) {
            button.disabled = false;
        }

    }

}


// ======================================================
// COMMENT SYSTEM
// ======================================================

function handleComment(button) {

    const post =
        button.closest(
            ".post-card, .post"
        );


    if (!post) {
        return;
    }


    const postId =
        getPostId(post);


    if (!postId) {

        console.warn(
            "Post ID missing."
        );

        return;
    }


    const commentBox =
        createCommentBox(post);


    const input =
        commentBox.querySelector(
            ".comment-input"
        );


    if (input) {
        input.focus();
    }


    loadComments(
        post,
        postId
    );


    const submit =
        commentBox.querySelector(
            ".comment-submit"
        );


    if (
        submit &&
        !submit.dataset.connected
    ) {

        submit.dataset.connected =
            "true";


        submit.addEventListener(
            "click",
            () => {

                submitComment(
                    post,
                    input
                );

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    submitComment(
                        post,
                        input
                    );

                }

            }
        );

    }

}


// ======================================================
// SHARE SYSTEM
// ======================================================

async function handleShare(button) {

    const post =
        button.closest(
            ".post-card, .post"
        );


    if (!post) {
        return;
    }


    const text =
        post.innerText.substring(
            0,
            250
        );


    try {

        if (navigator.share) {

            await navigator.share({
                title: "Qelvuzo",
                text
            });

        } else if (navigator.clipboard) {

            await navigator.clipboard.writeText(
                text
            );


            const original =
                button.innerText;


            button.innerText =
                "Shared";


            setTimeout(() => {

                button.innerText =
                    original;

            }, 1500);

        } else {

            alert(
                "Sharing is not available."
            );

        }

    } catch (error) {

        console.log(
            "Share cancelled."
        );

    }

}


// ======================================================
// SEARCH
// ======================================================

function setupSearch() {

    const inputs =
        document.querySelectorAll(
            ".search-input"
        );


    inputs.forEach(input => {

        input.addEventListener(
            "input",
            () => {

                const query =
                    input.value
                        .toLowerCase()
                        .trim();


                const cards =
                    document.querySelectorAll(
                        ".person-card, " +
                        ".trend-card, " +
                        ".community-card, " +
                        ".popular-post"
                    );


                cards.forEach(card => {

                    const text =
                        card.innerText
                            .toLowerCase();


                    card.style.display =
                        (
                            query === "" ||
                            text.includes(query)
                        )
                            ? ""
                            : "none";

                });

            }
        );

    });

}


// ======================================================
// LOAD REAL POSTS
// ======================================================

async function loadRealPosts() {

    try {

        const data =
            await getPosts();


        console.log(
            "Qelvuzo posts:",
            data
        );


        const posts =
            data.posts || [];


        if (!Array.isArray(posts)) {
            return;
        }


        /*
         * আপাতত existing design-এর static posts
         * remove করছি না।
         *
         * Backend থেকে real posts এলে console-এ
         * data পাওয়া যাবে।
         *
         * পরের update-এ আমরা backend data দিয়ে
         * একই design-এর dynamic cards render করব।
         */

        return posts;

    } catch (error) {

        console.error(
            "Failed to load Qelvuzo posts:",
            error
        );


        return [];

    }

}


// ======================================================
// API CONNECTION TEST
// ======================================================

async function checkQelvuzoAPI() {

    try {

        const data =
            await qelvuzoHealth();


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

}


// ======================================================
// MOBILE MENU
// ======================================================

function setupMobileMenu() {

    const menuBtn =
        document.querySelector(
            ".menu-btn"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (
        menuBtn &&
        sidebar
    ) {

        menuBtn.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "active"
                );

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ======================================================
// NOTIFICATIONS
// ======================================================

function setupNotifications() {

    const markAllRead =
        document.querySelector(
            ".mark-all-read"
        );


    if (!markAllRead) {
        return;
    }


    markAllRead.addEventListener(
        "click",
        async () => {

            const unreadItems =
                document.querySelectorAll(
                    ".notification.unread"
                );


            unreadItems.forEach(item => {

                item.classList.remove(
                    "unread"
                );

            });


            const unreadDots =
                document.querySelectorAll(
                    ".unread-dot"
                );


            unreadDots.forEach(dot => {

                dot.style.display =
                    "none";

            });


            try {

                await markAllNotificationsRead(
                    CURRENT_USER_ID
                );

            } catch (error) {

                console.error(
                    "Notification API error:",
                    error
                );

            }

        }
    );

}


// ======================================================
// CHAT SYSTEM
// ======================================================

function setupChat() {

    const messageInput =
        document.querySelector(
            ".message-input"
        );


    const sendButton =
        document.querySelector(
            ".send-btn"
        );


    const chatMessages =
        document.querySelector(
            ".chat-messages"
        );


    if (
        !messageInput ||
        !chatMessages
    ) {

        return;

    }


    function addLocalMessage(
        message
    ) {

        const messageElement =
            document.createElement(
                "div"
            );


        messageElement.className =
            "message sent";


        messageElement.innerHTML = `

            <div class="message-bubble">
                ${escapeHTML(message)}
            </div>

        `;


        chatMessages.appendChild(
            messageElement
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    async function sendChatMessage() {

        const message =
            messageInput.value.trim();


        if (!message) {
            return;
        }


        addLocalMessage(
            message
        );


        messageInput.value = "";


        /*
         * Conversation ID পাওয়া গেলে
         * এখানে backend sendMessage API
         * ব্যবহার করা হবে।
         */

    }


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendChatMessage
        );

    }


    messageInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendChatMessage();

            }

        }
    );

}


// ======================================================
// ACTIVE NAVIGATION
// ======================================================

function setupActiveNavigation() {

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (!currentPage) {
        currentPage = "index.html";
    }


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

            link.classList.add(
                "active"
            );

        }

    });

}


// ======================================================
// FRONTEND EVENTS
// ======================================================

function setupPostEvents() {

    // -----------------------------
    // LIKE
    // -----------------------------

    document
        .querySelectorAll(".like-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    handleLike(
                        button
                    );

                }
            );

        });


    // -----------------------------
    // COMMENT
    // -----------------------------

    document
        .querySelectorAll(".comment-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    handleComment(
                        button
                    );

                }
            );

        });


    // -----------------------------
    // SHARE
    // -----------------------------

    document
        .querySelectorAll(".share-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    handleShare(
                        button
                    );

                }
            );

        });


    // -----------------------------
    // FOLLOW
    // -----------------------------

    document
        .querySelectorAll(".follow-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    handleFollow(
                        button
                    );

                }
            );

        });

}


// ======================================================
// APPLICATION START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Qelvuzo frontend started."
        );


        // API health
        await checkQelvuzoAPI();


        // Existing UI
        setupMobileMenu();

        setupNotifications();

        setupChat();

        setupSearch();

        setupActiveNavigation();

        setupPostEvents();


        // Backend posts
        await loadRealPosts();


        console.log(
            "Qelvuzo frontend ready."
        );

    }
);
