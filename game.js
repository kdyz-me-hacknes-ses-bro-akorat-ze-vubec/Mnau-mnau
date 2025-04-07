const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const cat = {
  x: 100,
  y: 100,
  size: 40,
  color: "#555",
  inventory: [],
};

const npc = {
  x: 400,
  y: 300,
  size: 40,
  color: "#cc9",
  message: "Mňau! Hledáš rybičku?",
};

const item = {
  x: 600,
  y: 150,
  size: 20,
  color: "blue",
  name: "Rybička"
};

const portal = {
  x: 700,
  y: 400,
  size: 50,
  color: "purple",
};

const enemies = [
  { x: 300, y: 200, size: 30, color: "red", speed: 2, direction: 1 },
  { x: 500, y: 100, size: 30, color: "red", speed: 2, direction: -1 },
];

const sword = {
  x: cat.x + 20,
  y: cat.y + 20,
  size: 10,
  color: "silver",
  active: false,
};

let keys = {};
let direction = { x: 0, y: 0 }; // směr pro touch

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// --- Joystick ovládání ---
const joystick = document.getElementById("joystick");
let dragging = false;
let startX, startY;

joystick.addEventListener("touchstart", (e) => {
  dragging = true;
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  sword.active = true; // Activate sword on touch
});

joystick.addEventListener("touchmove", (e) => {
  if (!dragging) return;
  e.preventDefault();
  const touch = e.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  const maxDist = 40;

  direction.x = Math.max(-1, Math.min(1, dx / maxDist));
  direction.y = Math.max(-1, Math.min(1, dy / maxDist));
});

joystick.addEventListener("touchend", () => {
  dragging = false;
  direction = { x: 0, y: 0 };
  sword.active = false; // Deactivate sword on release
});

// --- Aktualizace ---
function update() {
  if (keys["ArrowUp"] || direction.y < -0.5) cat.y -= 3;
  if (keys["ArrowDown"] || direction.y > 0.5) cat.y += 3;
  if (keys["ArrowLeft"] || direction.x < -0.5) cat.x -= 3;
  if (keys["ArrowRight"] || direction.x > 0.5) cat.x += 3;

  // Kolize s NPC
  if (Math.abs(cat.x - npc.x) < 40 && Math.abs(cat.y - npc.y) < 40) {
    showMessage(npc.message);
  }

  // Sběr předmětu
  if (Math.abs(cat.x - item.x) < 30 && Math.abs(cat.y - item.y) < 30 && !cat.inventory.includes(item.name)) {
    cat.inventory.push(item.name);
    showMessage("Našla jsi rybičku!");
  }

  updateEnemies();
  updateSword();
  updatePortal();
}

function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.x += enemy.speed * enemy.direction;
    if (enemy.x < 0 || enemy.x > canvas.width - enemy.size) {
      enemy.direction *= -1;
    }

    // Check collision with cat
    if (Math.abs(cat.x - enemy.x) < 30 && Math.abs(cat.y - enemy.y) < 30) {
      showMessage("Narazila jsi na nepřítele!");
    }

    // Check collision with sword
    if (
      sword.active &&
      Math.abs(sword.x - enemy.x) < 20 &&
      Math.abs(sword.y - enemy.y) < 20
    ) {
      enemies.splice(enemies.indexOf(enemy), 1);
      showMessage("Nepřítel poražen!");
    }
  });
}

function updateSword() {
  sword.x = cat.x + direction.x * 30;
  sword.y = cat.y + direction.y * 30;

  // Ensure sword is visible even when stationary
  if (!sword.active || (direction.x === 0 && direction.y === 0)) {
    sword.x = cat.x + 20;
    sword.y = cat.y + 20;
  }
}

function updatePortal() {
  if (Math.abs(cat.x - portal.x) < 40 && Math.abs(cat.y - portal.y) < 40) {
    showMessage("Vstupuješ do dalšího levelu!");
    // Reset game state or load new level logic here
  }
}

// --- Kreslení ---
function drawCharacter(char) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x, char.y, char.size, char.size);

  // Draw ears and face for the cat
  if (char === cat) {
    ctx.fillStyle = "#000";
    ctx.beginPath(); // Left ear
    ctx.moveTo(char.x + 10, char.y);
    ctx.lineTo(char.x + 20, char.y - 15);
    ctx.lineTo(char.x + 30, char.y);
    ctx.fill();

    ctx.beginPath(); // Right ear
    ctx.moveTo(char.x + 30, char.y);
    ctx.lineTo(char.x + 40, char.y - 15);
    ctx.lineTo(char.x + 50, char.y);
    ctx.fill();

    ctx.fillStyle = "#fff"; // Eyes
    ctx.fillRect(char.x + 12, char.y + 10, 5, 5);
    ctx.fillRect(char.x + 28, char.y + 10, 5, 5);

    ctx.fillStyle = "#000"; // Mouth
    ctx.fillRect(char.x + 20, char.y + 25, 4, 4);
  }
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });
}

function drawPortal() {
  ctx.fillStyle = portal.color;
  ctx.beginPath();
  ctx.arc(portal.x + 25, portal.y + 25, portal.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSword() {
  if (sword.active) {
    ctx.fillStyle = sword.color;
    ctx.fillRect(sword.x, sword.y, sword.size, sword.size);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCharacter(cat);
  drawCharacter(npc);

  if (!cat.inventory.includes(item.name)) {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x + 10, item.y + 10, item.size, 0, Math.PI * 2);
    ctx.fill();
  }

  if (messageTimer > 0) {
    ctx.fillStyle = "#000";
    ctx.font = "20px sans-serif";
    ctx.fillText(message, 20, 40);
    messageTimer--;
  }

  ctx.fillStyle = "#000";
  ctx.font = "16px sans-serif";
  ctx.fillText("Inventář: " + cat.inventory.join(", "), 20, canvas.height - 20);

  drawEnemies();
  drawPortal();
  drawSword();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();