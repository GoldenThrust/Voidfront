import { clamp } from "../../../utils/math.js";
import { canvas } from "../../../world/canvas.js";
import { toroidalAngle, toroidalDistance, updateWrapped } from "../../../world/utils.js";
import { ship } from "../player.js";
import { shapes } from "../shapes.js";
import EnemyShip from "./enemy.js";

export default class ScoutDrone extends EnemyShip {
    constructor({ x = 10, y = 20, angle = 0}) {
        super({ x, y, width: 40, height: 40, angle, acceleration: 200, color: "purple", vertices: shapes[1], name: "Scout Drone", maxWeaponHeat: 1000 });
    }

  
    update(t, dt) {
        if (this.state === "idle") super.update(t, dt);

        updateWrapped({
            fn: () => {
                if (toroidalDistance(ship.x, ship.y, this.x, this.y) < 1000) this.state = "scout";
                else this.state = "seek";

                if (this.state === "seek") {
                    const targetAngle = toroidalAngle(ship.x, ship.y, this.x, this.y);

                    let diff = targetAngle - this.angle;

                    diff = Math.atan2(Math.sin(diff), Math.cos(diff));

                    this.angle += clamp(diff, this.turnRate);
                }
            }, x: this.x, y: this.y, screen: {
                width: canvas.width * 2,
                height: canvas.height * 2
            }
        })
    }
}