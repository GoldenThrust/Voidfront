import Ship, { ship } from "../player/ship.js";
import { isSeperatingAxes } from "../utils/collision.js";
import { clamp } from "../utils/math.js";
import { createVerticesPath, drawVerticesPath, tranformVertices } from "../utils/vertices.js";
import { ctx } from "../world/canvas.js";
import Asteroid from "../world/object/asteroid/asteroid.js";
import { spatial } from "../world/spatialHash.js";
import { drawWrapped, worldToScreen, wrap } from "../world/utils.js";
import { world } from "../world/world.js";
import { shapes } from "./shapes.js";

export default class Weapon {
    constructor({ name, type, x, y, width, height, angle, acceleration, speed, damage, range, energyCost, ship, vertices = shapes[0], color = "red" }, force) {
        this.name = name;
        this.type = type;
        this.acceleration = acceleration;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.damage = damage;

        this.range = range;
        this.energyCost = energyCost;
        this.vertices = vertices;

        this.color = color;
        this.ship = ship;

        this.dampSpeed = 0.99;

        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, -this.height / 3, this.width, this.height, 0));

        if (!force)
            ship.weaponManager.increaseHeat(this.energyCost);
    }

    render() {
        drawWrapped({
            fn: () => {
                ctx.rotate(-this.angle);
                drawVerticesPath(this.path2D, this.color);
            }, x: this.x, y: this.y, margin: {
                width: 200, height: 200
            }
        })
    }

    getVertices() {
        const world = worldToScreen(this.x, this.y);
        const vertices = tranformVertices(this.vertices, world.x, world.y, this.width, this.height, this.angle);

        return vertices;
    }
}