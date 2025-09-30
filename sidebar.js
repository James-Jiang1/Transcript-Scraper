document.addEventListener("DOMContentLoaded", () => {
  const grabBtn = document.getElementById("grabSRT");
  const copyBtn = document.getElementById("copyPrompt");
  const refreshBtn = document.getElementById("refreshPage");
  const status = document.getElementById("status");

  console.log("sidebar.js loaded");

  // Download button
  grabBtn.addEventListener("click", () => {
    console.log("Download button clicked!");
    chrome.runtime.sendMessage({ type: "getLatestSRT" }, (response) => {
      if (chrome.runtime.lastError) {
        status.innerText = "Error: " + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.url) {
        status.innerText = "SRT found: " + response.url;
        chrome.runtime.sendMessage({
          type: "downloadSRT",
          filename: response.filename
        });
      } else {
        status.innerText = "No SRT file yet.";
      }
    });
  });

  // Copy prompt button
  copyBtn.addEventListener("click", async () => {
    const promptText = "I am providing you with a transcript of a lecture. Please summarize it in a way that highlights: Main ideas and key concepts from the lecture. Important test information such as definitions, formulas, or examples that are likely to appear on exams. Class logistics such as assignment deadlines, exam dates, office hours, and any other relevant announcements. Timestamps for sections of the transcript where key concepts or important information are discussed, so I can refer back to them if I need further clarification. Keep the summary clear and organized, ideally broken down by topic or section. Maintain the original timestamps from the transcript for reference. If certain parts are particularly dense or critical for exams, highlight them in a way that’s easy to scan."; 
    try {
      await navigator.clipboard.writeText(promptText);
      status.innerText = "Prompt copied to clipboard!";
      console.log("Prompt copied:", promptText);
    } catch (err) {
      status.innerText = "Failed to copy prompt.";
      console.error("Clipboard copy failed:", err);
    }
  });

  // Refresh page button
  refreshBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => location.reload()
        });
        status.innerText = "Page refreshed!";
        console.log("Page refreshed for tab:", tabs[0].id);
      }
    });
  });

  // Optional: show ready status on load
  chrome.runtime.sendMessage({ type: "getLatestSRT" }, (response) => {
    if (response && response.url) {
      status.innerText = "Ready to download: " + response.filename;
    } else {
      status.innerText = "Waiting for SRT...";
    }
  });
});
