# 🔊 Tab Volume Controller

**Tab Volume Controller** is a lightweight browser extension that lets you adjust the audio volume of each tab independently. Perfect for users who listen to music, watch videos, or multitask with multiple media tabs open.

## 🚀 Features

- 🎧 **Per-tab volume control**: Adjust volume for individual tabs with a simple slider.
- 🔍 **Auto-detects active audio tabs**: Only shows tabs currently playing sound.
- 🧭 **Live tab list**: View all tabs that are producing audio in real time.
- 📉 **Smooth volume adjustment**: Control media volume from 0% to 100% using DOM injection.
- 🧠 **Lightweight and privacy-respecting**: No background data collection or third-party tracking.


## 🛠️ How It Works

- Uses the Chrome Extension APIs to detect tabs with audio (`tab.audible`)
- Injects a content script that finds `<video>` and `<audio>` elements and adjusts their `.volume` property directly
- Updates the UI dynamically when new tabs start or stop playing audio

## 📦 Installation

### ✅ Chrome (Manual)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/tab-volume-controller.git
Open chrome://extensions in your browser

Enable Developer Mode

Click Load Unpacked

Select the project folder

🔜 Chrome Web Store (Coming Soon)
Stay tuned for a published version on the Chrome Web Store.

🧩 Permissions
This extension requests the following permissions:

tabs – to detect open tabs and their audio status

scripting – to inject volume control logic into each tab

activeTab – required for interacting with content scripts

No browsing history or user data is collected or stored.

🧪 Known Limitations
Works best on sites using HTML5 <audio> or <video> tags (YouTube, Twitch, etc.)

May not affect audio from canvas or WebRTC elements

Does not persist volume settings after tab reload (planned feature)

🧰 Technologies Used
-Manifest V3
-JavaScript (Vanilla)
-Chrome Extensions API (tabs, scripting)
-DOM manipulation

🤝 Contributing
Pull requests are welcome! If you'd like to:

Add mute/unmute toggles

Save per-tab volume preferences

Add hotkey support

Please fork the repo and submit a PR.

MIT License
-
