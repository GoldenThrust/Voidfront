import { randomNum } from "../../utils/random.js";
import { toroidalDirection } from "../../world/utils.js";
import { world } from "../../world/world.js";
import EnemyManager from "./enemies/manager.js";
import Ship from "./ship.js";

export default class PlayerShip extends Ship {
    constructor({ x, y, width, height, angle, acceleration, color = "red", name = "Player", controllable = true, maxWeaponHeat = 10000 }) {
        super({ x, y, width, height, angle, acceleration, color, name, maxWeaponHeat, controllable, life: 10000 });

        if (this.controllable === false)
            this.state = "idle";
    }

    update(t, dt) {
        super.update(t, dt);
        // const diff = toroidalDirection(EnemyManager.ships[0].x, EnemyManager.ships[0].y, this.x, this.y, this.angle, -Math.PI/2);
        // console.log(diff, Math.PI/4)
    }
}

export const ship = new PlayerShip({
    x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 30, height: 30, color: "#84d0ff",
    controllable: false,
    acceleration: 200,
});

