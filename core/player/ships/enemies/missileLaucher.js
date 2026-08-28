import { assets } from "../../../assets/main.js";
import { clamp } from "../../../utils/math.js";
import HomingMissile from "../../../weapons/HomingMissile.js";
import { canvas } from "../../../world/canvas.js";
import { toroidalAngle, toroidalDistance, updateWrapped } from "../../../world/utils.js";
import { ship } from "../player.js";
import { shapes } from "../shapes.js";
import EnemyShip from "./enemy.js";

export default class MissileLaucher extends EnemyShip {
    constructor({ x = 10, y = 20, angle = 0 }) {
        super({ x, y, width: 50, height: 50, angle, acceleration: 700, color: "gold", vertices: shapes[6], name: "Missile Laucher", maxWeaponHeat: 3000, life: 150, weapon: HomingMissile, img: assets?.images?.missilelauchership, flameImg: assets?.images?.flame5 });
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
                    idleDistance: dist > 10 ** 12, fleeCondition: dist < 80000, seekCondition: (this.state === "flee" && dist > 10 ** 7) || this.state !== "flee", fireCondition: {
                        func: (delta) => Math.abs(delta) < Math.PI / 2,
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