const settings = {
  game: {
    width: 1024,
    height: 768,
    backgroundColor: "black",
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
    count: 5,
    randomFramesToCreate: 50,
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

const game = { pause: false, gameOver: false };
const enemies = new Set();
const bubbles = new Set();
const gameKeys = { a: false, d: false };

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
  requestAnimationFrame(draw);
};
draw();

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
  if (e.key === " ") game.pause = !game.pause;
});

document.addEventListener("keyup", (e) => {
  if (Object.keys(gameKeys).includes(e.key)) gameKeys[e.key] = false;
});
