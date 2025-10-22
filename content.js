// content.js
//["*://podcast.ucsd.edu/*"],
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "scrapeLectureHeader") {
    console.log("scraping header");
    let header = document.querySelector("#LectureHeader h2");
    // let filedirectory = document.querySelector("#title_Label h1")
    if (header) {
        console.log("sent: " + header.textContent);
      // sendResponse({ text: filedirectry + "/" + header.textContent });
      sendResponse({ text: header.textContent });
    } else {
      sendResponse({ text: null });
    }
    return true; // safe if async, but optional here
  }
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