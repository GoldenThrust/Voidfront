import { sizeOf } from "../../../utils/constants.js";
import { randomNum } from "../../../utils/random.js";
import { world } from "../../../world/world.js";
import Explosion, { explosions } from "../../prop/explosion.js";
import { destroyedShips } from "../ship.js";
import Bomber from "./bomber.js";
import FleetDrone from "./fleet.js";
import Miner from "./miner.js";
import MissileLaucher from "./missileLaucher.js";
import Sniper from "./sniper.js";
import Tormenter from "./tormenter.js";

export default class EnemyManager {
    static ships = [];
    // static types = [AI];
    static types = [FleetDrone, Tormenter, Sniper, Bomber, Miner, MissileLaucher];

    static init() {
        for (let i = 0; i < sizeOf.ship; i++) {
            EnemyManager.ships.push(new this.types[Math.floor(randomNum(0, this.types.length))]({ x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 20, height: 20, color: "red" }));
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