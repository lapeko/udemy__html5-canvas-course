const canvas = document.createElement("canvas");

const grid = 25;
canvas.width = grid * 30;
canvas.height = grid * 20;
canvas.style.border = "1px solid black";

document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

const center = { x: canvas.width / 2, y: canvas.height / 2 };
const user = { x: center.x, y: center.y, speed: 5 };
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

const moveUser = () => {
  if (keys.ArrowLeft) user.x -= user.speed;
  if (keys.ArrowRight) user.x += user.speed;
  if (keys.ArrowUp) user.y -= user.speed;
  if (keys.ArrowDown) user.y += user.speed;
};

ctx.fillStyle = "red";
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveUser();
  ctx.beginPath(user.x, user.y);
  ctx.arc(user.x, user.y, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  window.requestAnimationFrame(draw);
}
draw();

// function drawFace() {
//   ctx.beginPath(center.x, center.y);
//   ctx.fillStyle = "yellow";
//   ctx.arc(center.x, center.y, 100, 0, Math.PI * 2);
//   ctx.fill();

//   ctx.beginPath(center.x - 50, center.y - 50);
//   ctx.fillStyle = "black";
//   ctx.arc(center.x - 50, center.y - 50, 25, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.beginPath(center.x + 50, center.y - 50);
//   ctx.arc(center.x + 50, center.y - 50, 25, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.beginPath(center.x, center.y);
//   ctx.arc(center.x, center.y, 75, 0, Math.PI);
//   ctx.fill();
// }

// function drawTriangle() {
//   ctx.beginPath(center.x, center.y);
//   ctx.fillStyle = "red";
//   ctx.moveTo(center.x, center.y);
//   ctx.lineTo(center.x - 10 * grid, center.y - 5 * grid);
//   ctx.lineTo(center.x + 10 * grid, center.y - 5 * grid);
//   ctx.closePath();
//   ctx.stroke();
//   ctx.fill();

//   ctx.beginPath(center.x, center.y);
//   ctx.fillStyle = "blue";
//   ctx.rect(center.x - 3, center.y - 3, 6, 6);
//   ctx.rect(center.x - 10 * grid - 3, center.y - 5 * grid - 3, 6, 6);
//   ctx.rect(center.x + 10 * grid - 3, center.y - 5 * grid - 3, 6, 6);
//   ctx.fill();
//   ctx.stroke();
// }

// function drawOld() {
//   ctx.fillRect(50, 50, 100, 50);
//   ctx.strokeRect(200, 50, 100, 50);
// }
