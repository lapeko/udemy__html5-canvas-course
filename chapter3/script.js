// TODO add a ball
const canvas = document.createElement("canvas");

canvas.width = 1300;
canvas.height = 800;

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
const ballSpeed = 10;
const userSpeed = 10;
const userWidth = 10;
const userHeight = 200;
const userOne = {
  x: 50,
  y: canvas.height / 2 - userHeight / 2,
  width: userWidth,
  height: userHeight,
  speed: userSpeed,
};
const userTwo = {
  x: canvas.width - 50 - userWidth,
  y: canvas.height / 2 - userHeight / 2,
  width: userWidth,
  height: userHeight,
  speed: userSpeed,
};
const users = [userOne, userTwo];
const score = [0, 0];

let ball = createBall();

document.addEventListener("keydown", (e) => (keyboardActiveKeys[e.key] = true));
document.addEventListener("keyup", (e) => (keyboardActiveKeys[e.key] = false));

function draw() {
  clear();
  drawScore();
  drawUsers();
  drawBall();
  checkBallCollision(); // TODO rewrite to work with a ball

  requestAnimationFrame(draw);
}
draw();

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.font = "24px Monospace";
  ctx.textAlign = "center";
  ctx.fillText(`User one: ${score[0]}`, 250, 50);
  ctx.fillStyle = "blue";
  ctx.fillText(`User two: ${score[1]}`, 750, 50);
}

function drawUsers() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(userOne.x, userOne.y, userOne.width, userOne.height);
  if (keyboardActiveKeys.a && userOne.x > 0) userOne.x -= userOne.speed;
  if (keyboardActiveKeys.d && userOne.x + userOne.width < canvas.width)
    userOne.x += userOne.speed;
  if (keyboardActiveKeys.w && userOne.y > 0) userOne.y -= userOne.speed;
  if (keyboardActiveKeys.s && userOne.y + userOne.height < canvas.height)
    userOne.y += userOne.speed;

  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.fillRect(userTwo.x, userTwo.y, userTwo.width, userTwo.height);
  if (keyboardActiveKeys.ArrowLeft && userTwo.x > 0) userTwo.x -= userTwo.speed;
  if (keyboardActiveKeys.ArrowRight && userTwo.x + userOne.width < canvas.width)
    userTwo.x += userTwo.speed;
  if (keyboardActiveKeys.ArrowUp && userTwo.y > 0) userTwo.y -= userTwo.speed;
  if (
    keyboardActiveKeys.ArrowDown &&
    userTwo.y + userOne.height < canvas.height
  )
    userTwo.y += userTwo.speed;
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  const { x, y, radius } = ball;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function checkBallCollision() {
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height)
    ball.speedY *= -1;
  if (
    ball.y + ball.radius >= userOne.y &&
    ball.y - ball.radius <= userOne.y + userOne.height &&
    ball.x + ball.radius >= userOne.x &&
    ball.x - ball.radius <= userOne.x + userOne.width
  )
    ball.speedX = Math.abs(ball.speedX);
  if (
    ball.y + ball.radius >= userTwo.y &&
    ball.y - ball.radius <= userTwo.y + userTwo.height &&
    ball.x + ball.radius >= userTwo.x &&
    ball.x - ball.radius <= userTwo.x + userTwo.width
  )
    ball.speedX = -Math.abs(ball.speedX);
  if (ball.x + ball.radius < 0) {
    ball = createBall();
    score[1]++;
  }
  if (ball.x - ball.radius > canvas.width) {
    ball = createBall();
    score[0]++;
  }
}

function createBall() {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: ballSpeed * (Math.random() >= 0.5 ? -1 : 1),
    speedY: ballSpeed * (Math.random() >= 0.5 ? -1 : 1),
  };
}
