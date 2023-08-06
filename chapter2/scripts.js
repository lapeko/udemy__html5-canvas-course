const canvas = document.createElement("canvas");

canvas.width = 800;
canvas.height = 600;
canvas.style.border = "1px solid black";
const cWidth = canvas.width;
const cHeight = canvas.height;

document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

let users;
let bulletsForUserOne;
let bulletsForUserTwo;
let pauseMode;

const aiBtn1 = document.getElementById("ai1");
const aiBtn2 = document.getElementById("ai2");
const pause = document.getElementById("pause");

const createGame = () => {
  users = [
    {
      x: cWidth / 4,
      y: cHeight / 2,
      speed: 5,
      color: "red",
      size: 30,
      damage: 0,
      ai: false,
    },
    {
      x: (cWidth / 4) * 3,
      y: cHeight / 2,
      speed: 5,
      color: "blue",
      size: 30,
      damage: 0,
      ai: false,
    },
  ];
  bulletsForUserOne = [];
  bulletsForUserTwo = [];
  aiBtn1.style.backgroundColor = "red";
  aiBtn1.style.color = "white";
  aiBtn2.style.backgroundColor = "blue";
  aiBtn2.style.color = "white";
  pause.innerHTML = "&nbsp;&nbsp;pause&nbsp;&nbsp;";
  pause.style.backgroundColor = "gray";
  if (pauseMode) togglePause();
};
createGame();

const userBullets = [
  { size: 5, speed: 10, color: "yellow", limit: 5 },
  { size: 5, speed: -10, color: "green", limit: 5 },
];

const addBullet = (userNumber = 0) => {
  if (pauseMode) return;
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
  if (!users[0].ai && e.key === " ") addBullet();
  if (!users[1].ai && e.key === "Enter") addBullet(1);
});
document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

document.getElementById("restart").addEventListener("click", createGame);
aiBtn1.addEventListener("click", (e) => toggleAI(0, e.target));
aiBtn2.addEventListener("click", (e) => toggleAI(1, e.target));
pause.addEventListener("click", () => togglePause());

const toggleAI = (userIndex, btn) => {
  users[userIndex].ai = !users[userIndex].ai;
  if (users[userIndex].ai) {
    btn.style.backgroundColor = "green";
  } else {
    btn.style.backgroundColor = userIndex ? "blue" : "red";
  }
};

const togglePause = () => {
  pauseMode = !pauseMode;
  if (!pauseMode) draw();
  pause.style.backgroundColor = pauseMode ? "green" : "gray";
  pause.innerHTML = pauseMode ? "continue" : "&nbsp;&nbsp;pause&nbsp;&nbsp;";
};

const moveUsers = () => {
  aiMoveX();
  aiMoveY();
  aiShoot();

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
    ctx.beginPath();
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
    ctx.beginPath();
    ctx.fillStyle = bullet.color;
    ctx.arc((bullet.x += bullet.speed), bullet.y, bullet.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  checkAndHandleHits(users[0], bulletsForUserTwo);
  checkAndHandleHits(users[1], bulletsForUserOne);
};

const checkAndHandleHits = (user, bullets) => {
  if (!bullets.length) return;
  for (let i = 0; i < bullets.length; i++) {
    const dX = Math.pow(bullets[i].x - user.x, 2);
    const dY = Math.pow(bullets[i].y - user.y, 2);
    if (Math.sqrt(dX + dY) > user.size + bullets[i].size) continue;
    user.damage++;
    bullets.splice(i, 1);
  }
};

const drawDelimiter = () => {
  ctx.beginPath();
  ctx.moveTo(cWidth / 2, 0);
  ctx.lineTo(cWidth / 2, cHeight);
  ctx.stroke();
};

const drawScore = () => {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "24px serif";
  ctx.fillText(users[1].damage, 10, 24);
  ctx.fillText(users[0].damage, cWidth / 2 + 10, 24);
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveUsers();
  drawUsers();
  drawBullets();
  drawDelimiter();
  drawScore();
  if (pauseMode) return;
  window.requestAnimationFrame(draw);
}
draw();

function triggerKeyDownEvent(key) {
  let event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(event);

  event = new KeyboardEvent("keyup", {
    key,
    bubbles: true,
    cancelable: true,
  });

  setTimeout(() => document.dispatchEvent(event));
}

aiMoveX.frames = 0;
aiMoveX.directionsX = [Math.round(Math.random()), Math.round(Math.random())];
aiMoveX.numberOfFramesChangeDirection = 10;
function aiMoveX() {
  if (++aiMoveX.frames % aiMoveX.numberOfFramesChangeDirection === 0) {
    aiMoveX.frames = 0;
    aiMoveX.directionsX = [
      Math.round(Math.random()),
      Math.round(Math.random()),
    ];
  }
  users.forEach((user, index) => {
    if (!user.ai) return;
    index
      ? triggerKeyDownEvent(
          aiMoveX.directionsX[index] ? "ArrowLeft" : "ArrowRight"
        )
      : triggerKeyDownEvent(aiMoveX.directionsX[index] ? "a" : "d");
  });
}

aiMoveY.frames = 0;
aiMoveY.directionsY = [Math.round(Math.random()), Math.round(Math.random())];
aiMoveY.numberOfFramesChangeDirection = 10;
function aiMoveY() {
  if (++aiMoveY.frames % aiMoveY.numberOfFramesChangeDirection === 0) {
    aiMoveY.frames = 0;
    aiMoveY.directionsY = [
      Math.round(Math.random()),
      Math.round(Math.random()),
    ];
  }
  users.forEach((user, index) => {
    if (!user.ai) return;
    if (Math.abs(users[0].y - users[1].y) > 200) {
      const isFirstHigher = users[0].y - users[1].y < 0;
      index
        ? (aiMoveY.directionsY[index] = isFirstHigher ? 1 : 0)
        : (aiMoveY.directionsY[index] = isFirstHigher ? 0 : 1);
    }
    index
      ? triggerKeyDownEvent(
          aiMoveY.directionsY[index] ? "ArrowUp" : "ArrowDown"
        )
      : triggerKeyDownEvent(aiMoveY.directionsY[index] ? "w" : "s");
  });
}

aiShoot.frames = 0;
aiShoot.framesPerAction = 10;
function aiShoot() {
  aiShoot.frames++;
  users.forEach((user, index) => {
    if (!user.ai) return;
    if (aiShoot.frames % aiShoot.framesPerAction === 0) addBullet(index);
  });
  if (aiShoot.frames % aiShoot.framesPerAction === 0) aiShoot.frames = 0;
}
