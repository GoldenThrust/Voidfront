import { spatial } from "../world/spatialHash.js";
import PulseCanon from "./pulse-canon.js";

export default class WeaponManager {
    constructor(maxHeat = 100) {
        this.weapons = [];
        this.cooldown = 0;
        this.heat = 0;
        this.maxHeat = maxHeat;
    }

    canFire() {
        return (this.cooldown <= 0 && this.heat < this.maxHeat)
    }

    fire(type, options) {
        if (!this.canFire()) return;

        this.weapons.push(this.createWeapon(type, options));
    }

    render() {
        for (const weapon of this.weapons) {
            weapon.render();
        }
    }

    setCoolDown(val) {
        this.cooldown = val;
    }

    increaseHeat(val) {
        this.heat += val;
    }

    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= 1;
        }

        this.heat *= 0.99;


        for (const weapon of this.weapons) {
            weapon.update(dt, this);
            spatial.insert(weapon);
        }
    }

    createWeapon(type, options) {
        switch (type) {
            case "Pulse Canon":
                return new PulseCanon(options);
            default:
                throw new Error(`Unknown weapon type: ${type}`);
        }
    }

    destroy(weapon) {
        const index = this.weapons.indexOf(weapon);
        if (index > -1) {
            this.weapons.splice(index, 1);
        }
    }

}