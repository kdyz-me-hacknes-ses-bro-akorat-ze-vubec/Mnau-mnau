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

let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
  if (keys["ArrowUp"]) cat.y -= 3;
  if (keys["ArrowDown"]) cat.y += 3;
  if (keys["ArrowLeft"]) cat.x -= 3;
  if (keys["ArrowRight"]) cat.x += 3;

  // Kolize s NPC
  if (Math.abs(cat.x - npc.x) < 40 && Math.abs(cat.y - npc.y) < 40) {
    showMessage(npc.message);
  }

  // Sběr předmětu
  if (Math.abs(cat.x - item.x) < 30 && Math.abs(cat.y - item.y) < 30 && !cat.inventory.includes(item.name)) {
    cat.inventory.push(item.name);
    showMessage("Našla jsi rybičku!");
  }
}

function drawCharacter(char) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x, char.y, char.size, char.size);
}

let message = "";
let messageTimer = 0;

function showMessage(text) {
  message = text;
  messageTimer = 120;
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
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();