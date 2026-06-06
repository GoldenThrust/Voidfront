import { clamp } from "../../../utils/math.js";
import PlasmaCanon from "../../../weapons/plasmaCanon.js";
import { canvas } from "../../../world/canvas.js";
import { toroidalAngle, toroidalDistance, updateWrapped } from "../../../world/utils.js";
import { ship } from "../player.js";
import { shapes } from "../shapes.js";
import EnemyShip from "./enemy.js";

export default class Bomber extends EnemyShip {
    constructor({ x = 10, y = 20, angle = 0 }) {
        super({ x, y, width: 50, height: 50, angle, acceleration: 300, color: "blue", vertices: shapes[4], name: "Bomber Drone", maxWeaponHeat: 10000, life: 200, weapon: PlasmaCanon });
        this.seekAcceleration = this.acceleration;
        this.fleeAcceleration = this.acceleration * 0.9;
    }

    update(t, dt) {
        // const targetAngle = toroidalAngle(ship.x, ship.y, this.x, this.y);
        updateWrapped({
            fn: () => {
                const dist = toroidalDistance(this.x, this.y, ship.x, ship.y);
                super.update(t, dt);
                this.AI({
                    idleDistance: dist > 10 ** 12, fleeCondition: dist < 40000, seekCondition: (this.state === "flee" && dist > 10 ** 7) || this.state !== "flee", fireCondition: {
                        func: (delta) => Math.abs(delta) < Math.PI / 6,
                        others: dist < 5000000,
                    }
                })
            }, x: this.x, y: this.y, margin: {
                width: 4000,
                height: 4000
            }
        })
    }
}