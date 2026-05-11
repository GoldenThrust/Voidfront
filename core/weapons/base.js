import { clamp } from "../utils/math.js";
import { ctx } from "../world/space/canvas.js";
import { drawWrapped, wrap } from "../world/utils.js";
import { world } from "../world/world.js";

export default class Weapon {
    constructor({ name, type, acceleration, speed, maxSpeed, x, y, width, height, angle, damage, fireRate, range, energyCost, ship, color = "red" }) {
        this.name = name;
        this.type = type;
        this.acceleration = acceleration;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.damage = damage;
        this.range = range;
        this.energyCost = energyCost;
        this.fireRate = fireRate;
        this.distanceTraveled = 0;

        this.color = "red";

        ship.weaponManager.setCoolDown(1 / this.fireRate);

        ship.weaponManager.increaseHeat(this.energyCost);

    }



    update(dt, manager) {
        this.speed = clamp(this.speed + (this.acceleration * dt), 0, this.maxSpeed);

        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);

        this.distanceTraveled += this.speed;

        if (this.distanceTraveled >= this.range) {
            manager.destroy(this);
        }
    }

    render() {
        ctx.fillStyle = this.color;
        drawWrapped({
            fn: () => {
                ctx.rotate(-this.angle);
                ctx.fillRect(0, 0, this.width, this.height);
            }, x: this.x, y: this.y
        })
    }
}