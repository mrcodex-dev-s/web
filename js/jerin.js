(() => {
  "use strict";
  const STORAGE_KEY = "qelvuzo:jerin-space:message";
  const defaultMessage = "Some people make ordinary days feel a little brighter. This space is a small reminder that your presence is appreciated. Keep being yourself, keep smiling, and keep making your own kind of magic.";
  const messageText = document.getElementById("messageText");
  const dialog = document.getElementById("messageDialog");
  const messageInput = document.getElementById("messageInput");
  const status = document.getElementById("saveStatus");
  const editButton = document.getElementById("editMessage");

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && messageText) messageText.textContent = saved;
  } catch (_) { /* Storage may be disabled by the browser. */ }

  editButton?.addEventListener("click", () => {
    messageInput.value = messageText?.textContent || defaultMessage;
    status.textContent = "";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  });

  document.getElementById("saveMessage")?.addEventListener("click", (event) => {
    event.preventDefault();
    const value = messageInput.value.trim();
    if (!value) { status.textContent = "Please enter a message first."; return; }
    if (messageText) messageText.textContent = value;
    try { localStorage.setItem(STORAGE_KEY, value); status.textContent = "Saved on this device."; }
    catch (_) { status.textContent = "Updated for this visit. Browser storage is unavailable."; }
    window.setTimeout(() => dialog.close(), 450);
  });

  document.getElementById("musicForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const field = document.getElementById("musicUrl");
    const output = document.getElementById("musicStatus");
    let url;
    try { url = new URL(field.value.trim()); }
    catch (_) { output.textContent = "Enter a valid YouTube or Spotify link."; return; }
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const allowed = ["youtube.com", "youtu.be", "music.youtube.com", "open.spotify.com"];
    if (!allowed.some((domain) => host === domain || host.endsWith("." + domain))) {
      output.textContent = "Only YouTube and Spotify links are supported."; return;
    }
    try { localStorage.setItem("qelvuzo:jerin-space:music", url.href); } catch (_) {}
    window.open(url.href, "_blank", "noopener,noreferrer");
    output.textContent = "Opening your song in a new tab.";
  });

  // Show the blue verification mark only when the backend confirms it.
  // Expected response: GET /api/users/jerin -> { "is_verified": true }
  fetch("/api/users/jerin", { headers: { "Accept": "application/json" }, credentials: "same-origin" })
    .then((response) => response.ok ? response.json() : null)
    .then((user) => {
      const badge = document.getElementById("verifiedBadge");
      if (badge && user && user.is_verified === true) badge.hidden = false;
    })
    .catch(() => { /* Keep the badge hidden if verification cannot be confirmed. */ });
})();
