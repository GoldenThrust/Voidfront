import { worldSize } from "../utils/constants.js";
import { wrap } from "../world/utils.js";
import Projectile from "./projectile.js";

export default class PulseCanon extends Projectile {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Pulse Canon",
            speed: speed,
            acceleration: 500,
            x: x,
            y: y,
            width: 10,
            height: 20,
            angle: angle,
            damage: 40,
            range: 10000,
            fireRate: 0.5,
            energyCost: 50,
            ship,
            color
        });
    }
}