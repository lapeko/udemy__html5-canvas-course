const ctx = document.getElementById("canvas").getContext("2d");

const image = new Image();
image.onload = () => {
  ctx.drawImage(image, 0, 0, 900, 600, 0, 0, 300, 200);
  1 / 3;
  0.333;
  ctx.drawImage(image, 165, 0, 600, 600, 0, 200, 500, 500);
  5 / 6;
  1.2;
  ctx.strokeStyle = "red";
  const scale = (5 / 6) * 3;
  ctx.strokeRect(((165 / scale) * 5) / 6, 0, 500 / scale, 500 / scale);
};
image.src =
  "https://w7.pngwing.com/pngs/808/751/png-transparent-logo-blog-letter-d-miscellaneous-text-trademark.png";
