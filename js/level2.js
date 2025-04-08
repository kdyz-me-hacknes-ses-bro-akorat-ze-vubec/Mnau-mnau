// Define the canvas and context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Load textures
const heroTexture = new Image();
heroTexture.src = 'assets/tortoiseshell-cat.png'; // Add this texture to your assets folder

const cottageTexture = new Image();
cottageTexture.src = 'assets/cute-cottage.png'; // Add this texture to your assets folder

// Initialize hero and environment
const hero = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
};

const environment = {
  width: canvas.width,
  height: canvas.height,
};

// Render the level
function renderLevel() {
  // Draw the environment
  ctx.drawImage(cottageTexture, 0, 0, environment.width, environment.height);

  // Draw the hero
  ctx.drawImage(heroTexture, hero.x, hero.y, hero.width, hero.height);
}

// Update the game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderLevel();
  requestAnimationFrame(gameLoop);
}

// Start the game loop when textures are loaded
cottageTexture.onload = () => {
  heroTexture.onload = () => {
    gameLoop();
  };
};
