// import { ctx } from "../core/canvas.js";

function circleCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = dx * dx + dy * dy;
  const sizeSq = a.r * a.r + b.r * b.r

  return dist < sizeSq;
}

function boxCollision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function boxCircleCollision(box, circle) {
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.w));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.h));

  // ctx.fillStyle = "gold";
  // ctx.beginPath();
  // ctx.arc(closestX, closestY, 5, 0, Math.PI * 2)
  // ctx.fill();

  const dx = circle.x - closestX;
  const dy = circle.y - closestY;

  return (dx * dx + dy * dy) < (circle.r * circle.r);
}

export function checkCollision(a, b) {
  if (a.shape === "box" && b.shape === "box") {
    return boxCollision(a, b);
  }

  if (a.shape === "circle" && b.shape === "circle") {
    return circleCollision(a, b);
  }

  if (a.shape === "box" && b.shape === "circle") {
    return boxCircleCollision(a, b);
  }

  if (a.shape === "circle" && b.shape === "box") {
    return boxCircleCollision(b, a);
  }

  return false;
}