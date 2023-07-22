const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pos = { x: canvas.width / 2, y: canvas.height / 2, speed: 5 };

ctx.fillStyle = "red";
const animate = () => {
  pos.x += pos.speed;
  if (pos.x > canvas.width) pos.x = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(pos.x, pos.y);
  ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
  ctx.fill();
  window.requestAnimationFrame(animate);
};

animate();
