import Ship from "../player/ships/ship.js";
import { isSeperatingAxes } from "../utils/collision.js";
import { clamp } from "../utils/math.js";
import { createVerticesPath, drawVerticesPath, tranformVertices } from "../utils/vertices.js";
import { ctx } from "../world/canvas.js";
import Asteroid from "../world/object/asteroid/asteroid.js";
import { spatial } from "../world/spatialHash.js";
import { drawWrapped, worldToScreen, wrap } from "../world/utils.js";
import { world } from "../world/world.js";

import { shapes } from "./shapes.js";

let WeaponManager;

import("./manager.js").then((f) => {
    WeaponManager = f.default;
})

export default class Weapon {
    constructor({ name, type, x, y, width, height, angle, ship, acceleration = 10, speed = 10, damage = 10, range = 1000, energyCost = 10, vertices = shapes[0], color = "red" }, force) {
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

        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, -this.height / 2, this.width, this.height, 0));

        this.active = true;

        if (!force)
            ship.increaseHeat(this.energyCost);
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

    async destroy() {
        if (WeaponManager)
            WeaponManager.destroy(this);
    }

    getVertices() {
        const world = worldToScreen(this.x, this.y);
        const vertices = tranformVertices(this.vertices, world.x, world.y, this.width, this.height, this.angle);

        return vertices;
    }

    static colliding(weapon, vertices, x, y) {
        const object = spatial.query(x, y, Math.ceil(weapon.height / spatial.cellSize) + 1);

        for (const element of object) {
            if (weapon.ship !== element && element?.state !== "dead" && (element instanceof Ship || element instanceof Asteroid)) {
                if (isSeperatingAxes(element.getVertices(), vertices).collision) {
                    if (element instanceof Ship) {
                        element.life -= weapon.damage;
                        if (element.life <= 0) {
                            element.destroy();
                            weapon.ship.killScore++;
                        }
                    } else {
                        element.destroy();
                    }

                    weapon.acceleration *= 0.8;
                    weapon.range *= 0.8;


                    if (!(--weapon.penetration)) {
                        weapon.colide();
                        weapon.destroy();
                    }
                }
            }
        }
    }


    colliding() {
        Weapon.colliding(this, this.getVertices(), this.x, this.y);
    }

    colide() { }
    travelEnd() { }
}