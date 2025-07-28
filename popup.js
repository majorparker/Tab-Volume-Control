document.addEventListener('DOMContentLoaded', renderTabs);

async function renderTabs() {
  const tabsList = document.getElementById('tabs-list');
  tabsList.innerHTML = '';

  // Get all tab volumes from background script
  let tabVolumes = {};
  try {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "GET_ALL_TAB_VOLUMES" }, resolve);
    });
    tabVolumes = response.tabVolumes || {};
  } catch (error) {
    console.error('Failed to get tab volumes:', error);
    tabVolumes = {};
  }

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.audible) {
        const card = document.createElement('div');
        card.className = 'tab-card';

        // Favicon
        const favicon = document.createElement('img');
        favicon.className = 'favicon';
        favicon.src = tab.favIconUrl || '';
        favicon.alt = '';
        card.appendChild(favicon);

        // Title
        const title = document.createElement('span');
        title.className = 'tab-title';
        title.textContent = tab.title;
        card.appendChild(title);

        // Volume slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        // Set the slider value to the stored volume or default to 100
        slider.value = tabVolumes[tab.id] ? Math.round(tabVolumes[tab.id] * 100) : 100;
        slider.className = 'volume-slider';
        card.appendChild(slider);

        // Mute button
        const muteBtn = document.createElement('button');
        muteBtn.className = 'mute-btn';
        muteBtn.innerHTML = '\uD83D\uDD07'; // Speaker with X
        muteBtn.title = 'Mute/Unmute';
        card.appendChild(muteBtn);

        // Volume change event
        slider.addEventListener('input', () => {
          const volume = slider.value / 100;
          
          // Send to background script for persistence
          chrome.runtime.sendMessage({
            type: "UPDATE_VOLUME",
            tabId: tab.id,
            volume: volume
          });
          
          // Send to content script for immediate effect
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }, () => {
            chrome.tabs.sendMessage(tab.id, {
              type: "SET_VOLUME",
              volume: volume
            });
          });
        });

        // Mute/unmute event
        muteBtn.addEventListener('click', () => {
          chrome.tabs.update(tab.id, { muted: !tab.mutedInfo.muted }, () => {
            tab.mutedInfo.muted = !tab.mutedInfo.muted;
            muteBtn.innerHTML = tab.mutedInfo.muted ? '\uD83D\uDD07' : '\uD83D\uDD08'; // Toggle icon
          });
        });
        // Set initial mute icon
        muteBtn.innerHTML = tab.mutedInfo && tab.mutedInfo.muted ? '\uD83D\uDD07' : '\uD83D\uDD08';

        tabsList.appendChild(card);
      }
    });
  });
}
