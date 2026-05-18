import { clamp } from "../utils/math.js";
import { isPromise } from "../utils/misc.js";
// import GatlingGun from "./gatlingGun.js";
// import HeavyRailGun from "./heavyRailGun.js";
// import PlasmaCanon from "./plasmaCanon.js";
// import PulseCanon from "./pulse-canon.js";

export default class WeaponManager {
    // static weaponTypes = [PulseCanon, GatlingGun, HeavyRailGun, PlasmaCanon];
    static weaponTypes = [import("./pulse-canon.js"), import("./gatlingGun.js"), import("./heavyRailGun.js"), import("./plasmaCanon.js")];

    static weapons = [];

    static async fire(weapon, options, force = false) {
        let Weapon = weapon;
        if (isPromise(weapon)) {
            Weapon = (await weapon).default;
            const index = WeaponManager.weapons.indexOf(weapon);
            if (index > -1) {
                WeaponManager.weapons[index] = Weapon.constructor;
            }
        }

        WeaponManager.weapons.push(new Weapon(options, force));
    }

    static render() {
        for (const weapon of WeaponManager.weapons) {
            weapon.render();
        }
    }

    static update(dt) {
        for (const weapon of WeaponManager.weapons) {
            weapon.update(dt,);
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