const settings = {
  bubbles: {
    count: 30,
    minSpeed: 5,
    maxSpeed: 10,
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

canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = "black";

const ctx = canvas.getContext("2d");

const bubbles = [];

draw();

function draw() {
  cleanCanvas();
  drawBubbles();
  requestAnimationFrame(draw);
}

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

function createBubble() {
  const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  const size = Math.floor(Math.random() * 10) * 3 + 30;
  const x = Math.floor(Math.random() * canvas.width);
  const y = canvas.height + size;
  const { minSpeed, maxSpeed } = settings.bubbles;
  const speed =
    Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + maxSpeed - minSpeed;
  return { x, y, size, speed, ...color };
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
