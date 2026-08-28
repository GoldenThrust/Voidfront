import { clamp } from "../../../utils/math.js";
import Weapon from "../../../weapons/weapon.js";
import { spatial } from "../../../world/spatialHash.js";
import { toroidalAngle, toroidalDirection, toroidalDistance } from "../../../world/utils.js";
import { ship } from "../player.js";
import Ship from "../ship.js";
import EnemyManager from "./manager.js";

export default class EnemyShip extends Ship {
    constructor({ x, y, width, height, angle, acceleration, turnRate = 2, life, vertices, color, name, controllable, weapon, maxWeaponHeat, state = "idle", img, flameImg }) {
        super({ x, y, width, height, angle, acceleration, weapon, turnRate, life, vertices, color, name, controllable, maxWeaponHeat, img, flameImg })
        this.state = state;
        this.seekAcceleration = this.acceleration;
        this.fleeAcceleration = this.acceleration * 1.2;
    }

    destroy() {
        EnemyManager.destroy(this);
    }

    follow(obj) {
        let tangent = 0;
        if (this.state === "flee") {
            tangent = Math.PI / 2;
        } else {
            tangent = -Math.PI / 2;
        }

        const diff = toroidalDirection(obj.x, obj.y, this.x, this.y, this.angle, tangent);

        this.angle -= clamp(diff, this.turnRate);

        return diff;
    }

    // respond to close Weapon
    // alpha: weapon face ship
    // beta: weapon back ship
    // dist: dist from ship
    closeWeapon(weapon, dist, alpha) {
        if (dist > 7 ** 7) return;
        if (Math.abs(alpha - Math.PI / 2) < Math.PI / 16) {
            this.fire();
        }

        const beta = alpha + Math.PI / 2;

        this.angle -= clamp(beta, this.turnRate * 0.5);
    }

    nearByWeapon() {
        const object = spatial.query(this.x, this.y, Math.ceil(this.height / spatial.cellSize) + 1);

        for (const weapon of object) {
            if (weapon instanceof Weapon && weapon.ship !== this) {
                const dist = toroidalDistance(weapon.x, weapon.y, this.x, this.y);
                if (dist > 8 ** 8) continue;

                const alpha = toroidalDirection(weapon.x, weapon.y, this.x, this.y, this.angle);

                this.closeWeapon(weapon, dist, alpha);
            }
        }
    }

    update(t, dt, thrust = 0, turn = 0) {
        super.update(t, dt, thrust, turn);
        if (this.state !== "AI") {
            this.speed = this.speed + (this.acceleration * dt);

            this.nearByWeapon();
        }
    }

    AI({ idleDistance, fleeCondition, seekCondition, fireCondition, }) {
        if (idleDistance) {
            this.state = "idle"
            this.acceleration = this.seekAcceleration;
        } else if (fleeCondition) {
            this.state = "flee";
            this.acceleration = this.fleeAcceleration
        } else if (seekCondition) {
            this.acceleration = this.seekAcceleration;
            this.state = "seek";
        }

        if (["seek", "flee"].includes(this.state)) {
            const delta = this.follow(ship);
            if (fireCondition.others && fireCondition.func(delta)) {
                this.fire();
            }
        }
    }
}
