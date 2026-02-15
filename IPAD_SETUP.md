# Run on iPad - Setup Guide

## Option 1: Simple HTTP Server (Recommended)

1. **On your Mac**, start a local server:
   ```bash
   cd /Users/ilyasgu/Code/puzzle-game
   python3 -m http.server 8000
   ```

2. **Find your Mac's IP address**:
   ```bash
   ipconfig getifaddr en0
   ```
   (Example output: `192.168.1.100`)

3. **On your iPad**, open Safari and go to:
   ```
   http://YOUR_MAC_IP:8000
   ```
   (Replace `YOUR_MAC_IP` with the IP from step 2)

4. **Add to Home Screen** on iPad:
   - Tap the Share button in Safari
   - Select "Add to Home Screen"
   - Now it works like a native app!

---

## Option 2: iCloud Drive (Offline Access)

1. **On your Mac**, copy files to iCloud:
   ```bash
   cp -r /Users/ilyasgu/Code/puzzle-game ~/Library/Mobile\ Documents/com~apple~CloudDocs/puzzle-game
   ```

2. **On your iPad**:
   - Open Files app
   - Navigate to iCloud Drive → puzzle-game
   - Tap on `index.html`
   - Choose "Open with Safari" or "Quick Look"

---

## Option 3: AirDrop (Quick Test)

1. **On your Mac**:
   - Select all files in puzzle-game folder
   - Right-click → Share → AirDrop
   - Send to your iPad

2. **On your iPad**:
   - Save files to Files app
   - Open `index.html` in Safari

---

## Option 4: Deploy to Azure/GitHub Pages (Best for Permanent Access)

Deploy once, access anywhere (no Mac needed):

1. **Deploy to GitHub Pages** (FREE):
   ```bash
   cd /Users/ilyasgu/Code/puzzle-game
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # Create repo on GitHub, then:
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. Enable GitHub Pages in repo settings

3. Access from iPad at: `https://YOUR_USERNAME.github.io/puzzle-game/`

---

## Quick Test Command (Option 1)

Run this on your Mac:
```bash
cd /Users/ilyasgu/Code/puzzle-game && python3 -m http.server 8000
```

Then on iPad Safari, go to: `http://YOUR_MAC_IP:8000`

---

## Troubleshooting

**Can't connect from iPad to Mac server?**
- Make sure both devices are on the same WiFi network
- Check Mac firewall settings (System Preferences → Security & Privacy → Firewall)
- Try turning off Mac firewall temporarily to test

**Touch not working smoothly?**
- The game now has touch event support optimized for iPad
- Refresh the page after copying updated files

**Want fullscreen experience?**
- In Safari, tap the "AA" button in address bar
- Select "Hide Toolbar"
- Add to Home Screen for app-like experience
