import { canvasHeight, canvasWidth, ctx } from "../canvas.js";


const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

class SpatialHash {
    constructor() {
        this.cellSize = 100;

        this.map = new Map();
    }

    buildSpatialHash(objects) {
        this.map.clear();

        for (const objs of objects) {
            for (const obj of objs) {
                this.insert(obj);
            }
        }
    }

    hash(x, y) {

        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);

        return `${cellX},${cellY}`;
    }

    insert(obj) {

        const key = this.hash(obj.x, obj.y);

        if (!this.map.has(key)) {

            this.map.set(key, []);
        }

        this.map.get(key).push(obj);
    }

    clear() {
        this.map.clear();
    }

    query(obj) {

        const nearby = [];

        const cellX = Math.floor(obj.x / this.cellSize);
        const cellY = Math.floor(obj.y / this.cellSize);

        for (const [dx, dy] of directions) {

            const key = `${cellX + dx},${cellY + dy}`;

            if (this.map.has(key)) {

                nearby.push(...this.map.get(key));
            }
        }

        return nearby;
    }

    renderGrid() {
        ctx.strokeStyle = "#333";

        ctx.lineWidth = 1;

        for (let x = 0; x < canvasWidth; x += CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }
        for (let y = 0; y < canvasWidth; y += CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }
}

export const spatialHash = new SpatialHash(CELL_SIZE);
