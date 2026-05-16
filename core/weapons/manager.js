import { clamp } from "../utils/math.js";
import GatlingGun from "./gatlingGun.js";
import HeavyRailGun from "./heavyRailGun.js";
import PlasmaCanon from "./plasmaCanon.js";
import PulseCanon from "./pulse-canon.js";

export default class WeaponManager {
    constructor(maxHeat = 100) {
        this.weapons = [];
        this.cooldown = 0;
        this.heat = 0;
        this.maxHeat = maxHeat;
        this.state = "cool";
    }

    canFire() {
        return (this.cooldown <= 0 && this.heat < this.maxHeat && this.state === "cool")
    }

    fire(Weapon, options, force = false) {
        if (!force && !this.canFire()) return;

        this.weapons.push(new Weapon(options, force));
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

        this.heat = clamp(this.heat  - (this.maxHeat * 0.001), 0, this.maxHeat * 5);
        // this.heat *= 0.99;

        if (this.state === "cool" && this.heat >= this.maxHeat) {
            this.state = "hot";
        } else if (this.state === "hot" && this.heat <= 0) {
            this.state = "cool";
        }

        // console.log(this.heat, this.maxHeat, this.heat/this.maxHeat * 100, this.state);

        for (const weapon of this.weapons) {
            weapon.update(dt, this);
        }
    }

    // createWeapon(type, options) {
    //     switch (type) {
    //         case "Pulse Canon":
    //             return new PulseCanon(options);
    //         case "Gatling Gun":
    //             return new GatlingGun(options);
    //         default:
    //             throw new Error(`Unknown weapon type: ${type}`);
    //     }
    // }

    destroy(weapon) {
        const index = this.weapons.indexOf(weapon);
        if (index > -1) {
            this.weapons.splice(index, 1);
        }
    }
}

// Todo: createWeapon pool
export const weaponTypes = [PulseCanon, GatlingGun, HeavyRailGun, PlasmaCanon];
