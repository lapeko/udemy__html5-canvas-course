// add inc and dec ball speed

const settings = {
  game: {
    width: 1024,
    height: 768,
    lives: 3,
    percentOfBonus: 7,
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
    columns: 10,
    rows: 6,
    height: 50,
    gap: 30,
  },
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = settings.game.width;
canvas.height = settings.game.height;
canvas.style.backgroundColor = "black";

document.body.appendChild(canvas);

let user,
  keyboard,
  ball,
  lives,
  bricks,
  lowestBrickY,
  score,
  pause,
  gameOver,
  bonuses;

createGame();

function draw() {
  clean();
  drawUser();
  drawBall();
  drawBricks();
  drawBonuses();
  handleCollisions();
  drawGameInfo();
  if (gameOver || pause) return;
  requestAnimationFrame(draw);
}

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

function drawBonuses() {
  Array.from(bonuses).forEach((bonus) => {
    const { x, y, value } = bonus;
    bonus.y += 5;
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "bold 24px monospace";
    ctx.fillText(`${value}X`, x, y);
  });
}

function handleCollisions() {
  const {
    game: { height: gHeight },
    user: { bottom: uBottom, height: uHeight },
  } = settings;
  let skipFrames = false;

  // bonuses
  Array.from(bonuses).forEach((bonus) => {
    if (bonus.y - 24 > gHeight) {
      console.log(); // TODO remove it and these brackets
      bonuses.delete(bonus);
    } else if (
      bonus.y + 12 >= gHeight - uBottom - uHeight &&
      bonus.y - 12 <= gHeight - uBottom &&
      bonus.x + 12 >= user.x &&
      bonus.x - 12 <= user.x + user.width
    ) {
      score *= bonus.value;
      bonuses.delete(bonus);
    }
  });

  if (ball.attached) return;

  // left wall
  if (ball.x - ball.radius <= 0 && ball.angle > 180)
    ball.angle = 360 - ball.angle;

  // right wall
  if (ball.x + ball.radius >= settings.game.width && ball.angle < 180)
    ball.angle = 360 - ball.angle;

  // top wall
  if (ball.y - ball.radius <= 0 && (ball.angle < 90 || ball.angle > 270))
    ball.angle = (540 - ball.angle) % 360;

  // user
  if (
    ball.y + ball.radius >= gHeight - uBottom - uHeight &&
    ball.y <= gHeight - uBottom - uHeight / 2 &&
    ball.x + ball.radius >= user.x &&
    ball.x - ball.radius <= user.x + user.width
  ) {
    const width = user.width + ball.radius * 2;
    const userCenterX = user.x + user.width / 2;
    const dx = ball.x - userCenterX;
    ball.angle = (360 + ((dx * 2) / width) * 45) % 360;
    if (keyboard.w) ball.speed = settings.ball.highSpeed;
    else if (keyboard.s) ball.speed = settings.ball.lowSpeed;
  }

  // hole
  if (ball.y - ball.radius >= gHeight) {
    lives--;
    if (!lives) gameOver = true;
    ball.attached = true;
  }

  // bricks
  if (ball.y - ball.radius <= lowestBrickY)
    bricks.forEach((row, i) =>
      row.forEach((brick, j) => {
        if (!brick) return;
        if (skipFrames) return;
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

        skipFrames = true;
        score += brick.score;
        if (brick.hasBonus)
          bonuses.add({
            x: brick.x + brick.width / 2,
            y: brick.y + brick.height / 2,
            value: Math.ceil(Math.random() * 4) + 1,
          });
        bricks[i][j] = null;

        // corners hits
        if (
          (nearestBrickX === brick.x ||
            nearestBrickX === brick.x + brick.width) &&
          (nearestBrickY === brick.y ||
            nearestBrickY === brick.y + brick.height)
        ) {
          // top right ball direction
          if (ball.angle >= 0 && ball.angle < 90) {
            if (
              nearestBrickX === brick.x &&
              nearestBrickY === brick.y + brick.height
            )
              ball.reverse();
            else if (nearestBrickX === brick.x) ball.reverseX();
            else ball.reverseY();
          }
          // bottom right ball direction
          else if (ball.angle >= 90 && ball.angle < 180) {
            if (nearestBrickX === brick.x && nearestBrickY === brick.y)
              ball.reverse();
            else if (nearestBrickX === brick.x) ball.reverseX();
            else ball.reverseY();
          }
          // bottom left ball direction
          else if (ball.angle >= 180 && ball.angle < 270) {
            if (
              nearestBrickX === brick.x + brick.width &&
              nearestBrickY === brick.y
            )
              ball.reverse();
            else if (nearestBrickX === brick.x + ball.width) ball.reverseX();
            else ball.reverseY();
          }
          // top left ball direction
          else if (ball.angle >= 270 && ball.angle < 360) {
            if (
              nearestBrickX === brick.x + brick.width &&
              nearestBrickY === brick.y + brick.height
            )
              ball.reverse();
            else if (nearestBrickX === brick.x + brick.width) ball.reverseX();
            else ball.reverseY();
          }
        }
        // side hits
        else if (
          nearestBrickY === brick.y ||
          nearestBrickY === brick.y + brick.height
        )
          ball.reverseY();
        else if (ball.angle % 180) ball.reverseX();
        else ball.reverseY();

        const lowestRow = bricks
          .filter((row) => row.some((brick) => !!brick))
          .at(-1);
        if (!lowestRow) gameOver = true;
        else lowestBrickY = lowestRow.find((brick) => !!brick).y + brick.height;
      })
    );
}

function drawGameInfo() {
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = "bold 24px monospace";
  ctx.fillText(`Score: ${score}`, 20, 20);

  ctx.textAlign = "right";
  ctx.fillText(`Lives: ${lives}`, settings.game.width - 20, 20);

  // game over
  if (gameOver) {
    clean();
    const { width, height } = settings.game;
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.font = "bold 36px monospace";
    ctx.textBaseline = "bottom";
    ctx.fillText("Game over", width / 2, height / 2 - 36);
    ctx.fillText(`Your score: ${score}`, width / 2, height / 2);
    const btnParams = [width / 2 - 72, height / 2 + 18, 144, 54];
    ctx.fillRect(...btnParams);
    ctx.fillStyle = "black";
    ctx.font = "bold 24px monospace";
    ctx.fillText("Restart", width / 2, height / 2 + 54);
    createRestartBtnEventHandlers(btnParams);
  }

  // pause
  else if (pause) {
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 36px monospace";
    ctx.fillText("Pause", settings.game.width / 2, settings.game.height / 2);
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
    reverseX: function () {
      this.angle = (360 - this.angle) % 360;
    },
    reverseY: function () {
      this.angle = (540 - this.angle) % 360;
    },
    reverse: function () {
      this.angle = (this.angle + 180) % 360;
    },
  };
  const brickWidth = (width - (brickColumns + 1) * brickGap) / brickColumns;
  bricks = new Array(brickRows).fill(null).map((_, rowIndex) =>
    new Array(brickColumns).fill(null).map((_, columnIndex) => ({
      x: (brickWidth + brickGap) * columnIndex + brickGap,
      y: (brickHeight + brickGap) * rowIndex + brickGap,
      width: brickWidth,
      height: brickHeight,
      color: "#" + Math.random().toString(16).substring(2, 8),
      score: Math.ceil(Math.random() * 49),
      hasBonus: !Math.floor(
        Math.random() * (100 / settings.game.percentOfBonus)
      ),
    }))
  );
  lowestBrickY = brickRows * (brickHeight + brickGap);
  score = 0;
  pause = false;
  gameOver = false;
  bonuses = new Set();

  draw();
}

const createRestartBtnEventHandlers = ([x, y, width, height]) => {
  const mouseMoveHandler = (event) => {
    const { offsetX, offsetY } = event;

    const outsideBtn =
      offsetX < x || offsetX > x + width || offsetY < y || offsetY > y + height;

    document.body.style.cursor = outsideBtn ? "auto" : "pointer";
  };
  const clickHandler = (event) => {
    const { offsetX, offsetY } = event;
    if (
      offsetX < x ||
      offsetX > x + width ||
      offsetY < y ||
      offsetY > y + height
    )
      return;
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.body.style.cursor = "auto";
    createGame();
  };
  document.addEventListener("click", clickHandler);
  document.addEventListener("mousemove", mouseMoveHandler);
};

document.addEventListener("keydown", (e) => {
  if (e.key in keyboard === false) return;
  keyboard[e.key] = true;
  if (e.key === " " && ball.attached) {
    ball.attached = false;
    ball.speed = settings.ball.normalSpeed;
  }
  if (e.key === "Escape") {
    pause = !pause;
    !pause && draw();
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
