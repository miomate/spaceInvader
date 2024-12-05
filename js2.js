const scoreElement = document.querySelector('.score');
const healthElement = document.querySelector('.health');
let resultDisplay = document.querySelector('.score');
const gameArea = document.querySelector('.gameArea'); // HTML element
const width = 15; // Game area dimensions: 15x15 = 255 squares
let aliensRemoved = [];
let alienInvaders; // Declare `alienInvaders` globally
const splashScreenDiv = document.querySelector('.splashScreen');
const gameOverDiv = document.querySelector('.gameOver');
const winScreenDiv = document.querySelector('.winScreen');
let currentShooterIndex = 202; // Spawn position of player
let invadersID;
let isGoingRight = true; // Check if invaders move right
let direction = 1; // Direction of invaders
let results = 0;

const startButton = document.getElementById('startButton').addEventListener('click', screenSwap);
const restartButton = document.getElementById('restartButton').addEventListener('click', screenSwap);

// Initialize the game
function initializeGame() {
  // Reset game variables
  aliensRemoved = [];
  alienInvaders = [1, 2, 3, 34]; // Reset the invaders array
  results = 0;
  currentShooterIndex = 202;

  // Clear the game area
  squares.forEach((square) => {
    square.classList.remove('shooter', 'invader', 'laser', 'boom');
  });

 


  // Redraw the shooter
  squares[currentShooterIndex].classList.add('shooter');
}

// Draw invaders only if they are not removed
function draw() {
    let scoreElement = document.querySelector('h3.score');
    scoreElement.style.display = 'none';
    scoreElement.innerHTML = '';
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }
}

function gameRun() {
    let scoreElement = document.querySelector('h3.score');
    scoreElement.style.display = 'none';
    scoreElement.innerHTML = '';

  initializeGame();
  draw();

  // Player movement
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
      case 'ArrowLeft':
        if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
        break;
      case 'ArrowRight':
        if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
        break;
    }
    squares[currentShooterIndex].classList.add('shooter');
  }
  document.addEventListener('keydown', moveShooter);

  // Remove invaders from current position
  function remove() {
    alienInvaders.forEach((invader) => squares[invader].classList.remove('invader'));
  }

  // Move invaders and check for win/lose conditions
  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    remove();
    if (rightEdge && isGoingRight) {
      for (let i = 0; i < alienInvaders.length; i++) alienInvaders[i] += width + 1;
      direction = -1;
      isGoingRight = false;
    }
    if (leftEdge && !isGoingRight) {
      for (let i = 0; i < alienInvaders.length; i++) alienInvaders[i] += width - 1;
      direction = 1;
      isGoingRight = true;
    }
    for (let i = 0; i < alienInvaders.length; i++) alienInvaders[i] += direction;
    draw();

    // Check for game over
    if (squares[currentShooterIndex].classList.contains('invader')) {
      resultDisplay.innerHTML = 'GAME OVER!';
      clearInterval(invadersID);
    }

    // Check for win
    if (aliensRemoved.length === alienInvaders.length) {
      resultDisplay.innerHTML = 'YOU WON!';
      clearInterval(invadersID);
      splashScreenDiv.style.display = 'flex';
      gameArea.style.display = 'none';
    }
  }

  invadersID = setInterval(moveInvaders, 1000);

  // Shooting logic
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser');
      currentLaserIndex -= width;
      if (squares[currentLaserIndex].classList.contains('invader')) {
        squares[currentLaserIndex].classList.remove('laser', 'invader');
        squares[currentLaserIndex].classList.add('boom');

        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
        clearInterval(laserId);

        const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
        aliensRemoved.push(alienRemoved);
        results++;
        resultDisplay.innerHTML = results;
      }

      if (currentLaserIndex >= 0) squares[currentLaserIndex].classList.add('laser');
      if (currentLaserIndex < 0) clearInterval(laserId);
    }

    if (e.key === 'ArrowUp') {
      laserId = setInterval(moveLaser, 60);
    }
  }

  document.addEventListener('keydown', shoot);
}

function screenSwap() {
  splashScreenDiv.style.display = 'none';
  gameArea.style.display = 'flex';
  gameRun();
}

// Initialize the splash screen on load
splashScreenDiv.style.display = 'flex';
gameArea.style.display = 'none';
