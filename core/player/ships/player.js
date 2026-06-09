import { assets } from "../../assets/main.js";
import { randomNum } from "../../utils/random.js";
import { toroidalDirection } from "../../world/utils.js";
import { world } from "../../world/world.js";
import EnemyManager from "./enemies/manager.js";
import Ship from "./ship.js";


export let ship;

export default class PlayerShip extends Ship {
    constructor({ x, y, width, height, angle, acceleration, color = "red", name = "Player", controllable = true, maxWeaponHeat = 10000 }) {
        super({ x, y, width, height, angle, img: assets?.images?.mainship, flameImg: assets?.images?.flame1, acceleration, color, name, maxWeaponHeat, controllable, life: 10000 });

        if (this.controllable === false)
            this.state = "idle";    
    }    

    static spawn(x, y) {
        const angle = randomNum(-Math.PI * 2, Math.PI * 2);
        const spawnDistance = 200000;
        const spawnX = randomNum(x - spawnDistance, x + spawnDistance);
        const spawnY = randomNum(y - spawnDistance, y + spawnDistance);
        ship = new PlayerShip({ x: spawnX, y: spawnY, angle, width: 30, height: 30, color: "#84d0ff", acceleration: 200 });
    }    
}    
