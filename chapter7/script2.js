// add jumping ball (it would be more interesting to create it with gravity)
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1080;
const HEIGHT = 768;
const G = 9.81;

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.backgroundColor = "black";
document.body.appendChild(canvas);

const ball = {
  x: WIDTH / 2,
  y: 50,
  radius: 50,
  speed: -5,
  lastTimer: 0,
  lastSpeed: 0,
  lastY: 0,
  hitFlag: false,
};

const draw = (timer) => {
  clean();
  drawBall();
  calculateBallPosition(timer);
  requestAnimationFrame(draw);
};
draw();

function clean() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function calculateBallPosition(timer = 0) {
  const seconds = timer / 100;

  const deltaTime = seconds - ball.lastTimer;
  ball.lastTimer = seconds;

  if (!ball.hitFlag) {
    ball.lastY = ball.y;
    ball.lastSpeed = ball.speed;
  }

  if (ball.y >= HEIGHT - ball.radius) {
    ball.y = HEIGHT - ball.radius;
    ball.speed *= -1;
    ball.hitFlag = true;
  } else if (ball.hitFlag) {
    ball.y = ball.lastY;
    ball.speed = -ball.lastSpeed + G * deltaTime;
    ball.hitFlag = false;
  }

  ball.y += ball.speed * deltaTime;
  ball.speed += G * deltaTime;
}

function drawBall() {
  const { x, y, radius } = ball;

  const gradient = ctx.createRadialGradient(x, y, radius / 2, x, y, radius);
  gradient.addColorStop(0.8, "white");
  gradient.addColorStop(1, "blue");

  ctx.beginPath();

  ctx.fillStyle = gradient;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
