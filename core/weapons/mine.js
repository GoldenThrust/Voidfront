import { assets } from "../assets/main.js";
import { randomNum } from "../utils/random.js";
import WeaponManager from "./manager.js";
import Minature from "./minature.js";
import { shapes } from "./shapes.js";
import Weapon from "./weapon.js";

export default class Mine extends Weapon {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Mine",
            speed: speed,
            acceleration: 10000,
            x: x,
            y: y,
            width: 20,
            height: 20,
            angle: angle,
            damage: 50,
            range: 10000,
            fireRate: 1,
            energyCost: ship.maxHeat + 100,
            ship,
            color,
            vertices: shapes[1],
            img: assets?.images?.mine
        });

        this.duration = 1000;
    }

    update() {
        this.colliding();

        if (!(--this.duration)) {
            this.destroy()
            this.explode(200, 1000)
        };
    }


    explode(particles = 50, radius = 500) {
        if (!this.active) return;
        for (let i = 0; i < particles; i++) {
            const prop = {
                x: this.x - Math.sin(this.angle) * this.width,
                y: this.y - Math.cos(this.angle) * this.height,
                angle: randomNum(-Math.PI, Math.PI),
                speed: randomNum(radius / 2, radius),
                ship: this.ship,
                range: randomNum(radius * 0.1, radius / 2),
                color: "yellow"
            }

            WeaponManager.fire(Minature, prop, true)
        }
    }

    colide() {
        this.explode();
    }
}