import Ship from "../player/ships/ship.js";
import { worldSize } from "../utils/constants.js";
import { clamp } from "../utils/math.js";
import { randomNum } from "../utils/random.js";
import { spatial } from "../world/spatialHash.js";
import { toroidalDelta, toroidalDistance, wrap } from "../world/utils.js";
import { world } from "../world/world.js";
import WeaponManager from "./manager.js";
import PlasmaCanon from "./plasmaCanon.js";

export default class HomingMissile extends PlasmaCanon {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Homing Missile",
            speed: speed,
            acceleration: 10000,
            x: x,
            y: y,
            width: 20,
            height: 60,
            angle: angle,
            damage: 5,
            range: 50000,
            fireRate: 0.002,
            energyCost: 300,
            ship,
            color
        });

        this.target = null;
        this.turnRate = 0.005;
    }

    trackEnemy() {
        if (!this.target || this.target?.state === "dead" || this.distanceTraveled <= 200) return;

        // direction to target
        const dx = toroidalDelta(this.target.x, this.x, world.width);
        const dy = toroidalDelta(this.target.y, this.y, world.height);
        // const dx = this.target.x - this.x;
        // const dy = this.target.y - this.y;

        const targetAngle = Math.atan2(dy, dx);

        // smooth rotation toward target
        let diff = targetAngle + this.angle;

        // normalize angle (-PI to PI)
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        // limit rotation speed
        this.angle += clamp(diff, this.turnRate)
        // this.angle += Math.max(-this.turnRate, Math.min(this.turnRate, diff));
    }

    update(dt, manager) {
        this.trackEnemy(dt);
        super.update(dt, manager);
    }


    closeObject(obj) {
        // if (this.target) return;
        if (!(obj instanceof Ship)) return;
        const targetDistance = this.target ? toroidalDistance(this.target.x, this.target.y, this.x, this.y) : Infinity;
        const newDistance = toroidalDistance(obj.x, obj.y, this.x, this.y);


        this.target = targetDistance > newDistance ? obj : this.target;
    }
}