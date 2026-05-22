import { randomNum } from "../../utils/random.js";
import { world } from "../../world/world.js";
import Ship from "./ship.js";

class PlayerShips extends Ship {
    constructor(props) {
        super(props);
    }
}

export const ship = new PlayerShips({
    x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 40, height: 40, color: "#84d0ff",
    controllable: true,
    acceleration: 500,
});

