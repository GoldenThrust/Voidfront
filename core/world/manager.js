import { world } from "./world.js";
import EnemyManager from "../player/ships/enemies/manager.js";
import { keybinds } from "../events/keybind.js";
import { ship } from "../player/ships/player.js";
import WeaponManager from "../weapons/manager.js";

class WorldManager {
    constructor() {
        this.attachedId = -1;
        this.#addKeybinds();
    }

    #addKeybinds() {
        keybinds["5"] = () => {
            this.attachNext();
        }
        keybinds["6"] = () => {
            this.attachPrevious();
        }
        keybinds["7"] = () => {
            this.attachMainShip();
        }
        keybinds["8"] = () => {
            this.attachRandom();
        }

        keybinds["q"] = () => {
            this.previousWeapon();
        }
        keybinds["e"] = () => {
            this.nextWeapon();
        }
    }

    nextWeapon() {
        const currentWeaponId = WeaponManager.weaponTypes.findIndex(w => w === ship.weapon) + 1;

        const nextWeapon = WeaponManager.weaponTypes[currentWeaponId] || WeaponManager.weaponTypes[0];

        this.changeWeapon(nextWeapon);
    }

    previousWeapon() {
        const currentWeaponId = WeaponManager.weaponTypes.findIndex(w => w === ship.weapon) - 1;
        const previousWeapon = WeaponManager.weaponTypes[currentWeaponId] || WeaponManager.weaponTypes[WeaponManager.weaponTypes.length - 1];

        this.changeWeapon(previousWeapon);
    }

    changeWeapon(weapon) {
        if (this.attachedId === -1) {
            ship.weapon = weapon;
        } else {
            EnemyManager.ships[this.attachedId].weapon = weapon;
        }
    }

    attachRandom() {
        this.attachedId = Math.floor(Math.random() * EnemyManager.ships.length);
        world.attach({ obj: EnemyManager.ships[this.attachedId] });
    }

    attachNext() {
        this.attachedId = (this.attachedId + 1) % EnemyManager.ships.length;
        world.attach({ obj: EnemyManager.ships[this.attachedId] });
    }

    attachPrevious() {
        this.attachedId = (this.attachedId - 1 + EnemyManager.ships.length) % EnemyManager.ships.length;
        world.attach({ obj: EnemyManager.ships[this.attachedId] });
    }

    attachMainShip() {
        this.attachedId = -1;
        world.attach({ obj: ship });
    }
}

export const worldManager = new WorldManager();