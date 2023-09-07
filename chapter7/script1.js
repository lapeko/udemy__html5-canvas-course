// matrix
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1024;
const HEIGHT = 768;

canvas.style.backgroundColor = "black";
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

const rainbowGradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
rainbowGradient.addColorStop(0, "red");
rainbowGradient.addColorStop(1 / 6, "orange");
rainbowGradient.addColorStop(2 / 6, "yellow");
rainbowGradient.addColorStop(3 / 6, "green");
rainbowGradient.addColorStop(4 / 6, "blue");
rainbowGradient.addColorStop(5 / 6, "indigo");
rainbowGradient.addColorStop(1, "violet");

class MatrixLinesManager {
  static timeout = 1000;
  endTimer;
  matrixLines;

  constructor() {
    this.endTimer = Math.floor(Math.random() * MatrixLinesManager.timeout);
    this.matrixLines = new Set();
  }

  run(timer) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (this.endTimer < timer) this.createMatrixLine(timer);

    Array.from(this.matrixLines).forEach((matrix) => {
      if (matrix.endTimer < timer) this.matrixLines.delete(matrix);
      else matrix.draw(timer);
    });
  }

  createMatrixLine(timer) {
    this.endTimer += Math.floor(Math.random() * MatrixLinesManager.timeout);
    this.matrixLines.add(new MatrixLine(timer));
  }
}

class MatrixLine {
  static font = "32px Monospace";

  startTimer;
  endTimer;
  x;
  y;
  speed;
  letters;
  timeToCreateNextLetter;

  constructor(timer) {
    this.startTimer = timer;
    this.endTimer = timer + Math.floor(Math.random() * 20_000) + 20_000; // from 20 to 40 seconds
    this.x = Math.floor(Math.random() * WIDTH);
    this.y = Math.floor(Math.random() * HEIGHT);
    this.speed = Math.ceil(Math.random() * 9); // from1 to 10
    this.letters = new Array(getRandomChar());
    this.timeToCreateNextLetter = Math.floor(Math.random() * 500) + 500; // from 500ms to 1s
  }

  draw(timer) {
    if (
      timer >
      this.startTimer + this.timeToCreateNextLetter * this.letters.length
    )
      this.letters.push(getRandomChar());
    ctx.fillStyle = rainbowGradient;
    ctx.font = MatrixLine.font;
    this.letters.forEach((letter, index) => {
      const opacity = (20 - Math.min(this.letters.length - index - 1, 20)) / 20;
      ctx.globalAlpha = opacity;
      ctx.fillText(letter, this.x, this.y + 32 * index);
      ctx.globalAlpha = 1;
    });
  }
}

const matrixManager = new MatrixLinesManager();

function draw(timer) {
  matrixManager.run(timer);
  requestAnimationFrame(draw);
}
draw(0);

function getRandomChar() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}
