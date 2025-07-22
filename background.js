const audioContexts = {};

// Listen for tab volume change messages
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "SET_VOLUME") {
    const { tabId, volume } = message;

    if (!audioContexts[tabId]) {
      const stream = await chrome.tabCapture.capture({
        audio: true,
        video: false,
        targetTabId: tabId
      });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      source.connect(gainNode).connect(audioContext.destination);

      audioContexts[tabId] = {
        audioContext,
        gainNode
      };
    }

    audioContexts[tabId].gainNode.gain.value = volume;
  }

  // Refresh UI request
  if (message.type === "REQUEST_REFRESH") {
    chrome.runtime.sendMessage({ type: "REFRESH_UI" });
  }
});

// Monitor audible status changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.audible !== undefined) {
    chrome.runtime.sendMessage({ type: "REFRESH_UI" });
  }
});

const stream = await chrome.tabCapture.capture({
    audio: true,
    video: false,
    targetTabId: tabId
  });
  
  if (!stream) {
    console.error(`Failed to capture tab ${tabId}.`);
    return;
  }
  