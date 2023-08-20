const settings = {
  game: {
    width: 1024,
    height: 768,
    backgroundColor: "black",
  },
  bubbles: {
    count: 20,
    randomFramesToCreateBubble: 5,
    minSpeedY: 1,
    maxSpeedY: 10,
    minRadius: 15,
    maxRadius: 50,
  },
  enemies: {
    count: 2,
    minSpeedY: 2,
    maxSpeedY: 4,
    minRadius: 20,
    maxRadius: 40,
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
  requestAnimationFrame(draw);
};
draw();

function clean() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBubbles() {
  if (
    bubbles.size < settings.bubbles.count &&
    Math.ceil(Math.random() * settings.bubbles.randomFramesToCreateBubble) ===
      settings.bubbles.randomFramesToCreateBubble
  )
    createBubble();
  Array.from(bubbles).forEach((bubble) => {
    bubble.y += bubble.speed;
    if (bubble.y - bubble.radius >= settings.game.height)
      bubbles.delete(bubble);
    else drawBubble(bubble);
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
  const strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
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
