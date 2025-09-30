// function CheckAndDownload (response) {
//   if (response && response.url) {
//       document.getElementById("status").innerText = "SRT found, downloading...";
//       chrome.downloads.download({
//         url: response.url,
//         filename: response.filename
//       });
//     } else {
//       document.getElementById("status").innerText = "No SRT file detected yet.";
//      chrome.runtime.sendMessage({type: "reload"}, (response) => {

//            })
// }}

document.getElementById("download").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "getLatestSRT" }, (response) => {
      if (response && response.url) {
        console.log("fn: " + response.filename);
      document.getElementById("status").innerText = "SRT found, downloading...";
      chrome.downloads.download({
        url: response.url,
        filename: response.filename
      });
    } else {
      document.getElementById("status").innerText = "No SRT file detected yet.";
  }});
}); 
