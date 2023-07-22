const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";

ctx.moveTo(50, 400);
ctx.lineTo(50, 100);
ctx.lineTo(400, 100);
ctx.closePath();

ctx.stroke();
ctx.fill();

ctx.fillStyle = "green";

ctx.beginPath(0, 0);
ctx.moveTo(400, 100);
ctx.lineTo(400, 400);
ctx.lineTo(50, 400);
ctx.closePath();

ctx.stroke();
ctx.fill();
