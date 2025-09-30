const infoDiv = document.getElementById("info");
const statusDiv = document.getElementById("status");
const grabBtn = document.getElementById("grabBtn");

// Function to update current tab info
function updateActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    infoDiv.textContent = `Current URL: ${tab.url}`;
  });
}

// Grab SRT URL from content script
grabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getSRTUrl
      },
      (results) => {
        if (results && results[0].result) {
          statusDiv.textContent = `SRT URL: ${results[0].result}`;
        } else {
          statusDiv.textContent = "No SRT found on this page.";
        }
      }
    );
  });
});

// Function injected into page
function getSRTUrl() {
  // Example: find first .srt in network or links
  const links = Array.from(document.querySelectorAll("a"));
  const srtLink = links.find(link => link.href.endsWith(".srt"));
  return srtLink ? srtLink.href : null;
}

// Update when sidebar loads
updateActiveTab();

// Listen for tab changes
chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") updateActiveTab();
});
