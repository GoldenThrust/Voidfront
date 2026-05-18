import Ship from "../ship.js";
import EnemyManager from "./manager.js";
import ScoutDrone from "./scout.js";

export default class EnemyShips extends Ship {
    constructor({ state = "idle", ...prop }) {
        super(prop)
        this.state = state;
    }

    destroy() {
        EnemyManager.destroy(this);
    }
}
