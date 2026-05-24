import { world } from "./world.js";
import { canvas, canvasWidth, ctx } from "./canvas.js";

export function wrap(value, size) {
    return ((value % size) + size) % size;
}

export function toroidalDelta(a, b, size) {
    let d = (b - a) % size;
    if (d > size * 0.5) d -= size;

    if (d < -size * 0.5) d += size;

    return d;
}

export function toroidalDistance(x1, y1, x2, y2, space = world) {
    const dx = toroidalDelta(x1, x2, space.width);
    const dy = toroidalDelta(y1, y2, space.height);

    return dx * dx + dy * dy;
}

export function toroidalAngle(x1, y1, x2, y2, space = world) {
    const dx = toroidalDelta(x1, x2, space.width);
    const dy = toroidalDelta(y1, y2, space.height);

    return Math.atan2(dy, dx);
}

export function worldToScreen(wx, wy, space = world) {
    const dx = toroidalDelta(space.x, wx, space.width);
    const dy = toroidalDelta(space.y, wy, space.height);

    return {
        x: dx + space.width / 2,
        y: dy + space.height / 2
    }
}

export function drawWrapped({ fn, x, y, margin = { width: 0, height: 0 }, space = world, screen = canvas, wCtx = ctx }) {
    updateWrapped({
        fn: (sx, sy) => {
            wCtx.save()
            wCtx.translate(sx, sy);
            fn(sx, sy);
            wCtx.restore();
        }, x, y, space, screen, margin
    })

}


export function updateWrapped({ fn, x, y, margin = { width: 0, height: 0 }, space = world, screen = canvas }) {
    const base = worldToScreen(x, y, space); // also: pass space here!

    const ox = 0, oy = 0;

    // for (let ox = -1; ox <= 1; ox++) {
    //     for (let oy = -1; oy <= 1; oy++) {
    const sx = base.x + ox * space.width;
    const sy = base.y + oy * space.height;

    if (inScreen({ x: sx, y: sy, space, screen, margin })) {
        fn(sx, sy);
    }
}
//     }
// }

export function inScreen({ x, y, space = world, screen = canvas, margin = { width: 100, height: 100 } }) {
    const mx = margin.width + ((screen.width / world.scale) - space.width) / 2;
    const my = margin.height + ((screen.height / world.scale) - space.height) / 2;

    return x > -mx && x < space.width + mx && y > -my && y < space.height + my;
}