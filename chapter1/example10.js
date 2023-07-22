const ctx = document.getElementById("canvas").getContext("2d");

ctx.fillStyle = "blue";
ctx.font = "32px Comic";
ctx.fillRect(100, 100, 200, 200);
ctx.fillText("Hello world!", 100, 400);
ctx.save();

ctx.fillStyle = "red";
ctx.fillRect(100, 100, 100, 100);
ctx.font = "16px Arial";
ctx.fillText("Hello 2", 100, 450);

ctx.restore();
ctx.fillText("Hello 3", 100, 500);
ctx.fillRect(300, 450, 100, 100);
