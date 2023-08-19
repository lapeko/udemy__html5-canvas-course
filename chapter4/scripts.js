// TODO add circle mouse catching
const settings = {
  bubbles: {
    count: 10,
    minSize: 20,
    maxSize: 60,
    minSpeedY: 1,
    maxSpeedY: 10,
    minSpeedX: 1,
    maxSpeedX: 5,
    minAngleSpeed: 1,
    maxAngleSpeed: 10,
  },
  canvas: {
    width: 640,
    height: 480,
    background: "black",
  },
};

Math.sin();

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
  const { maxSize, maxSpeedY, maxSpeedX } = settings.bubbles;
  const { size, speedY, speedX } = bubbles[index];

  const sizeScore = maxSize - size;
  const speedYScore = Math.abs(maxSpeedY - speedY * 4);
  const speedXScore = Math.abs(maxSpeedX - speedX * 8);

  score += sizeScore + speedYScore + speedXScore;
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
    bubble.y -= bubble.speedY;
    bubble.degree = (bubble.degree + bubble.angleSpeed) % 360;
    bubble.x += Math.sin((bubble.degree * Math.PI) / 180) * bubble.speedX;
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
  const {
    minSize,
    maxSize,
    minSpeedY,
    maxSpeedY,
    minSpeedX,
    maxSpeedX,
    minAngleSpeed,
    maxAngleSpeed,
  } = settings.bubbles;
  const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  const size = Math.ceil(Math.random() * (maxSize - minSize)) + minSize;
  const x = Math.floor(Math.random() * canvas.width);
  const y = canvas.height + size;
  const speedY = Math.ceil(Math.random() * (maxSpeedY - minSpeedY)) + minSpeedY;
  const speedX = Math.ceil(Math.random() * (maxSpeedX - minSpeedX)) + minSpeedX;
  const angleSpeed =
    Math.ceil(Math.random() * (maxAngleSpeed - minAngleSpeed)) + minAngleSpeed;
  const degree = Math.floor(Math.random() * 360);
  return { x, y, size, speedY, speedX, degree, angleSpeed, ...color };
}
