import { clamp } from "../utils/math.js";
import { isPromise } from "../utils/misc.js";
import PulseCanon from "./pulse-canon.js";
import GatlingGun from "./gatlingGun.js";
import HeavyRailGun from "./heavyRailGun.js";
import PlasmaCanon from "./plasmaCanon.js";
import Mine from "./mine.js";
import HomingMissile from "./HomingMissile.js";
import { keybinds } from "../events/keybind.js";
import { world } from "../world/world.js";
import { worldManager } from "../world/manager.js";

export default class WeaponManager {
    constructor() {
        this.#addKeybinds();
    }

    static weaponTypes = [PulseCanon, GatlingGun, HeavyRailGun, PlasmaCanon, HomingMissile, Mine];

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


    #addKeybinds() {
        keybinds["q"] = () => {
            this.previousWeapon();
        }
        keybinds["e"] = () => {
            this.nextWeapon();
        }
    }

    nextWeapon() {
        const ship = worldManager.findAttachedShip();
        const currentWeaponId = WeaponManager.weaponTypes.findIndex(w => w === ship.weapon) + 1;

        const nextWeapon = WeaponManager.weaponTypes[currentWeaponId] || WeaponManager.weaponTypes[0];

        this.changeWeapon(nextWeapon);
    }

    previousWeapon() {
        const ship = worldManager.findAttachedShip();

        const currentWeaponId = WeaponManager.weaponTypes.findIndex(w => w === ship.weapon) - 1;
        const previousWeapon = WeaponManager.weaponTypes[currentWeaponId] || WeaponManager.weaponTypes[WeaponManager.weaponTypes.length - 1];

        this.changeWeapon(previousWeapon);
    }

    changeWeapon(weapon) {
        worldManager.findAttachedShip().weapon = weapon;
    }
}

// Todo: createWeapon pool
export const weaponManager = new WeaponManager();