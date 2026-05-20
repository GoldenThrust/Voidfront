import { worldSize } from "../utils/constants.js";
import { wrap } from "../world/utils.js";
import Projectile from "./projectile.js";

export default class Minature extends Projectile {
    constructor({ x, y, angle, ship, range = 500, color, speed = 10 }) {
        super({
            name: "Minature",
            speed: speed,
            acceleration: speed,
            x: x,
            y: y,
            width: 10,
            height: 10,
            angle: angle,
            damage: 5,
            range,
            fireRate: 1,
            energyCost: 0,
            ship,
            color
        });
    }
}