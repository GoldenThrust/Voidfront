import { world } from "./world.js";
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

export function worldToScreen(wx, wy, space = world) {
    const dx = toroidalDelta(space.x, wx, space.width);
    const dy = toroidalDelta(space.y, wy, space.height);

    return {
        x: dx + space.width / 2,
        y: dy + space.height / 2
    }
}

export function drawWrapped({ fn, x, y, margin = { width: 0, height: 0 }, space = world, screen = canvas }) {
    updateWrapped({
        fn: (sx, sy) => {
            ctx.save()
            ctx.translate(sx, sy);
            fn(sx, sy);
            ctx.restore();
        }, x, y, space, screen, margin
    })

}
export function updateWrapped({ fn, x, y, margin = { width: 0, height: 0 }, space = world, screen = canvas }) {
    const base = worldToScreen(x, y);

    const ox = 0, oy = 0;

    // for (let ox = -1; ox <= 1; ox++) {
    //     for (let oy = -1; oy <= 1; oy++) {
    const sx = base.x + ox * world.width;
    const sy = base.y + oy * world.height;

    if (inScreen({ x: sx, y: sy, space, screen, margin })) {
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
//     const sx = base.x + ox * world.width;
//     const sy = base.y + oy * world.height;

//     if (inScreen(sx, sy, world, WORLD_MARGIN)) {
//         ctx.save()
//         ctx.translate(sx, sy);
//         fn(sx, sy);
//         ctx.restore();
//     }
//         }
//     }
// }

export function inScreen({ x, y, space = world, screen = canvas, margin = { x: 100, y: 100 } }) {
    margin.width += (screen.width - space.width) / 2;
    margin.height += (screen.height - space.height) / 2;

    if (x > -margin.width && x < space.width + margin.width && y > -margin.height && y < space.height + margin.height) return true;

    return false;
}

// export function worldToScreen(wx, wy, world) {
//     // return {
//     //     x: wx,
//     //     y: wy
//     // // }
//     // return {
//     //     x: (wx - world.x) + world.width/2,
//     //     y: (wy - world.y) + world.height/2
//     // }
// }

// export function projectToWorld(obj, world) {
//     let dx = toroidalDelta(obj.x, world.x, world.width);
//     let dy = toroidalDelta(obj.y, world.y, world.height);

//     return {
//         x: dx + world.width,
//         y: dy + world.height
//     }
// }