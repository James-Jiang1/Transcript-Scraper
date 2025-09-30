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
/**"I am providing you with a transcript of a lecture. Please summarize it in a way that highlights:

Main ideas and key concepts from the lecture.

Important test information such as definitions, formulas, or examples that are likely to appear on exams.

Class logistics such as assignment deadlines, exam dates, office hours, and any other relevant announcements.

Timestamps for sections of the transcript where key concepts or important information are discussed, so I can refer back to them if I need further clarification.

Keep the summary clear and organized, ideally broken down by topic or section. Maintain the original timestamps from the transcript for reference. If certain 
parts are particularly dense or critical for exams, highlight them in a way that’s easy to scan."*/