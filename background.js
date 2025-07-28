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
      const audioContexts = {};
const tabVolumes = {}; // Store volume state for each tab

// Listen for tab volume change messages
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    if (message.type === "SET_VOLUME") {
      const { tabId, volume } = message;
      
      // Store the volume state
      tabVolumes[tabId] = volume;

      if (!audioContexts[tabId]) {
        const stream = await chrome.tabCapture.capture({
          audio: true,
          video: false,
          targetTabId: tabId
        });

        if (!stream) {
          console.error(`Failed to capture tab ${tabId}.`);
          return;
        }

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

    // Handle volume changes from popup
    if (message.type === "UPDATE_VOLUME") {
      const { tabId, volume } = message;
      
      // Store the volume state
      tabVolumes[tabId] = volume;

      if (!audioContexts[tabId]) {
        const stream = await chrome.tabCapture.capture({
          audio: true,
          video: false,
          targetTabId: tabId
        });

        if (!stream) {
          console.error(`Failed to capture tab ${tabId}.`);
          return;
        }

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

    // Get volume state for a specific tab
    if (message.type === "GET_TAB_VOLUME") {
      const { tabId } = message;
      sendResponse({ volume: tabVolumes[tabId] || 1 });
    }

    // Get all tab volumes
    if (message.type === "GET_ALL_TAB_VOLUMES") {
      sendResponse({ tabVolumes });
    }
  } catch (error) {
    console.error('Error in background script message handler:', error);
  }
});

// Monitor audible status changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.audible !== undefined) {
    // Initialize volume state for new audible tabs
    if (changeInfo.audible && !tabVolumes.hasOwnProperty(tabId)) {
      tabVolumes[tabId] = 1; // Default to full volume
    }
  }
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (audioContexts[tabId]) {
    audioContexts[tabId].audioContext.close();
    delete audioContexts[tabId];
  }
  delete tabVolumes[tabId];
});
