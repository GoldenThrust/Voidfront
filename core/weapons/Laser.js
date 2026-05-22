import { keys } from "../events/keys.js";
import { ctx } from "../world/canvas.js";
import Weapon from "./weapon.js";

export class Laser extends Weapon {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        const height = 10000;
        const grd = ctx.createLinearGradient(0, 0, 0, -height);
        grd.addColorStop(0, color);
        grd.addColorStop(1, "transparent");
        super({
            name: "Laser",
            type: "Hitscan",
            speed: speed,
            acceleration: 20000,
            x: x,
            y: y,
            width: 10,
            height: height,
            angle: angle,
            damage: 5,
            fireRate: 0.5,
            energyCost: 5,
            ship,
            color: grd
        });
    }

    update(dt) {
        this.ship.increaseHeat(this.energyCost);
        this.ship.setMaxHeat();

        const { x, y, width, height, angle } = this.ship;
        this.x = x - Math.sin(angle) * width/2;
        this.y = y - Math.cos(angle) * height/2;
        this.angle = angle;

        if ((!(keys[" "] || keys["Enter"] || keys["Space"]) && this.ship.controllable) || this.heat > this.maxHeat) {
            this.destroy();
        }

        this.colliding();
    }
}