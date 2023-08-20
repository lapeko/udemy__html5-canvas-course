const settings = {
  game: {
    lives: 3,
    width: 1024,
    height: 768,
    backgroundColor: "black",
  },
  player: {
    width: 120,
    height: 10,
    bottom: 10,
    color: "white",
    speed: 20,
  },
  bubbles: {
    count: 20,
    randomFramesToCreate: 5,
    minSpeedY: 1,
    maxSpeedY: 10,
    minRadius: 10,
    maxRadius: 30,
  },
  enemies: {
    count: 10,
    randomFramesToCreate: 15,
    minSpeedY: 5,
    maxSpeedY: 15,
    radius: 20,
    colorChangeSpeed: 5,
  },
};

const bubbleColors = [
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 0, b: 255 },
  { r: 255, g: 255, b: 0 },
  { r: 255, g: 0, b: 255 },
  { r: 0, g: 255, b: 255 },
  { r: 255, g: 255, b: 255 },
];

let game, enemies, bubbles, player, lives, gameKeys;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = settings.game.width;
canvas.height = settings.game.height;
canvas.style.backgroundColor = settings.game.backgroundColor;
document.body.appendChild(canvas);

const draw = () => {
  clean();
  drawBubbles();
  drawEnemies();
  drawPlayer();
  checkCollisions();
  drawStatistics();
  if (game.gameOver) drawGameOver();
  if (game.pause) drawPause();
  if (!game.gameOver && !game.pause) requestAnimationFrame(draw);
};
createGame();

function createGame() {
  game = { pause: false, gameOver: false };
  enemies = new Set();
  bubbles = new Set();
  player = {
    x: settings.game.width / 2 - settings.player.width / 2,
    y: settings.game.height - settings.player.height - settings.player.bottom,
    width: settings.player.width,
    height: settings.player.height,
  };
  score = 0;
  lives = settings.game.lives;
  gameKeys = { a: false, d: false };
  draw();
}

function clean() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBubbles() {
  if (
    bubbles.size < settings.bubbles.count &&
    Math.ceil(Math.random() * settings.bubbles.randomFramesToCreate) ===
      settings.bubbles.randomFramesToCreate
  )
    createBubble();
  Array.from(bubbles).forEach((bubble) => {
    bubble.y += bubble.speed;
    if (bubble.y - bubble.radius >= settings.game.height)
      bubbles.delete(bubble);
    else drawBubble(bubble);
  });
}

function drawEnemies() {
  if (
    enemies.size < settings.enemies.count &&
    Math.ceil(Math.random() * settings.enemies.randomFramesToCreate) ===
      settings.enemies.randomFramesToCreate
  )
    createEnemy();
  Array.from(enemies).forEach((enemy) => {
    if (enemy.y - settings.enemies.radius >= settings.game.height)
      return enemies.delete(enemy);
    enemy.y += enemy.speed;
    enemy.angle += settings.enemies.colorChangeSpeed % 360;
    enemy.colorIntensity =
      Math.abs(Math.sin((enemy.angle * Math.PI) / 180)) * 0.5 + 0.5;
    drawEnemy(enemy);
  });
}

