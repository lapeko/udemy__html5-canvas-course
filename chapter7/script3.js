// load image into canvas
const WIDTH = 800;
const HEIGHT = 600;

const canvas = document.createElement("canvas");

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.backgroundColor = "black";
document.body.appendChild(canvas);

const loadButton = document.createElement("button");
loadButton.innerText = "Load new picture";
loadButton.style.display = "block";
document.body.appendChild(loadButton);

const ctx = canvas.getContext("2d");

function loadPictureToCanvas() {
  const img = new Image();

  img.onload = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(img, 0, 0);
  };
  const cacheBooster = Date.now();
  img.src = `https://picsum.photos/${WIDTH}/${HEIGHT}?${cacheBooster}`;

  img.remove();
}

loadButton.addEventListener("click", loadPictureToCanvas);
