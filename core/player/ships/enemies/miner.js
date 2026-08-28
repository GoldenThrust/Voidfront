import { assets } from "../../../assets/main.js";
import { FIXED_DT } from "../../../utils/constants.js";
import { clamp, lerp } from "../../../utils/math.js";
import Mine from "../../../weapons/mine.js";
import { toroidalDistance, updateWrapped, wrap } from "../../../world/utils.js";
import { ship } from "../player.js";
import { shapes } from "../shapes.js";
import EnemyShip from "./enemy.js";

export default class Miner extends EnemyShip {
    constructor({ x = 10, y = 20, angle = 0 }) {
        super({ x, y, width: 50, height: 50, angle, acceleration: 1000, color: "azure", vertices: shapes[5], name: "Miner Drone", maxWeaponHeat: 100, life: 300, weapon: Mine, img: assets?.images?.minership, flameImg: assets?.images?.flame4 });
        this.seekAcceleration = this.acceleration;
        this.fleeAcceleration = this.acceleration * 0.9;
    }

    closeWeapon(weapon, dist, alpha) {
        if (dist > 7 ** 7) return;
        if (Math.abs(alpha + Math.PI / 2) < Math.PI / 8) {
            this.fire();
        }

        const beta = alpha + Math.PI / 2;

        const delta = Math.atan2(Math.sin(beta), Math.cos(beta));

        this.angle = wrap(lerp(this.angle, this.angle - clamp(delta, -this.turnRate, this.turnRate) * FIXED_DT * this.speed_factor, 0.3), Math.PI * 2);
    }

    update(t, dt) {
        // const targetAngle = toroidalAngle(ship.x, ship.y, this.x, this.y);
        updateWrapped({
            fn: () => {
                const dist = toroidalDistance(this.x, this.y, ship.x, ship.y);
                super.update(t, dt);
                this.AI({
                    idleDistance: dist > 10 ** 12, fleeCondition: this.weaponState === "hot", seekCondition: (this.state === "flee" && dist > 10 ** 7) || this.state !== "flee", fireCondition: {
                        func: (delta) => Math.abs(delta + Math.PI) < Math.PI / 2,
                        others: dist < 500000,
                    }
                })
            }, x: this.x, y: this.y, margin: {
                width: 4000,
                height: 4000
            }
        })
    }
}