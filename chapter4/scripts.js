const canvas = document.createElement("canvas");

document.body.appendChild(canvas);

canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = "black";

const ctx = canvas.getContext("2d");

draw();

function draw() {
  cleanCanvas();
  drawBubbles(10);
}

function cleanCanvas() {
  ctx.clearRect(0, 0, ctx.width, ctx.height);
}

function drawBubbles(count) {
  const bubbleColors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 255, 255],
    [255, 255, 255],
  ];
  for (let i = 0; i < count; i++) {
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    const size = Math.floor(Math.random() * 10) * 3 + 30;
    const x = Math.floor(Math.random() * canvas.width - size);
    const y = Math.floor(Math.random() * canvas.height - size);
    drawBubble(x, y, size, ...color);
  }
}

function drawBubble(x, y, size, r, g, b) {
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
