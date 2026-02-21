// Game state
let gameState = {
    grid: [],
    emptyPos: { row: 0, col: 0 },
    moves: 0,
    solved: 0,
    targetPattern: [],
    level: 1,
    gridRows: 3,
    gridCols: 3,
    language: 'en',
    theme: 'light'
};

// Translations
const translations = {
    en: {
        targetPattern: 'Target Pattern:',
        moves: 'Moves:',
        solvedMessage: '🎉 Solved! 🎉',
        darkMode: 'Dark Mode'
    },
    tr: {
        targetPattern: 'Hedef Desen:',
        moves: 'Hamle:',
        solvedMessage: '🎉 Çözüldü! 🎉',
        darkMode: 'Koyu Mod'
    },
    nl: {
        targetPattern: 'Doelpatroon:',
        moves: 'Zetten:',
        solvedMessage: '🎉 Opgelost! 🎉',
        darkMode: 'Donkere Modus'
    }
};

// Tile types
const TILE_TYPES = ['green', 'num', 'red'];

function shuffleArray(items) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
}

function getTilesForGrid(rows, cols) {
    const nonEmptyTileCount = (rows * cols) - 1;
    const tiles = [];

    for (let i = 0; i < nonEmptyTileCount; i++) {
        tiles.push(TILE_TYPES[i % TILE_TYPES.length]);
    }

    return tiles;
}

function setLevel(level) {
    if (level === 2) {
        gameState.level = 2;
        gameState.gridRows = 4;
        gameState.gridCols = 3;
    } else if (level === 3) {
        gameState.level = 3;
        gameState.gridRows = 3;
        gameState.gridCols = 4;
    } else if (level === 4) {
        gameState.level = 4;
        gameState.gridRows = 4;
        gameState.gridCols = 4;
    } else {
        gameState.level = 1;
        gameState.gridRows = 3;
        gameState.gridCols = 3;
    }

    localStorage.setItem('puzzleGameLevel', String(gameState.level));
}

// Generate a random target pattern with fixed tile types
function generateRandomTarget() {
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    const pattern = [];
    const tiles = getTilesForGrid(gridRows, gridCols);
    shuffleArray(tiles);
    
    // Randomly place the empty space
    const emptyIndex = Math.floor(Math.random() * (gridRows * gridCols));
    
    // Build the target pattern
    let tileIndex = 0;
    for (let row = 0; row < gridRows; row++) {
        pattern[row] = [];
        for (let col = 0; col < gridCols; col++) {
            const currentIndex = row * gridCols + col;
            if (currentIndex === emptyIndex) {
                pattern[row][col] = 'empty';
            } else {
                pattern[row][col] = tiles[tileIndex];
                tileIndex++;
            }
        }
    }
    
    return pattern;
}

// Calculate difficulty based on puzzles solved
function getShuffles() {
    return Math.min(15 + (gameState.solved * 2), 40);
}

// Render the grid
function renderGrid() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    puzzleGrid.innerHTML = '';
    puzzleGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const tile = document.createElement('div');
            tile.className = `tile ${gameState.grid[row][col]}`;
            tile.dataset.row = row;
            tile.dataset.col = col;
            
            if (gameState.grid[row][col] !== 'empty') {
                tile.addEventListener('click', () => handleTileClick(row, col));
                tile.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleTileClick(row, col);
                });
            }
            
            puzzleGrid.appendChild(tile);
        }
    }
    
    highlightMovableTiles();
}

// Check if a tile can move
function canMove(row, col) {
    const emptyRow = gameState.emptyPos.row;
    const emptyCol = gameState.emptyPos.col;
    
    // Check if adjacent to empty space
    return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
}

// Highlight movable tiles
function highlightMovableTiles() {
    const tiles = document.querySelectorAll('.tile:not(.empty)');
    tiles.forEach(tile => {
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        
        if (canMove(row, col)) {
            tile.classList.add('can-move');
        } else {
            tile.classList.remove('can-move');
        }
    });
}

// Handle tile click
function handleTileClick(row, col) {
    if (!canMove(row, col)) {
        return;
    }
    
    // Swap with empty space
    const emptyRow = gameState.emptyPos.row;
    const emptyCol = gameState.emptyPos.col;
    
    gameState.grid[emptyRow][emptyCol] = gameState.grid[row][col];
    gameState.grid[row][col] = 'empty';
    gameState.emptyPos = { row, col };
    gameState.moves++;
    updateMovesCount();
    
    renderGrid();
    
    // Check if puzzle is solved
    if (checkWin()) {
        gameState.solved++;
        showSolvedInStatusBar();
        setTimeout(() => {
            // Generate new target but keep current tile positions
            gameState.targetPattern = generateRandomTarget();
            gameState.moves = 0;
            updateMovesCount();
            renderTargetGrid();
        }, 1500);
    }
}

// Check if puzzle matches target pattern
function checkWin() {
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (gameState.grid[row][col] !== gameState.targetPattern[row][col]) {
                return false;
            }
        }
    }
    
    return true;
}

// Render the target grid
function renderTargetGrid() {
    const targetGrid = document.getElementById('targetGrid');
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    targetGrid.innerHTML = '';
    targetGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const tile = document.createElement('div');
            tile.className = `mini-tile ${gameState.targetPattern[row][col]}`;
            
            if (gameState.targetPattern[row][col] === 'num') {
                tile.textContent = '7';
            }
            
            targetGrid.appendChild(tile);
        }
    }
}

