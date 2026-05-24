// ===== CANVAS SETUP =====
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

export const dpr = window.devicePixelRatio ?? 1;

export function resizeCanvas(scale = 1) {
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(dpr * scale, dpr * scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
}

resizeCanvas();

ctx.beginPath();