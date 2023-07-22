const ctx = document.getElementById("canvas").getContext("2d");

const gradient = ctx.createLinearGradient(200, 200, 500, 500);

gradient.addColorStop(0, "#ff0000");
gradient.addColorStop(1 / 3, "#00ff00");
gradient.addColorStop(2 / 3, "#0000ff");
gradient.addColorStop(1, "#ff0000");

ctx.fillStyle = gradient;

ctx.fillRect(200, 200, 300, 300);

const gradient2 = ctx.createLinearGradient(50, 0, 50, 640);

gradient2.addColorStop(0, "#ff0000");
gradient2.addColorStop(1 / 3, "#00ff00");
gradient2.addColorStop(2 / 3, "#0000ff");
gradient2.addColorStop(1, "#ff0000");

ctx.strokeStyle = gradient2;

ctx.lineWidth = 20;
ctx.moveTo(50, 0);
ctx.lineTo(50, 640);
ctx.stroke();

const gradient3 = ctx.createRadialGradient(540, 100, 0, 540, 100, 144);
gradient3.addColorStop(0, "#ff0000");
gradient3.addColorStop(1 / 3, "#00ff00");
gradient3.addColorStop(2 / 3, "#0000ff");
gradient3.addColorStop(1, "#ff0000");
ctx.fillStyle = gradient3;
ctx.fillRect(440, 0, 200, 200);
