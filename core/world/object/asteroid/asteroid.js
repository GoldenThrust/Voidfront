import { randomNum } from "../../../utils/random.js";
import { world } from "../../world.js";
import { ctx } from "../../canvas.js";
import { drawWrapped, worldToScreen, wrap } from "../../utils.js";
import { createVerticesPath, drawVertices, drawVerticesPath, tranformVertices } from "../../../utils/vertices.js";
import { shapes } from "./shapes.js";
import { sizeOf } from "../../../utils/constants.js";

export default class Asteroid {
    constructor() {
        this.x = randomNum(0, world.width);
        this.y = randomNum(0, world.height);
        this.width = randomNum(1, 50);
        this.height = randomNum(1, 50);
        this.speed = randomNum(-20, 20);
        this.rotationSpeed = randomNum(-0.015, 0.015);
        this.angle = randomNum(-Math.PI, Math.PI);
        this.vertices = shapes[Math.floor(Math.random() * shapes.length)];
        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, 0, this.width, this.height, this.angle));
    }

    update(dt) {
        this.x = wrap(this.x + this.speed * dt, world.width);
        this.y = wrap(this.y + this.speed * dt, world.height);

        this.angle = wrap(this.angle + this.rotationSpeed, Math.PI * 2);
    }

    render() {
        drawWrapped({
            fn: () => {
                ctx.rotate(-this.angle);
                drawVerticesPath(this.path2D, "grey");
            }, x: this.x, y: this.y
        })
    }

    destroy() {
        const index = asteroids.indexOf(this);
        if (index > -1) {
            asteroids.splice(index, 1);
        }
    }


    getVertices() {
        const world = worldToScreen(this.x, this.y);
        const vertices = tranformVertices(this.vertices, world.x, world.y, this.width, this.height, this.angle);

        return vertices;
    }
}

export const asteroids = [];

for (let i = 0; i < sizeOf.asteroid; i++) {
    asteroids.push(new Asteroid());
}