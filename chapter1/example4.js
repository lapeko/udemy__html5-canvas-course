const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.font = "bold 40px Arial";
ctx.fillText("Hello world !", 100, 100);

ctx.fillStyle = "red";
ctx.font = "20px Comic";
for (let i = 0; i < 10; i++) {
  ctx.fillText(`Hello world ${i + 1}`, 100, 200 + i * 40);
}
