import { worldSize } from "../utils/constants.js";
import { wrap } from "../world/utils.js";
import Weapon from "./base.js";

export default class PulseCanon extends Weapon {
    constructor({ x, y, angle, ship, speed = 10 }) {
        super({
            name: "Pulse Canon",
            type: "Energy",
            speed: speed,
            acceleration: 20000,
            maxSpeed: 20000,
            x: x,
            y: y,
            width: 2,
            height: 10,
            angle: angle,
            damage: 100,
            range: 300000,
            fireRate: 1,
            energyCost: 10,
            ship
        });

        console.log("Acceleration", this.acceleration, speed)
    }

    update(dt, manager) {
        super.update(dt, manager)
    }
}