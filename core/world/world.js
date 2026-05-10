import { canvas, canvasHeight, canvasWidth, ctx, dpr, resizeCanvas } from "./space/canvas.js";
import { clamp } from "../utils/math.js";
import { toroidalDelta, wrap } from "./utils.js";
import { worldSize } from "../utils/constants.js";

export default class World {
    constructor({ x, y, width, height }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render() {
        resizeCanvas()
        // ctx.strokeStyle = "white";
        // ctx.strokeRect(canvas.width / 2 - this.width / 2, canvas.height / 2 - this.height / 2, this.width, this.height);
        // ctx.restore();
        // ctx.save()

        ctx.translate((canvas.width - this.width) / 2, (canvas.height - this.height) / 2);
    }

    attach({ x, y, angle, scale = 1 }) {
        this.x = wrap(this.x + toroidalDelta(this.x, x, this.width) * 0.15, this.width);
        this.y = wrap(this.y + toroidalDelta(this.y, y, this.height) * 0.15, this.height);


        this.angle = angle;
        this.scale = scale * dpr;
    }
}


export const world = new World({
    x: 0,
    y: 0,
    width: worldSize.width,
    height: worldSize.height,
})