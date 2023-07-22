const ctx = document.getElementById("canvas").getContext("2d");

for (let i = 1; i <= 10; i++) {
  ctx.beginPath(50, i * 50);
  ctx.lineWidth = i;
  ctx.moveTo(50, i * 50);
  ctx.lineTo(590, i * 50);
  ctx.stroke();
}

ctx.clearRect(0, 0, 640, 640);

ctx.beginPath(290, 50);
ctx.lineCap = "butt";
ctx.moveTo(290, 50);
ctx.lineTo(290, 590);
ctx.stroke();

ctx.beginPath(320, 50);
ctx.lineCap = "round";
ctx.moveTo(320, 50);
ctx.lineTo(320, 590);
ctx.stroke();

ctx.beginPath(350, 50);
ctx.lineCap = "square"; // butt, round, square, bevel, miter - default
ctx.moveTo(350, 50);
ctx.lineTo(350, 590);
ctx.stroke();

ctx.clearRect(0, 0, 640, 640);

ctx.beginPath(350, 50);
ctx.lineWidth = 20;
ctx.lineCap = "butt";

ctx.moveTo(350, 50);
ctx.lineTo(300, 100);

ctx.moveTo(300, 100);
ctx.lineTo(350, 150);

ctx.moveTo(350, 150);
ctx.lineTo(300, 200);

ctx.moveTo(300, 200);
ctx.lineTo(350, 250);

ctx.moveTo(350, 250);
ctx.lineTo(300, 300);

ctx.moveTo(300, 300);
ctx.lineTo(350, 350);

ctx.moveTo(350, 350);
ctx.lineTo(300, 400);

ctx.moveTo(300, 400);
ctx.lineTo(350, 450);
ctx.stroke();
