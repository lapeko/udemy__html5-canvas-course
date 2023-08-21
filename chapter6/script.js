// add keyboard movement for user
// add mouse movement for user
// add a ball
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
  },
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = settings.game.width;
canvas.height = settings.game.height;
canvas.style.backgroundColor = "black";

document.body.appendChild(canvas);

let user;

createGame();

const draw = () => {
  drawUser();
};
draw();

function clean() {
  ctx.clearRect(0, 0, settings.game.width, settings.game.height);
}

function drawUser() {
  const { color, x, y, width, height } = user;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = height;
  ctx.lineCap = "round";
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
}

function createGame() {
  const {
    game: { width, height },
    user: { width: uWidth, height: uHeight, bottom, color },
  } = settings;
  user = {
    x: width / 2 - uWidth / 2,
    y: height - bottom - uHeight / 2,
    width: uWidth,
    height: uHeight,
    color,
  };
}
