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
  speed: 0,
  lastTimer: 0,
  lastSpeed: 0,
  lastY: 0,
  hit: false,
  nextAfterHit: false,
  elasticity: 0.9,
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
  const seconds = timer / 50;

  const deltaTime = seconds - ball.lastTimer;
  ball.lastTimer = seconds;

  ball.hit = ball.y > HEIGHT - ball.radius;

  if (!ball.hit) {
    ball.lastSpeed = ball.speed;
    ball.lastY = ball.y;
  } else {
    ball.y = HEIGHT - ball.radius;
    ball.nextAfterHit = true;
  }
  if (!ball.hitFlag && ball.nextAfterHit) {
    ball.speed = -ball.lastSpeed * ball.elasticity - G * deltaTime;
    ball.y = ball.lastY;
    ball.nextAfterHit = false;
  }
  ball.speed += G * deltaTime;
  ball.y += ball.speed * deltaTime;
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
