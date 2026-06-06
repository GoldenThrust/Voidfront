import { worldSize } from "../utils/constants.js";
import { randomNum } from "../utils/random.js";
import { wrap } from "../world/utils.js";
import Projectile from "./projectile.js";

export default class GatlingGun extends Projectile {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Gatling Gun",
            speed: speed,
            acceleration: 50000,
            x: x,
            y: y,
            width: 10,
            height: 20,
            angle: angle,
            damage: 20,
            range: 10000,
            fireRate: 0.5,
            energyCost: 50,
            ship,
            color
        });
    }

    update(t, dt) {
        this.angle += randomNum(-0.005, 0.005)
        super.update(t, dt);
    }
}