import { canvas, canvasHeight, canvasWidth, ctx, dpr, resizeCanvas } from "./space/canvas.js";
import { clamp } from "../utils/math.js";
import { toroidalDelta, wrap } from "./utils.js";

export default class World {
    constructor({ x, y, width, height, angle, scale }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.scale = scale;
    }

    render() {
        resizeCanvas()
        ctx.strokeStyle = "white";
        ctx.strokeRect(canvas.width / 2 - this.width / 2, canvas.height / 2 - this.height / 2, this.width, this.height);
        ctx.restore();
        ctx.save()

        ctx.translate((canvas.width - this.width) / 2, (canvas.height - this.height) / 2);
        // ctx.scale(this.scale, this.scale);
        // ctx.rotate(this.angle);
        // ctx.scale(this.scale, this.scale);


    }

    attach({ x, y, angle, scale = 1 }) {
        this.x = wrap(this.x + toroidalDelta(this.x, x, this.width) * 0.15, this.width);
        this.y = wrap(this.y + toroidalDelta(this.y, y, this.height) * 0.15, this.height);


        this.angle = angle;
        this.scale = scale * dpr;
    }

    update(x, y, angle, scale) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.scale = scale;
    }

    updateState({ dx = 0, dy = 0, dAngle = 0, dScale = 0 }) {
        this.x = wrap(this.x + dx, this.width);
        this.y = wrap(this.y + dy, this.height);
        // this.x += dx;
        // this.y += dy;

        this.angle += dAngle;

        this.scale = this.scale + dScale;
    }
}


export const world = new World({
    x: 150,
    y: 150,
    width: canvas.width * 20,
    height: canvas.height * 20,
    angle: 0,
    scale: 1
})