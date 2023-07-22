const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

ctx.fillStyle = "yellow";
ctx.arc(320, 320, 200, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

ctx.beginPath(230, 250);
ctx.fillStyle = "black";
ctx.arc(230, 250, 50, 0, 2 * Math.PI);
ctx.arc(410, 250, 50, 0, 2 * Math.PI);
ctx.fill();
