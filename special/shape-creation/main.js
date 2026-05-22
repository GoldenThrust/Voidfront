// ===== CANVAS SETUP =====
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

const dpr = window.devicePixelRatio ?? 1;

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;

ctx.scale(dpr, dpr);

const grid = [];
let vertices = [];

let mousePosition = {
    x: 0,
    y: 0
}

const CELL_SIZE = 50;

function boxCircleDistance(box, circle) {
    const cx = Math.max(box.x, Math.min(circle.x, box.x + box.w));
    const cy = Math.max(box.y, Math.min(circle.y, box.y + box.h));


    const dx = circle.x - cx;
    const dy = circle.y - cy;

    return { dist: dx * dx + dy * dy, cx, cy };
}


function drawVertices(vertices, color = "blue",) {
    if (!vertices.length) return;
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    // ctx.globalAlpha = 0.5;
    ctx.moveTo(vertices[0].x, vertices[0].y);

    vertices.forEach((vertex, i) => {
        if (i) {
            ctx.lineTo(vertex.x, vertex.y);
        }
    });

    ctx.lineTo(vertices[0].x, vertices[0].y);
    ctx.fill();
    ctx.stroke();

    vertices.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.fillStyle = "indigo";
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    })
    ctx.restore();
}

function init() {
    // for (let y = 0; y < canvas.height; y += CELL_SIZE) {
    //     for (let x = 0; x < canvas.width; x += CELL_SIZE) {
    // ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
    //         ctx.moveTo(x, 0);
    // ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(x + CELL_SIZE, y);
    // ctx.stroke();
    // ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(x, y + CELL_SIZE);
    // ctx.stroke();
    // grid.push({ x, y, w: CELL_SIZE, h: 1, color: "black" })
    // grid.push({ x, y, w: 1, h: CELL_SIZE, color: "black" })
    // ctx.beginPath();
    // ctx.moveTo(y, x);
    // ctx.lineTo(CELL_SIZE, x);
    // ctx.stroke();

    //         ctx.beginPath();
    //         ctx.moveTo(x, y);
    //     }
    // }

    for (let x = 0; x < canvasWidth; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();

        grid.push({ x, y: 0, w: 1, h: canvasHeight, color: "black" })
    }

    for (let y = 0; y < canvasWidth; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();

        grid.push({ x: 0, y, w: canvasWidth, h: 1, color: "black" })
    }
}

init();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((grd) => {
        ctx.strokeStyle = grd.color;
        ctx.strokeRect(grd.x, grd.y, grd.w, grd.h)
    })

    drawVertices([...vertices, {
        ...mousePosition
    }])
    // drawVertices(vertices, "pink");
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

canvas.addEventListener("mousemove", ({ x, y }) => {
    let snapTo;
    grid.forEach((val) => {
        const { dist, cx, cy } = boxCircleDistance(val, { x, y })
        if (dist < 50 && !snapTo) {
            val.color = "yellow";
            snapTo = {
                x: cx,
                y: cy
            };
            return true;
        }

        val.color = "black";
        return false
    });

    if (mousePosition?.x) {


        if (snapTo?.x && snapTo?.y) {
            mousePosition.x = snapTo?.x ?? x;
            mousePosition.y = snapTo?.y ?? y;
        } else {
            mousePosition.x = x;
            mousePosition.y = y;
        }
    }
    draw();
})

canvas.addEventListener("mousedown", ({ x, y }) => {
    if (mousePosition?.x) {
        vertices.push({
            ...mousePosition
        })

        const found = grid.find((val) => (val.x === 0 && val.y === mousePosition.y) || (val.x === mousePosition.x && val.y === 0));

        if (found?.x !== 0)
            grid.push({ x: 0, y: mousePosition.y, w: canvasWidth, h: 0.1, color: "yellow" })
        if (found?.y !== 0)
            grid.push({ x: mousePosition.x, y: 0, w: 0.1, h: canvasHeight, color: "yellow" })
    } else {
        mousePosition = { x, y }
    }
    draw();
})

addEventListener("keydown", ({ code }) => {
    if (code === "Escape") {
        mousePosition = {}
    }

    if (code === "KeyZ") vertices.pop();

    draw()
})

// for (let x = 0; x < canvas.width; x += CELL_SIZE) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.width);
//     ctx.stroke();
// }

// for (let y = 0; y < canvas.height; y += CELL_SIZE) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.height, y);
//     ctx.stroke();
// }

const cpyBtn = document.querySelector("#copy");
const mirrorBtn = document.querySelector("#mirror");

cpyBtn.addEventListener("click", () => {
    const nPoints = normalizePoints(vertices);
    let worldPoints = [...nPoints];
    navigator.clipboard.writeText(`[${worldPoints.map((point) => `{x: ${point.x}, y: ${point.y}}`)}]`);
})

mirrorBtn.addEventListener("click", () => {
    const { minX, maxX } = getMinMax(vertices);

    const width = maxX - minX;

    let newPoints = vertices.map(p => ({
        ...p,
        x: (2 * maxX) - p.x,
    }));

    newPoints = newPoints.reverse().pop();

    vertices.push(...newPoints);

    console.log("new Vertices", vertices);

})

function getMinMax(points) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const p of points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;

        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
    }

    return { minX, minY, maxX, maxY }
}
function normalizePoints(points) {
    const { minX, minY, maxX, maxY } = getMinMax(points);

    const width = maxX - minX;
    const height = maxY - minY;

    const cx = minX + width / 2;
    const cy = minY + height / 2;

    const scale = Math.max(width, height) / 2;

    return points.map(p => ({
        x: (p.x - cx) / scale,
        y: (p.y - cy) / scale
    }))
}