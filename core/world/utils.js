import { camera } from "./camera.js";
import { canvas, canvasWidth, ctx } from "./space/canvas.js";

export function wrap(value, size) {
    return ((value % size) + size) % size;
}


export function toroidalDelta(a, b, size) {
    let d = (b - a) % size;
    if (d > size * 0.5) d -= size;

    if (d < -size * 0.5) d += size;

    return d;
}

export function worldToScreen(wx, wy, screen = null) {
    screen = screen ?? camera;
    const dx = toroidalDelta(screen.x, wx, screen.width);
    const dy = toroidalDelta(screen.y, wy, screen.height);

    return {
        x: dx + screen.width / 2,
        y: dy + screen.height / 2
    }
}

export function drawWrapped(fn, wx, wy) {
    updateWrapped((sx, sy) => {
        ctx.save()
        ctx.translate(sx, sy);
        fn(sx, sy);
        ctx.restore();
    }, wx, wy)

}
export function updateWrapped(fn, wx, wy, word_margin = { width: 0, height: 0 }) {
    const base = worldToScreen(wx, wy);

    const ox = 0, oy = 0;

    // for (let ox = -1; ox <= 1; ox++) {
    //     for (let oy = -1; oy <= 1; oy++) {
    const sx = base.x + ox * camera.width;
    const sy = base.y + oy * camera.height;

    if (inScreen(sx, sy, camera, word_margin)) {
        fn(sx, sy);
    }
    // }
    // }
}
// export function drawWrapped(fn, wx, wy) {
//     const WORLD_MARGIN = 50;
//     const base = worldToScreen(wx, wy);

//     const ox = 0, oy = 0;

//     for (let ox = -1; ox <= 1; ox++) {
//         for (let oy = -1; oy <= 1; oy++) {
//     const sx = base.x + ox * camera.width;
//     const sy = base.y + oy * camera.height;

//     if (inScreen(sx, sy, camera, WORLD_MARGIN)) {
//         ctx.save()
//         ctx.translate(sx, sy);
//         fn(sx, sy);
//         ctx.restore();
//     }
//         }
//     }
// }

export function inScreen(x, y, screen, margin = { x: 100, y: 100 }) {
    margin.width += (canvas.width - screen.width) / 2;
    margin.height += (canvas.height - screen.height) / 2;

    if (x > -margin.width && x < screen.width + margin.width && y > -margin.height && y < screen.height + margin.height) return true;

    return false;
}

// export function worldToScreen(wx, wy, camera) {
//     // return {
//     //     x: wx,
//     //     y: wy
//     // // }
//     // return {
//     //     x: (wx - camera.x) + camera.width/2,
//     //     y: (wy - camera.y) + camera.height/2
//     // }
// }

// export function projectToCamera(obj, camera) {
//     let dx = toroidalDelta(obj.x, camera.x, camera.width);
//     let dy = toroidalDelta(obj.y, camera.y, camera.height);

//     return {
//         x: dx + camera.width,
//         y: dy + camera.height
//     }
// }