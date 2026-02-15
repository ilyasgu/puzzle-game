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

// Generate a random target pattern
function generateRandomTarget() {
    const pattern = [];
    const tiles = [];
    
    // Create 8 random tiles (excluding the empty space)
    for (let i = 0; i < 8; i++) {
        tiles.push(TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)]);
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

// Initialize the game
function initGame() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    puzzleGrid.innerHTML = '';
    
    // Create initial grid
    gameState.grid = [
        ['red', 'green', 'num'],
        ['green', 'empty', 'green'],
        ['num', 'red', 'num']
    ];
    
    gameState.emptyPos = { row: 1, col: 1 };
    gameState.moves = 0;
    
    // Render the grid
    renderGrid();
    updateMoveCount();
    updateLevel();
    
    // Add reset button listener
    document.getElementById('resetButton').addEventListener('click', resetGame);
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
    console.log('Tile clicked:', row, col, 'Type:', gameState.grid[row][col]);
    console.log('Empty position:', gameState.emptyPos);
    console.log('Can move?', canMove(row, col));
    
    if (!canMove(row, col)) {
        console.log('Cannot move this tile');
        return;
    }
    
    // Swap with empty space
    const emptyRow = gameState.emptyPos.row;
    const emptyCol = gameState.emptyPos.col;
    
    console.log('Moving tile from', row, col, 'to', emptyRow, emptyCol);
    
    gameState.grid[emptyRow][emptyCol] = gameState.grid[row][col];
    gameState.grid[row][col] = 'empty';
    gameState.emptyPos = { row, col };
    
    gameState.moves++;
    updateMoveCount();
    
    console.log('New grid state:', gameState.grid);
    console.log('New empty position:', gameState.emptyPos);
    
    renderGrid();
    
    // Check if puzzle is solved
    if (checkWin()) {
        gameState.solved++;
        updateSolvedCount();
        setTimeout(() => {
            startNewPuzzle();
        }, 500);
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
                tile.textContent = '3';
            }
            
            targetGrid.appendChild(tile);
        }
    }
}

// Show win message
function showWinMessage() {
    // Removed - endless mode
}

// Go to next level
function nextLevel() {
    // Removed - endless mode
}

// Start a new puzzle
function startNewPuzzle() {
// Start a new puzzle
function startNewPuzzle() {
    gameState.moves = 0;
    updateMoveCount();
    
    // Generate random target pattern
    gameState.targetPattern = generateRandomTarget();
    
    // Set grid to match target
    gameState.grid = gameState.targetPattern.map(row => [...row]);
    
    // Find empty position
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameState.grid[row][col] === 'empty') {
                gameState.emptyPos = { row, col };
            }
        }
    }
    
    // Shuffle the puzzle
    const shuffles = getShuffles();
    shufflePuzzle(shuffles);
    
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

// Reset current level with new target
function resetGame() {
    gameState.moves = 0;
    updateMoveCount();
    
    // Generate new random target pattern
    gameState.targetPattern = generateRandomTarget();
    
    // Set grid to match target
    gameState.grid = gameState.targetPattern.map(row => [...row]);
    
    // Find empty position
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameState.grid[row][col] === 'empty') {
                gameState.emptyPos = { row, col };
            }
        }
    }
    
    // Shuffle the puzzle
    const shuffles = getShuffles();
    shufflePuzzle(shuffles);
    
    // Render both grids
    renderGrid();
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
    startNewPuzzle();
});
