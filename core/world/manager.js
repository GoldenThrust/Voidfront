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

        keybinds["="] = () => {
            world.zoom(1.1);
        }
        keybinds["-"] = () => {
            world.zoom(0.9);
        }
    }


    findAttachedShip() {
        if (this.attachedId === -1) {
            return ship
        } else {
            return EnemyManager.ships[this.attachedId];
        }
    }

    attachRandom() {
        this.attachedId = Math.floor(Math.random() * EnemyManager.ships.length);
        world.attach(EnemyManager.ships[this.attachedId]);
    }

    attachNext() {
        this.attachedId = (this.attachedId + 1) % EnemyManager.ships.length;
        world.attach(EnemyManager.ships[this.attachedId]);
    }

    attachPrevious() {
        this.attachedId = (this.attachedId - 1 + EnemyManager.ships.length) % EnemyManager.ships.length;
        world.attach(EnemyManager.ships[this.attachedId]);
    }

    attachMainShip() {
        this.attachedId = -1;
        world.attach(ship);
    }
}

export const worldManager = new WorldManager();