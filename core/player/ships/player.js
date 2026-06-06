import { randomNum } from "../../utils/random.js";
import { world } from "../../world/world.js";
import Ship from "./ship.js";

export default class PlayerShip extends Ship {
    constructor({ x, y, width, height, angle, acceleration, color = "red", name = "Player", controllable = true, maxWeaponHeat = 10000 }) {
        super({ x, y, width, height, angle, acceleration, color, name, maxWeaponHeat, controllable, life: 1000 });

        if (this.controllable === false)
            this.state = "idle";
    }
}

export const ship = new PlayerShip({
    x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 30, height: 30, color: "#84d0ff",
    controllable: false,
    acceleration: 200,
});

