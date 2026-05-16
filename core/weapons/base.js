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
    constructor({ name, type, acceleration, speed, x, y, width, height, angle, damage, fireRate, range, energyCost, ship, vertices = shapes[0], color = "red" }) {
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
        this.fireRate = fireRate;
        this.vertices = vertices;
        this.distanceTraveled = 0;
        this.dampSpeed = 0.99;

        this.color = color;

        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, 0, this.width, this.height, 0));

        ship.weaponManager.setCoolDown(1 / this.fireRate);

        ship.weaponManager.increaseHeat(this.energyCost);
    }

    update(dt, manager) {
        this.speed = this.speed + (this.acceleration * dt);

        this.speed *= this.dampSpeed;

        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);

        this.distanceTraveled += (this.speed * dt);

        if (this.distanceTraveled >= this.range) {
            manager.destroy(this);
        }

        this.colliding(manager);
    }

    colliding(manager) {
        const object = spatial.query(this.x, this.y, 2);

        for (const element of object) {
            if (element instanceof Ship || element instanceof Asteroid && element !== ship) {
                if (isSeperatingAxes(element.getVertices(), this.getVertices()).collision) {
                    element.destroy();
                    manager.destroy(this);
                }
            }
        }
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