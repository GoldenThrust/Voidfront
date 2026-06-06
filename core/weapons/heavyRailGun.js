import { worldSize } from "../utils/constants.js";
import { wrap } from "../world/utils.js";
import Projectile from "./projectile.js";

export default class HeavyRailGun extends Projectile {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Heavy RailGun",
            speed: speed * 4,
            acceleration: 50000,
            x: x,
            y: y,
            width: 20,
            height: 90,
            angle: angle,
            damage: 100,
            range: 50000,
            fireRate: 0.005,
            energyCost: 1000,
            penetration: 5,
            ship,
            color
        });
    }

    // update(dt, manager) {
    //     super.update(dt, manager)
    // }
}