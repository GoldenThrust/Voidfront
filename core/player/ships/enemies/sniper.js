import { assets } from "../../../assets/main.js";
import { clamp } from "../../../utils/math.js";
import HeavyRailGun from "../../../weapons/heavyRailGun.js";
import { canvas } from "../../../world/canvas.js";
import { toroidalAngle, toroidalDistance, updateWrapped } from "../../../world/utils.js";
import { ship } from "../player.js";
import { shapes } from "../shapes.js";
import EnemyShip from "./enemy.js";

const rTD = (r) => 180 / Math.PI * r;
export default class Sniper extends EnemyShip {
    constructor({ x = 10, y = 20, angle = 0 }) {
        super({ x, y, width: 50, height: 50, angle, acceleration: 1000, color: "red", vertices: shapes[3], name: "Sniper", maxWeaponHeat: 20000, life: 100, weapon: HeavyRailGun, img: assets?.images?.snipership, flameImg: assets?.images?.flame1 });
        this.seekAcceleration = this.acceleration;
        this.fleeAcceleration = this.acceleration * 0.9;
    }

    update(t, dt) {
        updateWrapped({
            fn: () => {
                const dist = toroidalDistance(this.x, this.y, ship.x, ship.y);
                super.update(t, dt);
                this.AI({
                    idleDistance: dist > 11 ** 11, fleeCondition: dist < 150000, seekCondition: (this.state === "flee" && dist > 8 ** 10) || this.state !== "flee", fireCondition: {
                        func: (delta) => Math.abs(delta) < Math.PI / 32,
                        others: dist < 10000000,
                    }
                })
            }, x: this.x, y: this.y, margin: {
                width: 5000,
                height: 5000
            }
        })
    }
}