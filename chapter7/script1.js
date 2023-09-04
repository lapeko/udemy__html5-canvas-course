const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1024;
const HEIGHT = 768;

canvas.style.backgroundColor = "black";
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

// function draw() {}
// draw();

class MatrixLine {
  static fontSize = 24;
  static color = "green";

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
    ctx.fillStyle = MatrixLine.color;
    ctx.font = "54px Monospace";
    ctx.fillText(this.letters[0], this.x, this.y);
  }
}

const line = new MatrixLine();
line.draw();

function getRandomChar() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}
