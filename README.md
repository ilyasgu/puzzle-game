# Puzzle Game

A web-based sliding tile puzzle game. Match patterns by sliding tiles to complete levels!

## 🎮 Game Features

- **4 Challenging Levels**: Progressive difficulty with different target patterns
- **Sliding Puzzle Mechanics**: Click adjacent tiles to slide them into the empty space
- **Move Counter**: Track your efficiency
- **Responsive Design**: Works on desktop and mobile devices
- **No Backend Required**: 100% frontend, very cheap to host!

## 🚀 How to Play

1. Click on tiles adjacent to the empty space to slide them
2. Match the target pattern shown in one of the example puzzles at the bottom
3. Complete the pattern with the fewest moves possible
4. Progress through all 4 levels

## 💰 Deploy to Azure (FREE)

Azure Static Web Apps has a **generous free tier** perfect for this game:
- Free SSL certificate
- Global CDN
- 100 GB bandwidth per month
- Custom domains supported

### Deployment Steps:

#### Option 1: Azure Static Web Apps (Recommended - FREE)

1. **Prerequisites:**
   - Azure account (free tier available)
   - GitHub account
   - Git installed

2. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/puzzle-game.git
   git push -u origin main
   ```

3. **Create Static Web App:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"
   - Fill in:
     - Subscription: Your subscription
     - Resource Group: Create new or use existing
     - Name: puzzle-game (or your choice)
     - Plan type: **Free**
     - Region: Choose closest to you
     - Source: GitHub
     - Connect your GitHub account
     - Select your repository and branch
     - Build Presets: Custom
     - App location: `/`
     - Output location: (leave empty)
   - Click "Review + create"
   - Click "Create"

4. **Wait for deployment:**
   - Azure will automatically set up GitHub Actions
   - Your app will be live in a few minutes
   - URL format: `https://YOUR-APP-NAME.azurestaticapps.net`

#### Option 2: Azure Storage Static Website (Also FREE tier available)

1. **Create Storage Account:**
   ```bash
   az storage account create \
     --name puzzlegame \
     --resource-group myResourceGroup \
     --location eastus \
     --sku Standard_LRS \
     --kind StorageV2
   ```

2. **Enable Static Website:**
   ```bash
   az storage blob service-properties update \
     --account-name puzzlegame \
     --static-website \
     --index-document index.html
   ```

3. **Upload Files:**
   ```bash
   az storage blob upload-batch \
     --account-name puzzlegame \
     --destination '$web' \
     --source .
   ```

#### Option 3: GitHub Pages (100% FREE)

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages"
   - Select branch "main"
   - Select folder "/ (root)"
   - Save

2. **Your site will be live at:**
   `https://YOUR_USERNAME.github.io/puzzle-game/`

## 🏗️ Local Development

Simply open `index.html` in your browser. No build process or server needed!

Or use a simple HTTP server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000`

## 📁 Project Structure

```
puzzle-game/
├── index.html              # Main HTML structure
├── styles.css              # Game styling
├── game.js                 # Game logic
├── staticwebapp.config.json # Azure configuration
└── README.md               # This file
```

## 🎯 Game Mechanics

The game uses a sliding tile puzzle mechanism where:
- Tiles can only move into adjacent empty spaces
- Three types of tiles: Red circles, Green squares, and Number 3s
- Each level has a specific target pattern to achieve
- Patterns get progressively more challenging

## 🔧 Customization

### Add More Levels
Edit `game.js` and add to the `LEVELS` array:

```javascript
{
    pattern: [
        ['red', 'green', 'num'],
        ['green', 'empty', 'num'],
        ['num', 'red', 'red']
    ],
    shuffles: 30  // Difficulty
}
```

### Change Colors
Edit `styles.css` to customize the color scheme:
- `.game-board` - Main board color
- `.tile.red::after` - Red circle color
- `.tile.green::after` - Green square color

## 💡 Tips

- Start with corner and edge pieces
- Plan your moves ahead
- The reset button (circular arrow) restarts the current level
- Fewer moves = better score!

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## 📄 License

Free to use and modify!

---

Enjoy the puzzle! 🧩
