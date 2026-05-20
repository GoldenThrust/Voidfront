import { clamp } from "../utils/math.js";
import { isPromise } from "../utils/misc.js";
import GatlingGun from "./gatlingGun.js";
import HeavyRailGun from "./heavyRailGun.js";
import { Laser } from "./Laser.js";
import PlasmaCanon from "./plasmaCanon.js";
import PulseCanon from "./pulse-canon.js";

export default class WeaponManager {
    // static weaponTypes = [Laser];
    static weaponTypes = [PulseCanon, GatlingGun, HeavyRailGun, PlasmaCanon, Laser];

    static weapons = [];

    static fire(Weapon, options, force = false) {
        WeaponManager.weapons.push(new Weapon(options, force));
    }

    static render() {
        for (const weapon of WeaponManager.weapons) {
            weapon.render();
        }
    }

    static update(t, dt) {
        for (const weapon of WeaponManager.weapons) {
            weapon.update(t, dt);
        }
    }

    static destroy(weapon) {
        const index = WeaponManager.weapons.indexOf(weapon);
        if (index > -1) {
            WeaponManager.weapons.splice(index, 1);
        }
    }
}

// Todo: createWeapon pool