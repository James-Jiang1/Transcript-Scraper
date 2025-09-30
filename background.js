function extractCourse(url) {
  // Get the last part after the final '/'
  const lastSegment = url.split("/").slice(-2, -1)[0]; 
  // "math20c_d00"

  // Take everything before the first "_"
  return lastSegment.split("_")[0];
}

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});

let latestSRT = null;
let latestheader = "h";
console.log("back init");

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.includes(".srt")) {
      console.log("Found SRT file:", details.url);
      latestSRT = details.url;
    }
  },
  { urls: ["<all_urls>"] }
);

// Receive lecture header from content.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "lectureHeader") {
    latestheader = msg.text;
    console.log("found lecture header: " + latestheader);
    sendResponse({});
  }
});

// Allow popup.js (or sidebar) to request the latest SRT + filename
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getLatestSRT") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Ask the content script to scrape the header
      chrome.tabs.sendMessage(tabId, { type: "scrapeLectureHeader" }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Error talking to content script:", chrome.runtime.lastError.message);
          sendResponse({ url: null, filename: null });
          return;
        }

        // Response from content script
        let headerText = response && response.text ? response.text.replace(/\//g, '_') : "Unknown";
        console.log("ht: " + headerText);
        
        // Build filename using scraped header + course code from URL
        let latestFilename = "Transcripts/" + extractCourse(tabs[0].url) + "/" + headerText + ".txt";
        console.log("lfn: " + latestFilename);

        sendResponse({
          url: latestSRT,          // assuming you already have latestSRT set elsewhere
          filename: latestFilename
        });
      });
    });

    return true; // keep the channel open for async response
  }

  // ✅ NEW: handle download requests from sidebar
  if (msg.type === "downloadSRT" && latestSRT) {
    console.log("Downloading SRT:", latestSRT);
    chrome.downloads.download({
      url: latestSRT,
      filename: msg.filename || "captions.srt"
    });
  }
});
