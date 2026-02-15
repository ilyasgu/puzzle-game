// Game state
let gameState = {
    grid: [],
    emptyPos: { row: 1, col: 1 }, // Center position
    moves: 0,
    solved: 0,
    targetPattern: []
};

// Tile types
const TILE_TYPES = ['red', 'green', 'num'];

// Generate a random target pattern with fixed tile types
function generateRandomTarget() {
    const pattern = [];
    const tiles = [
        'green', 'green', 'green',
        'num', 'num', 'num',
        'red', 'red'
    ];
    
    // Shuffle tiles array
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    // Randomly place the empty space
    const emptyIndex = Math.floor(Math.random() * 9);
    
    // Build the 3x3 pattern
    let tileIndex = 0;
    for (let row = 0; row < 3; row++) {
        pattern[row] = [];
        for (let col = 0; col < 3; col++) {
            const currentIndex = row * 3 + col;
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
    puzzleGrid.innerHTML = '';
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
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
    updateMoveCount();
    
    renderGrid();
    
    // Check if puzzle is solved
    if (checkWin()) {
        gameState.solved++;
        updateSolvedCount();
        showSolvedInStatusBar();
        setTimeout(() => {
            // Generate new target but keep current tile positions
            gameState.targetPattern = generateRandomTarget();
            renderTargetGrid();
            gameState.moves = 0;
            updateMoveCount();
        }, 1500);
    }
}

// Check if puzzle matches target pattern
function checkWin() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
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
    targetGrid.innerHTML = '';
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
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
    
    statusBar.innerHTML = '<div class="solved-status">🎉 Solved! 🎉</div>';
    statusBar.classList.add('solved-highlight');
    
    setTimeout(() => {
        statusBar.innerHTML = originalHTML;
        statusBar.classList.remove('solved-highlight');
    }, 5000);
}

// Go to next level
function nextLevel() {
    // Removed - endless mode
}

// Start a new puzzle
function startNewPuzzle() {
    gameState.moves = 0;
    updateMoveCount();
    
    // Generate random target pattern
    gameState.targetPattern = generateRandomTarget();
    
    // Create initial grid with fixed tile types
    const tiles = [
        'green', 'green', 'green',
        'num', 'num', 'num',
        'red', 'red'
    ];
    
    // Shuffle tiles
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    // Place tiles and empty space
    const emptyIndex = Math.floor(Math.random() * 9);
    let tileIndex = 0;
    gameState.grid = [];
    
    for (let row = 0; row < 3; row++) {
        gameState.grid[row] = [];
        for (let col = 0; col < 3; col++) {
            const currentIndex = row * 3 + col;
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
    renderGrid();
    renderTargetGrid();
}

// Shuffle puzzle by making random valid moves
function shufflePuzzle(moves) {
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
            
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
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
    gameState.moves = 0;
    updateMoveCount();
    
    // Generate new random target pattern
    gameState.targetPattern = generateRandomTarget();
    
    // Only render the target grid, keep board unchanged
    renderTargetGrid();
}

// Update move counter
function updateMoveCount() {
    document.getElementById('moveCount').textContent = gameState.moves;
}

// Update solved counter
function updateSolvedCount() {
    document.getElementById('solvedCount').textContent = gameState.solved;
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Add reset button listener
    document.getElementById('resetButton').addEventListener('click', resetGame);
    
    // Start first puzzle
    startNewPuzzle();
});
