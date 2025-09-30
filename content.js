// content.js
//["*://podcast.ucsd.edu/*"],
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "scrapeLectureHeader") {
    console.log("scraping header");
    let header = document.querySelector("#LectureHeader h2");
    if (header) {
        console.log("sent: " + header.textContent);
      sendResponse({ text: header.textContent });
    } else {
      sendResponse({ text: null });
    }
    return true; // safe if async, but optional here
  }
});

// Only inject once
if (!document.getElementById("srt-grabber-sidebar")) {
  const sidebar = document.createElement("div");
  sidebar.id = "srt-grabber-sidebar";
sidebar.style.cssText = `
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background: #f9fafb; /* light gray background */
  border-left: 1px solid #e5e7eb;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1); /* subtle shadow */
  z-index: 999999;
  padding: 16px;
  overflow-y: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
`;

sidebar.innerHTML = `
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h2 style="margin:0; font-size:18px; font-weight:600; color:#111827;">🎬 SRT Grabber</h2>
    <button id="closeSidebar" 
      style="border:none; background:none; font-size:18px; cursor:pointer; color:#6b7280;">
      ✖
    </button>
  </div>
  <button id="grabSRT"
    style="
      background:#2563eb;
      color:white;
      border:none;
      border-radius:6px;
      padding:10px 14px;
      font-size:14px;
      font-weight:500;
      cursor:pointer;
      transition: background 0.2s ease;
      margin-bottom:12px;
    "
    onmouseover="this.style.background='#1d4ed8'"
    onmouseout="this.style.background='#2563eb'"
  >
    ⬇️ Download Latest SRT
  </button>
  <pre id="status"
    style="
      background:#f3f4f6;
      border:1px solid #e5e7eb;
      border-radius:4px;
      padding:8px;
      font-size:13px;
      color:#374151;
      white-space:pre-wrap;
    "
  >Waiting...</pre>
`;
  document.body.appendChild(sidebar);

  // Close button logic
  document.getElementById("closeSidebar").addEventListener("click", () => {
    sidebar.remove();
  });

// SRT grab button
document.getElementById("grabSRT").addEventListener("click", () => {
  // Step 1: Ask background for the latest SRT + filename
  chrome.runtime.sendMessage({ type: "getLatestSRT" }, (response) => {
    if (response && response.url) {
      document.getElementById("status").innerText =
        "SRT found: " + response.url;

      // Step 2: Ask background to download it using the filename
      chrome.runtime.sendMessage({
        type: "downloadSRT",
        filename: response.filename
      });
    } else {
      document.getElementById("status").innerText = "No SRT file yet.";
    }
  });
});
}


// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (msg.type === "refresh") {
//         document.location.reload(true);
//         sendResponse({});
//     }
// });