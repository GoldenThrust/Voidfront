import { sizeOf } from "../../../utils/constants.js";
import { randomNum } from "../../../utils/random.js";
import { world } from "../../../world/world.js";
import Explosion, { explosions } from "../../prop/explosion.js";
import { destroyedShips } from "../ship.js";
import ScoutDrone from "./scout.js";

export default class EnemyManager {
    static ships = [];

    static init() {
        for (let i = 0; i < sizeOf.ship; i++) {
            EnemyManager.ships.push(new ScoutDrone({ x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 40, height: 40, color: "red" }));
        }
    }

    static destroy(enemy) {
        const index = EnemyManager.ships.indexOf(enemy);
        
        if (index > -1) {
            enemy.state = "dead";
            explosions.push(new Explosion(enemy.x, enemy.y));
            destroyedShips.push(EnemyManager.ships.splice(index, 1));
        }
    }

    static render() {
        for (const ship of EnemyManager.ships) {
            ship.render();
        }
    }

    static update(t, dt) {
        for (const ship of EnemyManager.ships) {
            ship.update(t, dt);
        }

    }
}