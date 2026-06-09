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
import Weapon from "./weapon.js";

export default class Projectile extends Weapon {
    constructor({ name, acceleration, speed, x, y, width, height, angle, damage, fireRate, range, energyCost, ship, penetration = 1, vertices = shapes[0], color = "red", img }, force) {
        super({ name, type: "projectile", x, y, width, height, acceleration, speed, angle, damage, range, energyCost, fireRate, ship, vertices, color, img }, force);
        this.distanceTraveled = 0;
        this.penetration = penetration;
    }

    update(t, dt) {
        this.speed = this.speed + (this.acceleration * dt);

        this.speed *= this.dampSpeed;

        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);

        this.distanceTraveled += (this.speed * dt);

        if (this.distanceTraveled >= this.range) {
            this.travelEnd();
            this.destroy();
        }

        this.colliding();
    }
}