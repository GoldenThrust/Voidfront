import { clamp } from "../../../utils/math.js";
import { canvas } from "../../../world/canvas.js";
import { toroidalAngle, toroidalDistance, updateWrapped } from "../../../world/utils.js";
import { ship } from "../player.js";
import { shapes } from "../shapes.js";
import EnemyShip from "./enemy.js";

const rTD = (r) => 180 / Math.PI * r;
export default class ScoutDrone extends EnemyShip {
    constructor({ x = 10, y = 20, angle = 0 }) {
        super({ x, y, width: 40, height: 40, angle, acceleration: 600, color: "purple", vertices: shapes[1], name: "Scout Drone", maxWeaponHeat: 1000 });
    }


    update(t, dt) {
        const targetAngle = toroidalAngle(ship.x, ship.y, this.x, this.y);


        // console.log("Rotation", targetAngle, rTD(targetAngle))
        super.update(t, dt);

        updateWrapped({
            fn: () => {
                const dist = toroidalDistance(this.x, this.y, ship.x, ship.y);

                if (dist > 10 ** 10) {
                    this.state = "idle"
                    this.color = "violet";
                    this.acceleration = this.seekAcceleration;
                } else if (dist < 6 ** 6 || this.weaponState === "hot" ) {
                    this.state = "flee"
                    this.color = "rgb(73, 95, 255)";
                    this.acceleration = this.fleeAcceleration
                } else if ((this.state === "flee" && dist > 7 ** 7) || this.state !== "flee") {
                    this.acceleration = this.seekAcceleration;
                    this.state = "seek";
                    // this.color = "yellow";
                    this.color = "rgb(116, 73, 255)";
                }

                if (["seek", "flee"].includes(this.state)) {
                    let tangent = 0;
                    if (this.state === "flee") {
                        tangent = Math.PI / 2;
                    } else {
                        tangent = -Math.PI / 2;
                    }

                    const targetAngle = toroidalAngle(ship.x, ship.y, this.x, this.y);

                    let diff = (targetAngle + this.angle) + tangent;


                    diff = Math.atan2(Math.sin(diff), Math.cos(diff));

                    this.angle -= clamp(diff, (this.speed * this.turnRate)) * 0.5;

                    if (Math.abs(diff) < 0.3 && dist < 1000000) {
                        this.fire();
                    }

                    this.speed = this.speed + (this.acceleration * dt);
                }
            }, x: this.x, y: this.y, margin: {
                width: 3500,
                height: 3500
            }
        })
    }
}