// Show solved message in status bar
function showSolvedInStatusBar() {
    const statusBar = document.querySelector('.status-bar');
    const originalHTML = statusBar.innerHTML;
    
    const message = translations[gameState.language].solvedMessage;
    statusBar.innerHTML = `<div class="solved-status">${message}</div>`;
    statusBar.classList.add('solved-highlight');
    
    setTimeout(() => {
        statusBar.innerHTML = originalHTML;
        statusBar.classList.remove('solved-highlight');
        updateLanguage();
    }, 5000);
}

// Go to next level
function nextLevel() {
    // Removed - endless mode
}

// Start a new puzzle
function startNewPuzzle() {
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;

    // Generate random target pattern
    gameState.targetPattern = generateRandomTarget();
    
    // Create initial grid with fixed tile types
    const tiles = getTilesForGrid(gridRows, gridCols);
    shuffleArray(tiles);
    
    // Place tiles and empty space
    const emptyIndex = Math.floor(Math.random() * (gridRows * gridCols));
    let tileIndex = 0;
    gameState.grid = [];
    
    for (let row = 0; row < gridRows; row++) {
        gameState.grid[row] = [];
        for (let col = 0; col < gridCols; col++) {
            const currentIndex = row * gridCols + col;
            if (currentIndex === emptyIndex) {
                gameState.grid[row][col] = 'empty';
                gameState.emptyPos = { row, col };
            } else {
                gameState.grid[row][col] = tiles[tileIndex];
                tileIndex++;
            }
        }
    }
    
    // Render both grids
    gameState.moves = 0;
    updateMovesCount();
    renderGrid();
    renderTargetGrid();
}

// Shuffle puzzle by making random valid moves
function shufflePuzzle(moves) {
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    const directions = [
        { dr: -1, dc: 0 }, // up
        { dr: 1, dc: 0 },  // down
        { dr: 0, dc: -1 }, // left
        { dr: 0, dc: 1 }   // right
    ];
    
    let lastMove = null;
    
    for (let i = 0; i < moves; i++) {
        const validMoves = [];
        
        directions.forEach((dir, index) => {
            const newRow = gameState.emptyPos.row + dir.dr;
            const newCol = gameState.emptyPos.col + dir.dc;
            
            if (newRow >= 0 && newRow < gridRows && newCol >= 0 && newCol < gridCols) {
                // Avoid immediately undoing the last move
                if (lastMove === null || index !== (lastMove + 2) % 4) {
                    validMoves.push({ row: newRow, col: newCol, moveIndex: index });
                }
            }
        });
        
        if (validMoves.length > 0) {
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            
            // Swap
            gameState.grid[gameState.emptyPos.row][gameState.emptyPos.col] = 
                gameState.grid[move.row][move.col];
            gameState.grid[move.row][move.col] = 'empty';
            gameState.emptyPos = { row: move.row, col: move.col };
            
            lastMove = move.moveIndex;
        }
    }
}

// Reset just changes the target, not the board
function resetGame() {
    // Generate new random target pattern
    gameState.targetPattern = generateRandomTarget();
    gameState.moves = 0;
    updateMovesCount();
    
    // Only render the target grid, keep board unchanged
    renderTargetGrid();
}

// Update moves counter
function updateMovesCount() {
    document.getElementById('movesCount').textContent = gameState.moves;
}

// Update theme
function updateTheme() {
    const isDark = gameState.theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('puzzleGameTheme', gameState.theme);
}

// Change theme
function changeTheme(theme) {
    gameState.theme = theme;
    updateTheme();
}

// Update language
function updateLanguage() {
    const lang = gameState.language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Save preference
    localStorage.setItem('puzzleGameLanguage', lang);
}

// Change language
function changeLanguage(lang) {
    gameState.language = lang;
    updateLanguage();
}

function changeLevel(level) {
    setLevel(level);
    gameState.solved = 0;
    gameState.moves = 0;
    updateMovesCount();
    startNewPuzzle();
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const optionsMenuButton = document.getElementById('optionsMenuButton');
    const optionsMenu = document.getElementById('optionsMenu');

    function closeOptionsMenu() {
        optionsMenu.classList.remove('open');
        optionsMenuButton.setAttribute('aria-expanded', 'false');
    }

    optionsMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = optionsMenu.classList.toggle('open');
        optionsMenuButton.setAttribute('aria-expanded', String(isOpen));
    });

    optionsMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', () => {
        closeOptionsMenu();
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('puzzleGameTheme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        gameState.theme = savedTheme;
    }
    
    // Load saved language preference
    const savedLang = localStorage.getItem('puzzleGameLanguage');
    if (savedLang && translations[savedLang]) {
        gameState.language = savedLang;
        document.getElementById('languageSelect').value = savedLang;
    }

    // Load saved level preference
    const savedLevel = Number(localStorage.getItem('puzzleGameLevel'));
    setLevel(savedLevel);
    document.getElementById('levelSelect').value = String(gameState.level);

    // Add level selector listener
    document.getElementById('levelSelect').addEventListener('change', (e) => {
        changeLevel(Number(e.target.value));
        closeOptionsMenu();
    });
    
    // Add language selector listener
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
        closeOptionsMenu();
    });

    // Add theme toggle listener
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.checked = gameState.theme === 'dark';
    themeToggle.addEventListener('change', (e) => {
        changeTheme(e.target.checked ? 'dark' : 'light');
        closeOptionsMenu();
    });
    
    // Add reset button listener
    document.getElementById('resetButton').addEventListener('click', resetGame);
    
    // Apply initial language
    updateLanguage();
    updateTheme();
    
    // Start first puzzle
    startNewPuzzle();
});
