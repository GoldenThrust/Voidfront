import { worldSize } from "../utils/constants.js";
import { randomNum } from "../utils/random.js";
import { wrap } from "../world/utils.js";
import Projectile from "./projectile.js";

export default class GatlingGun extends Projectile {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Gatling Gun",
            speed: speed,
            acceleration: 20000,
            x: x,
            y: y,
            width: 10,
            height: 20,
            angle: angle,
            damage: 100,
            range: 10000,
            fireRate: 0.2,
            energyCost: 100,
            ship,
            color
        });
    }

    update(dt, manager) {
        this.angle += randomNum(-0.01, 0.01)
        super.update(dt, manager);
    }
}