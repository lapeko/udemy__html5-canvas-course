// add paint like example with (line size and color. Also save and clean buttons)
const WIDTH = 800;
const HEIGHT = 600;

let isDrawing = false;

const canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.border = "1px solid black";
canvas.style.display = "block";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.lineWidth = 1;
ctx.strokeStyle = ctx.fillStyle = "#000000";
ctx.lineCap = "round";
ctx.lineJoin = "round";

const colorInput = document.createElement("input");
colorInput.type = "color";
document.body.appendChild(colorInput);
colorInput.addEventListener("input", (event) => {
  ctx.fillStyle = ctx.strokeStyle = event.target.value;
});

const lineSizeInput = document.createElement("input");
lineSizeInput.type = "range";
lineSizeInput.min = 1;
lineSizeInput.max = 20;
lineSizeInput.value = 1;
document.body.appendChild(lineSizeInput);
lineSizeInput.addEventListener("input", (event) => {
  ctx.lineWidth = event.target.value;
});

canvas.addEventListener("mousedown", ({ offsetX, offsetY }) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.arc(offsetX, offsetY, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
  ctx.stroke();
});
document.addEventListener("mousemove", ({ offsetX, offsetY }) => {
  if (!isDrawing) return;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
});
document.addEventListener("mouseup", () => {
  isDrawing = false;
});
