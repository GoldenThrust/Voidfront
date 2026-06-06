import { canvas, canvasHeight, canvasWidth, ctx } from "../../world/canvas.js";
import { createVerticesPath, drawVertices, drawVerticesPath, tranformVertices } from "../../utils/vertices.js";
import { drawWrapped, inScreen, updateWrapped, worldToScreen, wrap } from "../../world/utils.js";
import { world } from "../../world/world.js";
import { randomNum } from "../../utils/random.js";
import Trail from "../object/trail.js";
import { clamp, clampAngle } from "../../utils/math.js";
import { keys } from "../../events/keys.js";
import { sizeOf } from "../../utils/constants.js";

import WeaponManager, { weaponManager } from "../../weapons/manager.js";
import { spatial } from "../../world/spatialHash.js";
import Explosion, { explosions } from "../prop/explosion.js";
import { shapes } from "./shapes.js";
import PulseCanon from "../../weapons/pulse-canon.js";


const WORLD_MARGIN = world.width / 200;

export default class Ship {
    constructor({ x, y, width, height, angle, weapon = PulseCanon, acceleration = 100, turnRate = -1, life = 100, vertices = shapes[0], color = "red", name = "Player", controllable = false, maxWeaponHeat = 10000 }) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.acceleration = clamp(acceleration, 0, 1000);
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;
        this.turnRate = turnRate === -1 ? (1 / (this.acceleration * 1000)) : turnRate;

        this.name = name;

        this.dampSpeed = 0.999;

        this.controllable = controllable;

        this.lastTime = 0;
        this.trail = new Trail(Math.ceil(this.acceleration / 12), "white");

        this.weapon = weapon;
        this.killScore = 0;

        this.vertices = vertices;

        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, 0, this.width, this.height, 0));

        this.life = life;
        this.fullLife = life;

        this.cooldown = 0;
        this.heat = 0;
        this.maxHeat = maxWeaponHeat;
        this.weaponState = "cool";
    }

    render() {
        ctx.translate(world.width / 2, world.height / 2);
        this.trail.render();
        ctx.translate(-world.width / 2, -world.height / 2);

        drawWrapped({
            fn: () => {
                // draw life
                const scaleLife = this.life / this.fullLife * this.width;

                ctx.fillStyle = "springgreen";
                ctx.strokeStyle = "springgreen";

                ctx.beginPath();
                ctx.roundRect(-this.width / 2, -this.height, this.width, 3, 10);
                ctx.stroke();
                ctx.beginPath();
                ctx.roundRect(-this.width / 2, -this.height, scaleLife, 3, 10);
                ctx.fill();
                ctx.rotate(-this.angle);

                drawVerticesPath(this.path2D, this.color);
            }, x: this.x, y: this.y, margin: {
                width: 200, height: 200
            }
        })
    }

    update(t, dt) {
        if (this.controllable) {
            if (keys["ArrowLeft"]) {
                // this.angle = wrap(this.angle + 0.01, Math.PI * 2);
                this.angle = wrap(this.angle + this.speed * this.turnRate, Math.PI * 2);
            }

            if (keys["ArrowRight"]) {
                // this.angle = wrap(this.angle - 0.01, Math.PI * 2);
                this.angle = wrap(this.angle - this.speed * this.turnRate, Math.PI * 2);
            }


            if (keys["ArrowUp"]) {
                this.speed = this.speed + (this.acceleration * dt);
            }

            if (keys["ArrowDown"]) {
                this.speed = this.speed - (this.acceleration * dt);
            }

            if (keys[" "] || keys["Enter"] || keys["Space"]) {
                this.fire();
            }
        } else {
            if (this.state === "idle") {
                this.randomMotion(t, dt, this.name === "Player");
            }
        }


        this.speed = Math.max(this.speed * this.dampSpeed, 0);


        // updateWrapped(() => {
        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);

        this.trail.update(this.x, this.y, this.speed);

        // weapon update
        if (this.cooldown >= 0) {
            this.cooldown -= 1;
        }

        this.heat = clamp(this.heat - (this.maxHeat * 0.001), 0, this.maxHeat * 5);

        if (this.weaponState === "cool" && this.heat >= this.maxHeat) {
            this.weaponState = "hot";
        } else if (this.weaponState === "hot" && this.heat <= 0) {
            this.weaponState = "cool";
        }
    }

    randomMotion(t, dt, fire = true) {
        this.speed = this.speed + (this.acceleration * dt);

        if (t - this.lastTime > randomNum(0, 10000) || !this.lastTime) {
            this.angle = wrap(this.angle + this.speed * randomNum(-this.turnRate, this.turnRate) * 20, Math.PI * 2);
            this.lastTime = t;
        } else if (t - this.lastTime > randomNum(0, 60000) || fire) {
            this.fire();
        }

        if (t - this.lastTime > randomNum(0, 20000)) {
            weaponManager.nextWeapon();
        }
    }

    canFire() {
        return (this.cooldown <= 0 && this.heat < this.maxHeat && this.weaponState === "cool")
    }


    fire() {
        if (!this.canFire()) return;

        const prop = {
            x: this.x - Math.sin(this.angle) * this.width / 2,
            y: this.y - Math.cos(this.angle) * this.height / 2,
            angle: this.angle,
            speed: this.speed,
            ship: this,
            color: this.name === "Player" ? "#33cfff" : "red"
        }

        WeaponManager.fire(this.weapon, prop)
    }


    setCoolDown(val) {
        this.cooldown = val;
    }

    increaseHeat(val) {
        this.heat += val;
    }

    setMaxHeat() {
        this.weaponState = "hot";
    }


    destroy() {
        console.log("Game Over");
    }

    getVertices() {
        const world = worldToScreen(this.x, this.y);
        const vertices = tranformVertices(this.vertices, world.x, world.y, this.width, this.height, this.angle);

        return vertices;
    }
}


export const destroyedShips = []
