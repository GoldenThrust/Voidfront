import { clamp } from "../../../utils/math.js";
import Weapon from "../../../weapons/weapon.js";
import { spatial } from "../../../world/spatialHash.js";
import { toroidalAngle } from "../../../world/utils.js";
import { ship } from "../player.js";
import Ship from "../ship.js";
import EnemyManager from "./manager.js";

export default class EnemyShip extends Ship {
    constructor({ x, y, width, height, angle, acceleration, turnRate, life, vertices, color, name, controllable, weapon, maxWeaponHeat, state = "idle" }) {
        super({ x, y, width, height, angle, acceleration, weapon, turnRate, life, vertices, color, name, controllable, maxWeaponHeat })
        this.state = state;
        this.seekAcceleration = this.acceleration;
        this.fleeAcceleration = this.acceleration * 1.2;
    }

    destroy() {
        EnemyManager.destroy(this);
    }

    getDirection(obj, hardTurn) {
        let tangent = 0;
        if (this.state === "flee") {
            tangent = Math.PI / 2;
        } else {
            tangent = -Math.PI / 2;
        }

        const targetAngle = toroidalAngle(obj.x, obj.y, this.x, this.y);

        let diff = (targetAngle + this.angle) + tangent;


        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        this.angle -= clamp(diff, (this.speed * this.turnRate)) * (hardTurn ? 1 : 0.5);

        return diff;
    }

    closeWeapon(weapon) {
    }

    nearByWeapon() {
        const object = spatial.query(this.x, this.y, Math.ceil(this.height / spatial.cellSize) + 1);

        for (const element of object) {
            if (!(element instanceof Weapon && element.ship !== this)) return;
            console.log("in", element);
            this.state = "flee";

            const delta = this.getDirection(element, true);

            this.closeWeapon(element);
        }
    }

    update(t, dt) {
        super.update(t, dt);
        this.speed = this.speed + (this.acceleration * dt);

        this.nearByWeapon();
    }

    AI({ idleDistance, fleeCondition, seekCondition, fireCondition }) {

        if (idleDistance) {
            this.state = "idle"
            this.color = "violet";
            this.acceleration = this.seekAcceleration;
        } else if (fleeCondition) {
            this.state = "flee"
            this.color = "rgb(73, 95, 255)";
            this.acceleration = this.fleeAcceleration
        } else if (seekCondition) {
            this.acceleration = this.seekAcceleration;
            this.state = "seek";
            // this.color = "yellow";
            this.color = "rgb(116, 73, 255)";
        }


        if (["seek", "flee"].includes(this.state)) {
            const delta = this.getDirection(ship);
            if (delta < fireCondition.angle / 2 && fireCondition.others) {
                this.fire();
            }
        }
    }
}
