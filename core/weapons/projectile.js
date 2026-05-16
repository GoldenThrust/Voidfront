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
import Weapon from "./weapon.js";

export default class Projectile extends Weapon {
    constructor({ name, acceleration, speed, x, y, width, height, angle, damage, fireRate, range, energyCost, ship, penetration = 1, vertices = shapes[0], color = "red" }, force) {
        super({ name, type: "projectile", x, y, width, height, acceleration, speed, angle, damage, range, energyCost, ship, vertices, color }, force);
        this.fireRate = fireRate;
        this.distanceTraveled = 0;
        this.penetration = penetration;

        if (!force)
            ship.weaponManager.setCoolDown(1 / this.fireRate);
    }

    update(dt, manager) {
        this.speed = this.speed + (this.acceleration * dt);

        this.speed *= this.dampSpeed;

        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);

        this.distanceTraveled += (this.speed * dt);

        if (this.distanceTraveled >= this.range) {
            this.travelEnd();
            manager.destroy(this);
        }

        this.colliding(manager);
    }

    colliding(manager) {
        const object = spatial.query(this.x, this.y, 2);

        for (const element of object) {
            if (element !== ship && (element instanceof Ship || element instanceof Asteroid)) {
                if (isSeperatingAxes(element.getVertices(), this.getVertices()).collision) {
                    element.destroy();
                    if (element instanceof Ship)
                        this.ship.killScore++;
                    this.acceleration *= 0.8;
                    this.range *= 0.8;


                    if (!(--this.penetration)) {
                        this.colide();
                        manager.destroy(this);
                    }
                }
            }
        }
    }

    colide() { }
    travelEnd() { }
}