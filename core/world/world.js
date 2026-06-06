import { canvas, ctx, resizeCanvas } from "./canvas.js";
import { clamp } from "../utils/math.js";
import { toroidalDelta, wrap } from "./utils.js";
import { worldSize } from "../utils/constants.js";

export default class World {
    constructor({ x, y, width, height, scale = 1, object }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.object = object;
    }

    render() {
        resizeCanvas(this.scale);
        ctx.translate((canvas.width - this.width) / 2, (canvas.height - this.height) / 2);
    }

    update() {
        this.x = wrap(this.x + toroidalDelta(this.x, this.object.x, this.width) * 0.15, this.width);
        this.y = wrap(this.y + toroidalDelta(this.y, this.object.y, this.height) * 0.15, this.height);


        this.angle = this.object.angle;
    }

    zoom(f = 1) {
        this.scale = this.scale * f;
    }

    attach(obj) {
        this.object = obj ?? this.object;
    }
}


export const world = new World({
    x: 0,
    y: 0,
    width: worldSize.width,
    height: worldSize.height,
    scale: 0.7,
})