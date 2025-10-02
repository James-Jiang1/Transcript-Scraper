function extractCourse(url) {
  const lastSegment = url.split("/").slice(-2, -1)[0]; 
  return lastSegment.split("_")[0];
}

let latestSRT = null;
let latestheader = "h";
console.log("back init");

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Watch for .srt files
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.includes(".srt")) {
      console.log("Found SRT file:", details.url);
      latestSRT = details.url;
    }
  },
  { urls: ["<all_urls>"] }
);

// Auto-open side panel on matching URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("podcast.ucsd.edu")) {
    chrome.sidePanel.open({ tabId: tabId });
  }
});

// Receive lecture header from content.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "lectureHeader") {
    latestheader = msg.text;
    console.log("found lecture header: " + latestheader);
    sendResponse({});
  }
});

// Handle SRT requests & downloads
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getLatestSRT") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { type: "scrapeLectureHeader" }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Error talking to content script:", chrome.runtime.lastError.message);
          sendResponse({ url: null, filename: null });
          return;
        }

        let headerText = response && response.text ? response.text.replace(/\//g, '_') : "Unknown";
        let latestFilename = "Transcripts/" + extractCourse(tabs[0].url) + "/" + headerText + ".srt"; // use .srt
        
        sendResponse({ url: latestSRT, filename: latestFilename });
      });
    });
    return true; // async response
  }

  if (msg.type === "downloadSRT") {
    if (!latestSRT) {
      console.warn("No SRT detected yet. Cannot download.");
      return;
    }

    const filename = msg.filename ? msg.filename : "captions.srt";
    console.log("Downloading SRT:", latestSRT, "as", filename);

    chrome.downloads.download({
      url: latestSRT,
      filename: filename
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log("Download started, ID:", downloadId);
      }
    });
  }
});
