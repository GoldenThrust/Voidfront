import { camera } from "../../world/camera.js";
import { ctx } from "../../world/space/canvas.js";
import { toroidalDelta } from "../../world/utils.js";

export default class Trail {
    constructor(length, color = "blue") {
        this.length = length;
        this.color = color;
        this.trails = [];
    }

    update(x, y, speed) {
        if (this.trails.length > this.length) {
            this.trails.shift();
        }

        this.trails.push({ x, y, speed });
    }

    render() {
        if (this.trails.length < 2) return;
        for (let i = 1; i < this.trails.length; i++) {
            const a = this.trails[i - 1], b = this.trails[i];
            const avgSpeed = (a.speed + b.speed) / 2;

            const adx = toroidalDelta(camera.x, a.x, camera.width);
            const ady = toroidalDelta(camera.y, a.y, camera.height);
            const bdx = toroidalDelta(camera.x, b.x, camera.width);
            const bdy = toroidalDelta(camera.y, b.y, camera.height);

            const t = i / this.trails.length;

            if (Math.abs(adx - bdx) > avgSpeed || Math.abs(ady - bdy) > avgSpeed) continue;
            ctx.beginPath();
            ctx.moveTo(adx, ady);
            ctx.lineTo(bdx, bdy);
            ctx.strokeStyle = this.color;

            ctx.globalAlpha = t * 0.3;
            ctx.lineWidth = t * 5;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
}