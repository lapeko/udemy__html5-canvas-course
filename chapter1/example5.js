const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.arc(320, 150, 100, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

ctx.beginPath(320, 25);
ctx.fillStyle = "blue";
ctx.moveTo(320, 25);
ctx.lineTo(420, 75);
ctx.lineTo(220, 75);
ctx.closePath();
ctx.fill();
ctx.stroke();

ctx.beginPath(320, 25);
ctx.fillStyle = "black";
ctx.arc(270, 125, 25, 0, 2 * Math.PI);
ctx.arc(370, 125, 25, 0, 2 * Math.PI);
ctx.fill();

ctx.beginPath(320, 175);
ctx.arc(320, 175, 50, 2 * Math.PI, Math.PI);
ctx.fill();

ctx.moveTo(320, 150);
ctx.lineTo(320, 165);

ctx.moveTo(320, 250);
ctx.lineTo(320, 400);
ctx.lineTo(220, 500);
ctx.moveTo(320, 400);
ctx.lineTo(420, 500);

ctx.moveTo(220, 300);
ctx.lineTo(420, 300);

ctx.stroke();
