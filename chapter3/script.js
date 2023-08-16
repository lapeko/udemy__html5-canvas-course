const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext("2d");

draw();

function draw() {
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.font = "24px Monospace";
  ctx.fillText("Pos X 50 Y 50", 300, 50);

  ctx.beginPath();
  ctx.fillRect(50, 50, 100, 100);

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.moveTo(150, 150);
  ctx.lineTo(150, 250);
  ctx.lineTo(50, 200);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.strokeStyle = "yellow";
  ctx.arc(150, 300, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
}
