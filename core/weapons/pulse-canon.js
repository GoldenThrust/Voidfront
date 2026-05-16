import { worldSize } from "../utils/constants.js";
import { wrap } from "../world/utils.js";
import Weapon from "./base.js";

export default class PulseCanon extends Weapon {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Pulse Canon",
            type: "Energy",
            speed: speed,
            acceleration: 8000,
            x: x,
            y: y,
            width: 10,
            height: 20,
            angle: angle,
            damage: 100,
            range: 50000,
            fireRate: 100,
            energyCost: 10,
            ship,
            color
        });
    }

    // update(dt, manager) {
    //     super.update(dt, manager)
    // }
}