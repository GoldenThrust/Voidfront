import { clamp } from "../../../utils/math.js";
import Weapon from "../../../weapons/weapon.js";
import { spatial } from "../../../world/spatialHash.js";
import { toroidalAngle, toroidalDirection, toroidalDistance } from "../../../world/utils.js";
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

    follow(obj, hardTurn) {
        let tangent = 0;
        if (this.state === "flee") {
            tangent = Math.PI / 2;
        } else {
            tangent = -Math.PI / 2;
        }

        const diff = toroidalDirection(obj.x, obj.y, this.x, this.y, this.angle, tangent);

        this.angle -= clamp(diff, (this.speed * this.turnRate)) * (hardTurn ? 1 : 0.5);

        return diff;
    }

    closeWeapon(weapon, diff) {
        if (Math.abs(diff) < Math.PI / 8) {
            this.fire();
        }
    }

    nearByWeapon() {
        const object = spatial.query(this.x, this.y, Math.ceil(this.height / spatial.cellSize) + 1);

        for (const weapon of object) {
            if (weapon instanceof Weapon && weapon.ship !== this) {
                const dist = toroidalDistance(weapon.x, weapon.y, this.x, this.y);
                if (dist > 8 ** 8) continue;

                const diff = toroidalDirection(weapon.x, weapon.y, this.x, this.y, this.angle, Math.PI / 2);

                if (Math.abs(diff) < Math.PI / 4 || dist < 6 ** 6) {
                    this.angle -= clamp(diff, (this.speed * this.turnRate)) * 0.5;
                    this.color = "yellow";
                };

                this.closeWeapon(weapon, diff);
            }
        }
    }

    update(t, dt) {
        super.update(t, dt);
        // this.speed = this.speed + (this.acceleration * dt);

        this.nearByWeapon();
    }

    AI({ idleDistance, fleeCondition, seekCondition, fireCondition, }) {

        if (idleDistance) {
            this.state = "idle"
            this.color = "blue";
            this.acceleration = this.seekAcceleration;
        } else if (fleeCondition) {
            this.state = "flee";
            this.color = "springgreen";
            this.acceleration = this.fleeAcceleration
        } else if (seekCondition) {
            this.acceleration = this.seekAcceleration;
            this.state = "seek";
            this.color = "red";
        }

        if (["seek", "flee"].includes(this.state)) {
            const delta = this.follow(ship);
            if (fireCondition.others && fireCondition.func(delta)) {
                this.fire();
            }
        }
    }
}
