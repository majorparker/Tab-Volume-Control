chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SET_VOLUME") {
      const videos = document.querySelectorAll("video, audio");
      videos.forEach(el => el.volume = message.volume);
    }
  });
  