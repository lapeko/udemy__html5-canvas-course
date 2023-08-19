const settings = {
  bubbles: {
    count: 10,
    minSpeed: 1,
    maxSpeed: 10,
  },
  canvas: {
    width: 640,
    height: 480,
    background: "black",
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

const canvas = document.createElement("canvas");

document.body.appendChild(canvas);

canvas.width = settings.canvas.width;
canvas.height = settings.canvas.height;
canvas.style.backgroundColor = settings.canvas.background;

const ctx = canvas.getContext("2d");

const bubbles = [];
let score = 0;

canvas.addEventListener("click", (event) => {
  const { offsetX: eX, offsetY: eY } = event;
  const index = bubbles.findIndex(
    ({ x, y, size }) => Math.sqrt((x - eX) ** 2 + (y - eY) ** 2) <= size
  );
  if (index === -1) return;
  score++;
  bubbles[index] = createBubble();
});

function draw() {
  cleanCanvas();
  drawBubbles();
  drawScore();
  requestAnimationFrame(draw);
}
draw();

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBubbles() {
  if (
    bubbles.length < settings.bubbles.count &&
    Math.floor(Math.random() * 10) === 0
  )
    bubbles.push(createBubble());
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    bubble.y -= bubble.speed;
    if (bubble.y + bubble.size <= 0) bubbles[i] = createBubble();
    drawBubble(bubble);
  }
}

function drawScore() {
  ctx.beginPath();
  ctx.fillStyle = "purple";
  ctx.font = "bold 24px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
}

function drawBubble({ x, y, size, r, g, b }) {
  ctx.beginPath();
  const gradient = ctx.createRadialGradient(
    x - Math.round(size * 0.1),
    y - Math.round(size * 0.2),
    Math.round(size * 0.7),
    x,
    y,
    size
  );
  gradient.addColorStop(0, `rgba(${r},${g},${b},0.1)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0.5)`);
  ctx.fillStyle = gradient;
  ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function createBubble() {
  const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  const size = Math.floor(Math.random() * 10) * 3 + 30;
  const x = Math.floor(Math.random() * canvas.width);
  const y = canvas.height + size;
  const { minSpeed, maxSpeed } = settings.bubbles;
  const speed =
    Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
  return { x, y, size, speed, ...color };
}