function drawPlayer() {
  const { color, speed } = settings.player;
  if (gameKeys.a && player.x > 0) player.x -= speed;
  if (gameKeys.d && player.x + player.width < settings.game.width)
    player.x += speed;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function checkCollisions() {
  const { x, y, width: w, height: h } = player;
  const { radius } = settings.enemies;
  Array.from(enemies).forEach((e) => {
    if (!checkCollisionBetweenCircleAndRect(e.x, e.y, radius, x, y, w, h))
      return;
    enemies.delete(e);
    if (!--lives) game.gameOver = true;
  });
  Array.from(bubbles).forEach((b) => {
    const { x, y, width: w, height: h } = player;
    if (!checkCollisionBetweenCircleAndRect(b.x, b.y, b.radius, x, y, w, h))
      return;
    bubbles.delete(b);
    score += b.radius;
  });
}

function drawStatistics() {
  const { width } = settings.game;
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.font = "bold 24px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`lives: ${lives}`, 50, 50);
  ctx.textAlign = "right";
  ctx.fillText(`score: ${score}`, width - 50, 50);
}

function drawGameOver() {
  const { width, height } = settings.game;
  clean();
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.font = "bold 36px monospace";
  ctx.fillText("Game over", width / 2, height / 2 - 36);
  ctx.fillText(`Your score: ${score}`, width / 2, height / 2);
  const btnParams = [width / 2 - 72, height / 2 + 18, 144, 54];
  ctx.fillRect(...btnParams);
  ctx.fillStyle = "black";
  ctx.font = "bold 24px monospace";
  ctx.fillText("Restart", width / 2, height / 2 + 54);
  createRestartBtnEventHandlers(btnParams);
}

function drawPause() {
  const { width, height } = settings.game;
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.font = "bold 36px monospace";
  ctx.fillText("Pause", width / 2, height / 2);
}

function createBubble() {
  const { maxRadius, minRadius, minSpeedY, maxSpeedY } = settings.bubbles;
  const radius = Math.ceil(Math.random() * (maxRadius - minRadius)) + minRadius;
  const x =
    Math.floor(Math.random() * (settings.game.width - radius * 2)) + radius;
  const y = -radius;
  const speed = Math.ceil(Math.random() * (maxSpeedY - minSpeedY)) + minSpeedY;
  const rgb = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  bubbles.add({ x, y, radius, speed, ...rgb });
}

function createEnemy() {
  const { radius, minSpeedY, maxSpeedY } = settings.enemies;
  const x = Math.floor(Math.random() * (settings.game.width - radius)) + radius;
  const y = -radius;
  const speed = Math.ceil(Math.random() * (maxSpeedY - minSpeedY)) + minSpeedY;
  enemies.add({ x, y, colorIntensity: 1, speed, angle: 0 });
}

function drawBubble({ x, y, radius, r, g, b }) {
  ctx.beginPath();
  const gradient = ctx.createRadialGradient(
    x - radius * 0.1,
    y - radius * 0.2,
    radius / 2,
    x,
    y,
    radius
  );
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.5)`);
  ctx.fillStyle = gradient;
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawEnemy({ x, y, colorIntensity }) {
  ctx.beginPath();
  const radius = settings.enemies.radius;
  const gradient = ctx.createRadialGradient(
    x - radius * 0.1,
    y - radius * 0.2,
    0,
    x,
    y,
    radius
  );
  gradient.addColorStop(
    0,
    `rgb(${255 * colorIntensity}, ${127 * colorIntensity}, ${
      127 * colorIntensity
    })`
  );
  gradient.addColorStop(
    1,
    `rgb(${127 * colorIntensity}, ${31 * colorIntensity}, ${
      31 * colorIntensity
    })`
  );
  ctx.fillStyle = gradient;
  ctx.strokeStyle = `rgb(${191 * colorIntensity}, ${63 * colorIntensity}, ${
    63 * colorIntensity
  })`;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

document.addEventListener("keydown", (e) => {
  if (Object.keys(gameKeys).includes(e.key)) gameKeys[e.key] = true;
  if (e.key !== " ") return;
  if (!game.pause) return (game.pause = true);
  game.pause = false;
  draw();
});

document.addEventListener("keyup", (e) => {
  if (Object.keys(gameKeys).includes(e.key)) gameKeys[e.key] = false;
});

function checkCollisionBetweenCircleAndRect(
  x1,
  y1,
  radius,
  x2,
  y2,
  width,
  height
) {
  if (x1 + radius < x2) return false;
  if (x1 - radius > x2 + width) return false;
  if (y1 + radius < y2) return false;
  if (y1 - radius > y2 + height) return false;

  const nearestRectDot = {};

  if (x1 < x2) nearestRectDot.x = x2;
  else if (x1 > x2 + width) nearestRectDot.x = x2 + width;
  else nearestRectDot.x = x1;

  if (y1 < y2) nearestRectDot.y = y2;
  else if (y1 > y2 + height) nearestRectDot.y = y2 + height;
  else nearestRectDot.y = y1;

  const distance = Math.sqrt(
    (x1 - nearestRectDot.x) ** 2 + (y1 - nearestRectDot.y) ** 2
  );

  return distance < settings.enemies.radius;
}

const createRestartBtnEventHandlers = ([x, y, width, height]) => {
  const mouseMoveHandler = (event) => {
    const { offsetX, offsetY } = event;

    const outsideBtn =
      offsetX < x || offsetX > x + width || offsetY < y || offsetY > y + height;

    document.body.style.cursor = outsideBtn ? "auto" : "pointer";
  };
  const clickHandler = (event) => {
    const { offsetX, offsetY } = event;
    if (
      offsetX < x ||
      offsetX > x + width ||
      offsetY < y ||
      offsetY > y + height
    )
      return;
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.body.style.cursor = "auto";
    createGame();
  };
  document.addEventListener("click", clickHandler);
  document.addEventListener("mousemove", mouseMoveHandler);
};
