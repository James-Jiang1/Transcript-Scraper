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



// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (msg.type === "refresh") {
//         document.location.reload(true);
//         sendResponse({});
//     }
// });