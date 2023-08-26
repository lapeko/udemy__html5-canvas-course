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
    columns: 11,
    rows: 6,
    height: 50,
    gap: 20,
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
      if (!brick) return;
      const { x, y, width, height, color } = brick;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = "gray";
      ctx.rect(x, y, width, height);
      ctx.fill();
      ctx.stroke();
    })
  );
}

function handleCollisions() {
  const {
    game: { height: gHeight },
    user: { bottom: uBottom, height: uHeight },
  } = settings;
  let skipping = false;

  if (ball.attached) return;
  // left and right walls
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= settings.game.width)
    ball.angle *= -1;
  // top wall
  else if (ball.y - ball.radius <= 0) ball.angle = 180 - ball.angle;
  // user
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
    // hole
  } else if (ball.y - ball.radius >= gHeight) {
    lives--;
    ball.attached = true;
  } else {
    bricks.forEach((row, i) =>
      row.forEach((brick, j) => {
        if (!brick || skipping) return;
        let nearestBrickX;
        let nearestBrickY;
        if (ball.x < brick.x) nearestBrickX = brick.x;
        else if (ball.x > brick.x + brick.width)
          nearestBrickX = brick.x + brick.width;
        else nearestBrickX = ball.x;
        if (ball.y < brick.y) nearestBrickY = brick.y;
        else if (ball.y > brick.y + brick.height)
          nearestBrickY = brick.y + brick.height;
        else nearestBrickY = ball.y;

        const distance = Math.sqrt(
          (ball.x - nearestBrickX) ** 2 + (ball.y - nearestBrickY) ** 2
        );
        if (distance > ball.radius) return;

        bricks[i][j] = null;
        skipping = true;
        ball.angle =
          nearestBrickY === brick.y + brick.height || nearestBrickY === brick.y
            ? 180 - ball.angle
            : ball.angle * -1;
      })
    );
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
      color: "#" + Math.random().toString(16).substring(2, 8),
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
