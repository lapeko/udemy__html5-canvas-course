const canvas = document.createElement("canvas");

canvas.width = 800;
canvas.height = 600;
canvas.style.border = "1px solid black";
const cWidth = canvas.width;
const cHeight = canvas.height;

document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

const users = [
  { x: cWidth / 4, y: cHeight / 2, speed: 5, color: "red", size: 30 },
  {
    x: (cWidth / 4) * 3,
    y: cHeight / 2,
    speed: 5,
    color: "blue",
    size: 30,
  },
];

const userBullets = [
  { size: 5, speed: 10, color: "yellow", limit: 5 },
  { size: 5, speed: -10, color: "green", limit: 5 },
];

const bulletsForUserOne = [];
const bulletsForUserTwo = [];
const addBullet = (userNumber = 0) => {
  const i = userNumber;
  const direction = i ? -1 : 1;
  const bullets = i ? bulletsForUserTwo : bulletsForUserOne;
  if (bullets.length >= userBullets[i].limit) return;
  bullets.push({
    x: users[i].x + users[i].size * direction + userBullets[i].size * direction,
    y: users[i].y,
    size: userBullets[i].size,
    speed: userBullets[i].speed,
    color: userBullets[i].color,
  });
};

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  a: false,
  d: false,
  w: false,
  s: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
  if (e.key === " ") addBullet();
  if (e.key === "Enter") addBullet(1);
});
document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

const moveUsers = () => {
  if (keys.a && users[0].x > users[0].size) users[0].x -= users[0].speed;
  if (keys.d && users[0].x < cWidth / 2 - users[0].size)
    users[0].x += users[0].speed;
  if (keys.w && users[0].y > users[0].size) users[0].y -= users[0].speed;
  if (keys.s && users[0].y < cHeight - users[0].size)
    users[0].y += users[0].speed;
  if (keys.ArrowLeft && users[1].x > cWidth / 2 + users[0].size)
    users[1].x -= users[1].speed;
  if (keys.ArrowRight && users[1].x < cWidth - users[1].size)
    users[1].x += users[1].speed;
  if (keys.ArrowUp && users[1].y > users[1].size) users[1].y -= users[1].speed;
  if (keys.ArrowDown && users[1].y < cHeight - users[1].size)
    users[1].y += users[1].speed;
};

const drawUsers = () => {
  users.forEach((user) => {
    ctx.beginPath(user.x, user.y);
    ctx.fillStyle = user.color;
    ctx.arc(user.x, user.y, user.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
};

const drawBullets = () => {
  if (
    bulletsForUserOne.length &&
    bulletsForUserOne[0].x + bulletsForUserOne[0].size >= cWidth
  )
    bulletsForUserOne.shift();
  if (
    bulletsForUserTwo.length &&
    bulletsForUserTwo[0].x - bulletsForUserTwo[0].size <= 0
  )
    bulletsForUserTwo.shift();
  [...bulletsForUserOne, ...bulletsForUserTwo].forEach((bullet) => {
    ctx.beginPath(bullet.x, bullet.y);
    ctx.fillStyle = bullet.color;
    ctx.arc((bullet.x += bullet.speed), bullet.y, bullet.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
};

const drawDelimiter = () => {
  ctx.beginPath(cWidth / 2, 0);
  ctx.moveTo(cWidth / 2, 0);
  ctx.lineTo(cWidth / 2, cHeight);
  ctx.stroke();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveUsers();
  drawUsers();
  drawBullets();
  drawDelimiter();
  window.requestAnimationFrame(draw);
}
draw();
