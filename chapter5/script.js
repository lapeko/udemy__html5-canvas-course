const settings = {
  game: {
    width: 1024,
    height: 768,
    backgroundColor: "black",
  },
  bubbles: {
    count: 8,
    minSpeedY: 2,
    maxSpeedY: 4,
    minRadius: 20,
    maxRadius: 40,
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

createBubble();

const draw = () => {
  clean();
  drawBubbles();
  // requestAnimationFrame(draw);
};
draw();

function clean() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBubbles() {
  console.log(bubbles);
  Array.from(bubbles).forEach((bubble) => {
    drawBubble(bubble);
  });
}

function createBubble() {
  const radius =
    Math.ceil(
      Math.random() * (settings.bubbles.maxRadius - settings.bubbles.minRadius)
    ) + settings.bubbles.minRadius;
  const x =
    Math.floor(Math.random() * settings.game.width - radius * 2) + radius;
  const y = radius * 5; //TODO -radius;
  const gradient = ctx.createRadialGradient(
    x - radius * 0.1,
    y - radius * 0.2,
    radius / 2,
    x,
    y,
    radius
  );
  const { r, g, b } =
    bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.5)`);
  const strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
  bubbles.add({ x, y, radius, gradient, strokeStyle });
}

function drawBubble({ x, y, radius, gradient, strokeStyle }) {
  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.strokeStyle = strokeStyle;
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
