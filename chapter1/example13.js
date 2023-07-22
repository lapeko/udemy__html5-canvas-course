const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let angRoot = 0;

const image = new Image();

image.onload = () => {
  const img = image;

  ctx.beginPath(img.width / 2, img.height / 2);
  ctx.moveTo(img.width / 2, img.height / 2);
  ctx.lineTo(img.width / 2, 0);
  ctx.stroke();

  setInterval(() => {
    ctx.save();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate((Math.PI / 180) * (angRoot += 5));
    ctx.drawImage(image, -img.width / 2, -img.height / 2);

    ctx.beginPath(0, -img.height / 2);
    ctx.moveTo(0, -img.height / 2);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.restore();
  }, 1000);
};

image.src =
  "https://w7.pngwing.com/pngs/808/751/png-transparent-logo-blog-letter-d-miscellaneous-text-trademark.png";
