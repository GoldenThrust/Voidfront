import Ship from "../ship.js";
import EnemyManager from "./manager.js";

export default class EnemyShip extends Ship {
    constructor({ state = "idle", ...prop }) {
        super(prop)
        this.state = state;
    }

    destroy() {
        EnemyManager.destroy(this);
    }
}
