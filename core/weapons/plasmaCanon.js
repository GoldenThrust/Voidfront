import { worldSize } from "../utils/constants.js";
import { randomNum } from "../utils/random.js";
import { wrap } from "../world/utils.js";
import Projectile from "./projectile.js";
import Minature from "./minature.js";
import WeaponManager from "./manager.js";

export default class PlasmaCanon extends Projectile {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Plasma Canon",
            speed: speed,
            acceleration: 100000,
            x: x,
            y: y,
            width: 10,
            height: 20,
            angle: angle,
            damage: 10,
            range: 5000,
            fireRate: 0.002,
            energyCost: 1,
            ship,
            color: "green"
        });
    }

    explode(radius = 500) {
        if (!this.active) return;
        for (let i = 0; i < 10; i++) {
            const prop = {
                x: this.x - Math.sin(this.angle) * this.width,
                y: this.y - Math.cos(this.angle) * this.height,
                angle: randomNum(-Math.PI, Math.PI),
                speed: randomNum(radius/2, radius),
                ship: this.ship,
                range: randomNum(radius * 0.1, radius/2),
                color: "yellow"
            }

            
            WeaponManager.fire(Minature, prop, true)
        }
    }

    travelEnd() {
        this.explode()
    }

    colide() {
        // this.explode();
    }

    // update(dt, manager) {
    //     super.update(dt, manager)
    // }
}