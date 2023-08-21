// add ball movement
// add collision calculation
// add bricks
// add brick colors
// add brick hit logic (collision + removing + change directions of ball)
// add score logic (you can add random * 50 to every brick)
// draw lives and score
// add pause, game over and restart game
// add bonuses
// add inc and dec ball speed

const settings = {
  game: {
    width: 1024,
    height: 768,
  },
  user: {
    width: 200,
    height: 20,
    bottom: 20,
    color: "white",
    speed: 30,
  },
  ball: {
    color: "yellow",
    radius: 15,
    lowSpeed: 10,
    normalSpeed: 20,
    highSpeed: 30,
  },
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = settings.game.width;
canvas.height = settings.game.height;
canvas.style.backgroundColor = "black";

document.body.appendChild(canvas);

let user, keyboard, ball;

createGame();

const draw = () => {
  clean();
  drawUser();
  drawBall();
  requestAnimationFrame(draw);
};
draw();

function clean() {
  ctx.clearRect(0, 0, settings.game.width, settings.game.height);
}

function drawUser() {
  if (keyboard.a && user.x > 0) user.x -= settings.user.speed;
  if (keyboard.d && user.x + user.width < settings.game.width)
    user.x += settings.user.speed;
  const { color, x, y, width, height } = user;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = height;
  ctx.lineCap = "round";
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
}

function drawBall() {
  const { attached, color, radius } = ball;
  if (attached) {
    ball.x = user.x + user.width / 2;
    ball.y = user.y - radius - user.height / 2;
  }
  const { x, y } = ball;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function createGame() {
  const {
    game: { width, height },
    user: { width: uWidth, height: uHeight, bottom: uBottom, color: uColor },
    ball: {
      radius: bRadius,
      color: bColor,
      lowSpeed: bLowSpeed,
      normalSpeed: bNormalSpeed,
      highSpeed: bHighSpeed,
    },
  } = settings;
  user = {
    x: width / 2 - uWidth / 2,
    y: height - uBottom - uHeight / 2,
    width: uWidth,
    height: uHeight,
    color: uColor,
  };
  keyboard = {
    a: false,
    s: false,
    d: false,
    w: false,
    " ": false,
    Escape: false,
  };
  ball = {
    x: width / 2,
    y: height - uBottom - uHeight - bRadius,
    color: bColor,
    speed: 0,
    attached: true,
    lowSpeed: bLowSpeed,
    normalSpeed: bNormalSpeed,
    highSpeed: bHighSpeed,
    radius: bRadius,
  };
}

document.addEventListener("keydown", (e) => {
  if (e.key in keyboard) keyboard[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key in keyboard) keyboard[e.key] = false;
});
canvas.addEventListener("mousemove", (e) => {
  const x = e.offsetX;
  if (x < user.width / 2) user.x = 0;
  else if (x > settings.game.width - user.width / 2)
    user.x = settings.game.width - user.width;
  else user.x = x - user.width / 2;
});
