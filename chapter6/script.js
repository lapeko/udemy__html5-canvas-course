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
    lives: 3,
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
    lowSpeed: 5,
    normalSpeed: 10,
    highSpeed: 15,
  },
  bricks: {
    columns: 8,
    rows: 3,
    height: 50,
    gap: 10,
  },
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = settings.game.width;
canvas.height = settings.game.height;
canvas.style.backgroundColor = "black";

document.body.appendChild(canvas);

let user, keyboard, ball, lives, bricks;

createGame();

const draw = () => {
  clean();
  drawUser();
  drawBall();
  drawBricks();
  handleCollisions();
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
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBall() {
  const { attached, color, radius } = ball;
  if (attached) {
    ball.x = user.x + user.width / 2;
    ball.y = user.y - radius;
  } else {
    ball.x += Math.sin((ball.angle * Math.PI) / 180) * ball.speed;
    ball.y += Math.cos((ball.angle * Math.PI) / 180) * -ball.speed;
  }
  const { x, y } = ball;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawBricks() {
  bricks.forEach((row) =>
    row.forEach((brick) => {
      const { x, y, width, height } = brick;
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, width, height);
    })
  );
}

function handleCollisions() {
  const {
    game: { height: gHeight },
    user: { bottom: uBottom, height: uHeight },
  } = settings;
  if (ball.attached) return;
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= settings.game.width)
    ball.angle *= -1;
  else if (ball.y - ball.radius <= 0) ball.angle = 180 - ball.angle;
  else if (
    ball.y + ball.radius >= gHeight - uBottom - uHeight &&
    ball.y <= gHeight - uBottom - uHeight / 2 &&
    ball.x + ball.radius >= user.x &&
    ball.x - ball.radius <= user.x + user.width
  ) {
    const width = user.width + ball.radius * 2;
    const userCenterX = user.x + user.width / 2;
    const dx = ball.x - userCenterX;
    ball.angle = ((dx * 2) / width) * 45;
  } else if (ball.y - ball.radius >= gHeight) {
    lives--;
    console.log(lives);
    ball.attached = true;
  }
}

function createGame() {
  const {
    game: { width, height, lives: gLives },
    user: { width: uWidth, height: uHeight, bottom: uBottom, color: uColor },
    ball: {
      radius: bRadius,
      color: bColor,
      lowSpeed: bLowSpeed,
      normalSpeed: bNormalSpeed,
      highSpeed: bHighSpeed,
    },
    bricks: {
      rows: brickRows,
      columns: brickColumns,
      gap: brickGap,
      height: brickHeight,
    },
  } = settings;
  lives = gLives;
  user = {
    x: width / 2 - uWidth / 2,
    y: height - uBottom - uHeight,
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
    angle: 0,
    attached: true,
    lowSpeed: bLowSpeed,
    normalSpeed: bNormalSpeed,
    highSpeed: bHighSpeed,
    radius: bRadius,
  };
  const brickWidth = (width - (brickColumns + 1) * brickGap) / brickColumns;
  bricks = new Array(brickRows).fill(null).map((_, rowIndex) =>
    new Array(brickColumns).fill(null).map((_, columnIndex) => ({
      x: (brickWidth + brickGap) * columnIndex + brickGap,
      y: (brickHeight + brickGap) * rowIndex + brickGap,
      width: brickWidth,
      height: brickHeight,
    }))
  );
}

document.addEventListener("keydown", (e) => {
  if (e.key in keyboard) {
    keyboard[e.key] = true;
    if (e.key === " " && ball.attached) {
      ball.attached = false;
      ball.speed = settings.ball.normalSpeed;
    }
  }
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
canvas.addEventListener("click", () => {
  if (!ball.attached) return;
  ball.attached = false;
  ball.speed = settings.ball.normalSpeed;
});
