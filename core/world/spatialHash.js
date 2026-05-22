import { ctx } from "./canvas.js";
import { toroidalDelta, toroidalDistance, worldToScreen, wrap } from "./utils.js";
import { world } from "./world.js";

class SpatialHash {
    constructor(worldWidth, worldHeight, cellSize) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.cellSize = cellSize;

        this.cols = Math.ceil(worldWidth / cellSize);
        this.rows = Math.ceil(worldHeight / cellSize);

        this.map = new Map();
    }

    clear() {
        this.map.clear();
    }

    hash(cx, cy) {
        return `${cx},${cy}`;
        // return Math.floor(cy * this.cols + cx);
    }

    wrapCellX(cx) {
        return wrap(cx, this.cols);
    }

    wrapCellY(cy) {
        return wrap(cy, this.rows);
    }

    insert(obj) {
        let cx = Math.floor(obj.x / this.cellSize);
        let cy = Math.floor(obj.y / this.cellSize);

        cx = this.wrapCellX(cx);
        cy = this.wrapCellY(cy);

        const key = this.hash(cx, cy);

        if (!this.map.has(key)) {
            this.map.set(key, []);
        }

        this.map.get(key).push(obj);
    }

    insertAll(...object) {
        for (const elements of object) {
            for (const element of elements) {
                this.insert(element);
            }
        }
    }

    query(x, y, radius = 1) {
        const results = [];

        const minX = Math.floor((x - radius) / this.cellSize);
        const maxX = Math.floor((x + radius) / this.cellSize);

        const minY = Math.floor((y - radius) / this.cellSize);
        const maxY = Math.floor((y + radius) / this.cellSize);


        for (let cy = minY; cy <= maxY; cy++) {
            for (let cx = minX; cx <= maxX; cx++) {
                const wrappedX = this.wrapCellX(cx);
                const wrappedY = this.wrapCellY(cy);

                const key = this.hash(wrappedX, wrappedY);

                const bucket = this.map.get(key);
            

                if (!bucket) continue;

                for (const obj of bucket) {
                    // if (toroidalDistance(obj.x, obj.y, x, y) <= radius * radius) {
                        results.push(obj);
                    // }
                }
            }
        }

        return results;
    }


    renderSpatialHashGrid() {
        ctx.beginPath();
        for (let cy = 0; cy < this.rows; cy++) {
            for (let cx = 0; cx < this.cols; cx++) {
                const worldX = cx * this.cellSize;
                const worldY = cy * this.cellSize;

                const { x: screenX, y: screenY } = worldToScreen(worldX, worldY, world);

                ctx.rect(
                    screenX,
                    screenY,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
        ctx.strokeStyle = "lime";
        ctx.stroke();
    }

    renderActiveCells() {
        const cellSize = this.cellSize;

        for (const [key, bucket] of this.map) {

            const [cx, cy] = key.split(":").map(Number);

            const worldX = cx * cellSize;
            const worldY = cy * cellSize;


            const { x: screenX, y: screenY } = worldToScreen(worldX, worldY, world);

            ctx.fillStyle = "rgba(0,255,0,0.2)";

            ctx.fillRect(
                screenX,
                screenY,
                cellSize,
                cellSize
            );
        }
    }

    renderCellLabels() {
        ctx.fillStyle = "white";
        ctx.font = "12px monospace";

        for (let cy = 0; cy < this.rows; cy++) {

            for (let cx = 0; cx < this.cols; cx++) {

                const worldX = cx * this.cellSize;
                const worldY = cy * this.cellSize;

                const { x: screenX, y: screenY } = worldToScreen(worldX, worldY, world);

                ctx.fillText(
                    `${cx},${cy}`,
                    screenX + 5,
                    screenY + 15
                );
            }
        }
    }

    renderSpatialDebug() {
        this.renderActiveCells();
        this.renderSpatialHashGrid();
        this.renderCellLabels();
    }
}


export const spatial = new SpatialHash(
    world.width,
    world.height,
    1000
);