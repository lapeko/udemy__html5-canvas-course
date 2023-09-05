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
  endTimer;
  matrixLines;

  constructor() {
    this.endTimer = Math.floor(Math.random() * 10_000);
    this.matrixLines = new Set();
  }

  run(timer) {
    if (this.endTimer < timer) this.createMatrixLine(timer);

    Array.from(this.matrixLines).forEach((matrix) => {
      if (matrix.endTimer < timer) this.matrixLines.delete(matrix);
      else matrix.draw(timer);
    });
  }

  createMatrixLine(timer) {
    this.endTimer += Math.floor(Math.random() * 10_000);
    this.matrixLines.add(new MatrixLine(timer));
  }
}

class MatrixLine {
  static font = "34px Monospace";

  startTimer;
  endTimer;
  x;
  y;
  speed;
  letters;

  constructor(startTimer) {
    this.endTimer = startTimer + Math.floor(Math.random() * 10_000) + 5_000; // from 5 to 15 seconds
    this.x = Math.floor(Math.random() * WIDTH);
    this.y = Math.floor(Math.random() * HEIGHT);
    this.speed = Math.ceil(Math.random() * 9); // from1 to 10
    const lettersSize = Math.floor(Math.random() * 10) + 10; // from 10 to 20
    this.letters = new Array(lettersSize).fill(getRandomChar());
  }

  draw(timer) {
    ctx.fillStyle = rainbowGradient;
    ctx.font = "54px Monospace";
    ctx.fillText(this.letters[0], this.x, this.y);
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
