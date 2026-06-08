import { worldSize } from "../utils/constants.js";
import { clamp } from "../utils/math.js";
import { randomNum } from "../utils/random.js";
import { spatial } from "../world/spatialHash.js";
import { toroidalDelta, toroidalDistance, wrap } from "../world/utils.js";
import { world } from "../world/world.js";
import PlasmaCanon from "./plasmaCanon.js";
import Ship from "../player/ships/ship.js";
import Mine from "./mine.js";
import Asteroid from "../world/object/asteroid/asteroid.js";


export default class HomingMissile extends PlasmaCanon {
    constructor({ x, y, angle, ship, color, speed = 10 }) {
        super({
            name: "Homing Missile",
            speed: speed,
            acceleration: 15000,
            x: x,
            y: y,
            width: 20,
            height: 60,
            angle: angle,
            damage: 5,
            range: 25000,
            fireRate: 0.005,
            energyCost: 1000,
            ship,
            color
        });

        this.target = null;
        this.turnRate = 0.01;
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
        let diff = (targetAngle + this.angle) + Math.PI / 2;

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
        // if (this.ship instanceof EnemyShip && obj instanceof EnemyShip) return;
        // if (this.ship instanceof PlayerShip && obj instanceof PlayerShip) return;
        // else if (!(this.ship instanceof PlayerShip) && !(obj instanceof PlayerShip))
        if (obj instanceof Asteroid) return;
        const targetDistance = this.target ? toroidalDistance(this.target.x, this.target.y, this.x, this.y) : Infinity;
        const newDistance = toroidalDistance(obj.x, obj.y, this.x, this.y);


        this.target = targetDistance > newDistance ? obj : this.target;
    }
}