import { ctx } from "../world/canvas.js";

export function drawVertices(vertices, color = "blue",) {
    ctx.save();
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    // ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.moveTo(vertices[0].x, vertices[0].y);

    vertices.forEach((vertex, i) => {
        if (i) {
            ctx.lineTo(vertex.x, vertex.y);
        }
    });

    ctx.lineTo(vertices[0].x, vertices[0].y);
    ctx.fill();
    // ctx.stroke();
    ctx.restore();
}

export function tranformVertices(vertices, cx, cy, scaleX, scaleY, rotation) {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    const hw = scaleX/2;
    const hh = scaleY/2

    const result = [];

    for (const vertex of vertices) {
        const sx = vertex.x * hw;
        const sy = vertex.y * hh;

        const rx = sx * cos - sy * sin;
        const ry = sx * sin + sy * cos;

        result.push({
            x: cx + rx,
            y: cy + ry
        });
    }

    return result;
}


export function createVerticesPath(vertices) {
    const verticesPath = new Path2D();

    verticesPath.moveTo(vertices[0].x, vertices[0].y);

    vertices.forEach((vertex, i) => {
        if (i) {
            verticesPath.lineTo(vertex.x, vertex.y);
        }
    });

    verticesPath.lineTo(vertices[0].x, vertices[0].y);

    return verticesPath;
}

export function drawVerticesPath(path, color = "blue",) {
    ctx.save();
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    // ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5;

    ctx.fill(path)
    ctx.restore();
}