const canvas = document.createElement("canvas");

canvas.width = 1000;
canvas.height = 600;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const keyboardActiveKeys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  s: false,
  a: false,
  d: false,
};
const userOne = { x: 240, y: 240, width: 20, height: 120, speed: 10 };
const userTwo = { x: 740, y: 240, width: 20, height: 120, speed: 10 };
const users = [userOne, userTwo];

document.addEventListener("keydown", (e) => (keyboardActiveKeys[e.key] = true));
document.addEventListener("keyup", (e) => (keyboardActiveKeys[e.key] = false));

function draw() {
  clear();
  drawText();
  drawUsers();

  requestAnimationFrame(draw);
}
draw();

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawText() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.font = "24px Monospace";
  ctx.fillText("Pos X 50 Y 50", 300, 50);
}

function drawUsers() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(userOne.x, userOne.y, userOne.width, userOne.height);
  if (keyboardActiveKeys.a) userOne.x -= userOne.speed;
  if (keyboardActiveKeys.d) userOne.x += userOne.speed;
  if (keyboardActiveKeys.w) userOne.y -= userOne.speed;
  if (keyboardActiveKeys.s) userOne.y += userOne.speed;

  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.fillRect(userTwo.x, userTwo.y, userTwo.width, userTwo.height);
  if (keyboardActiveKeys.ArrowLeft) userTwo.x -= userTwo.speed;
  if (keyboardActiveKeys.ArrowRight) userTwo.x += userTwo.speed;
  if (keyboardActiveKeys.ArrowUp) userTwo.y -= userTwo.speed;
  if (keyboardActiveKeys.ArrowDown) userTwo.y += userTwo.speed;
}
