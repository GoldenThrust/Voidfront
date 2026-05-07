// ===== CANVAS SETUP =====
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

export const dpr = window.devicePixelRatio ?? 1;

export function resizeCanvas() {
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
}

resizeCanvas();
ctx.scale(dpr, dpr);
