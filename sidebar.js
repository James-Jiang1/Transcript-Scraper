document.addEventListener("DOMContentLoaded", () => {
  const grabBtn = document.getElementById("grabSRT");
  const status = document.getElementById("status");

  // Handle the grab/download button
  grabBtn.addEventListener("click", () => {
    console.log("clicked")
    // Step 1: Request latest SRT + filename from background
    chrome.runtime.sendMessage({ type: "getLatestSRT" }, (response) => {
      if (chrome.runtime.lastError) {
        status.innerText = "Error: " + chrome.runtime.lastError.message;
        return;
      }

      if (response && response.url) {
        status.innerText = "SRT found: " + response.url;

        // Step 2: Ask background to download the SRT file
        chrome.runtime.sendMessage({
          type: "downloadSRT",
          filename: response.filename
        });
      } else {
        status.innerText = "No SRT file yet.";
      }
    });
  });

  // Optionally, you can automatically request the header on load
  chrome.runtime.sendMessage({ type: "getLatestSRT" }, (response) => {
    if (response && response.url) {
      status.innerText = "Ready to download: " + response.filename;
    } else {
      status.innerText = "Waiting for SRT...";
    }
  });
});
