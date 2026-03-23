const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let player = {
  x: 400,
  y: 500,
  size: 20,
  speed: 5
};

let bullets = [];
let enemies = [];
let keys = {};
let score = 0;
let gameOver = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

document.addEventListener("click", () => {
  bullets.push({ x: player.x, y: player.y, size: 5, speed: 7 });
});

function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: 0,
    size: 20,
    speed: 2 + Math.random() * 2
  });
}

setInterval(spawnEnemy, 1000);

function update() {
  if (gameOver) return;

  // Movement
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;

  // Bullets
  bullets.forEach(b => b.y -= b.speed);

  // Enemies
  enemies.forEach(e => e.y += e.speed);

  // Collision
  enemies.forEach((e, ei) => {
    bullets.forEach((b, bi) => {
      if (
        Math.abs(e.x - b.x) < e.size &&
        Math.abs(e.y - b.y) < e.size
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });

    // Player collision
    if (
      Math.abs(e.x - player.x) < e.size &&
      Math.abs(e.y - player.y) < e.size
    ) {
      gameOver = true;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.size, b.size);
  });

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);

  if (gameOver) {
    ctx.fillText("GAME OVER", 350, 300);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
