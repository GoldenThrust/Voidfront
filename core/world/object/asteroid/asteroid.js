import { randomNum } from "../../../utils/random.js";
import { world } from "../../world.js";
import { ctx } from "../../space/canvas.js";
import { drawWrapped, wrap } from "../../utils.js";
import { createVerticesPath, drawVertices, drawVerticesPath, tranformVertices } from "../../../utils/vertices.js";
import { shapes } from "./shapes.js";

class Asteroid {
    constructor() {
        this.x = randomNum(0, world.width);
        this.y = randomNum(0, world.height);
        this.width = randomNum(1, 30);
        this.height = randomNum(1, 30);
        this.speed = randomNum(-0.2, 0.2);
        this.rotationSpeed = randomNum(-0.01, 0.01);
        this.angle = randomNum(-Math.PI, Math.PI);
        this.vertices = tranformVertices(shapes[Math.floor(Math.random() * shapes.length)], 0, 0, this.width, this.height, this.angle);
        this.path2D = createVerticesPath(this.vertices)
    }

    update(t) {
        this.x = wrap(this.x + this.speed, world.width);
        this.y = wrap(this.y + this.speed, world.height);

        this.angle = wrap(this.angle + this.rotationSpeed, Math.PI * 2);
    }

    render() {
        this.update();
        drawWrapped({
            fn: () => {
                ctx.rotate(-this.angle);
                drawVerticesPath(this.path2D, "grey");
            }, x: this.x, y: this.y
        })
    }
}

export const asteroids = [];

for (let i = 0; i < 1000; i++) {
    asteroids.push(new Asteroid());
}