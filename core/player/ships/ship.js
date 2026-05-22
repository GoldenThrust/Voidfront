import { canvas, canvasHeight, canvasWidth, ctx } from "../../world/canvas.js";
import { createVerticesPath, drawVertices, drawVerticesPath, tranformVertices } from "../../utils/vertices.js";
import { drawWrapped, inScreen, updateWrapped, worldToScreen, wrap } from "../../world/utils.js";
import { world } from "../../world/world.js";
import { randomNum } from "../../utils/random.js";
import Trail from "../object/trail.js";
import { clamp, clampAngle } from "../../utils/math.js";
import { keys } from "../../events/keys.js";
import { sizeOf } from "../../utils/constants.js";

import WeaponManager from "../../weapons/manager.js";
import { spatial } from "../../world/spatialHash.js";
import Explosion, { explosions } from "../prop/explosion.js";
import { shapes } from "./shapes.js";

const WORLD_MARGIN = world.width / 200;


export default class Ship {
    constructor({ x, y, width, height, angle, acceleration = 300, life = 100, vertices = shapes[0], color = "red", name = "Player", controllable = false, maxWeaponHeat = 10000 }) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.acceleration = clamp(acceleration, 0, 1000);
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;
        this.turnRate = 1 / (this.acceleration * 1000);

        this.name = name;

        this.dampSpeed = 0.999;

        this.controllable = controllable;

        this.lastTime = 0;
        this.trail = new Trail(Math.ceil(this.acceleration / 12), "white");

        this.weaponId = controllable ? 0 : Math.floor(randomNum(0, WeaponManager.weaponTypes.length));
        this.killScore = 0;

        this.vertices = vertices;

        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, 0, this.width, this.height, 0));

        this.life = 50 ?? life;

        this.cooldown = 0;
        this.heat = 0;
        this.maxHeat = maxWeaponHeat;
        this.weaponState = "cool";
    }

    canFire() {
        return (this.cooldown <= 0 && this.heat < this.maxHeat && this.weaponState === "cool")
    }

    render() {
        // if (this.controllable)
        //     console.log("Ship rendering");
        ctx.translate(world.width / 2, world.height / 2);
        this.trail.render();
        ctx.translate(-world.width / 2, -world.height / 2);

        drawWrapped({
            fn: () => {
                ctx.beginPath();
                ctx.roundRect(-this.width / 2, -this.height, 50, 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.roundRect(-this.width / 2, -this.height, this.life, 5);
                ctx.fill();
                ctx.rotate(-this.angle);

                drawVerticesPath(this.path2D, this.color);
            }, x: this.x, y: this.y, margin: {
                width: 200, height: 200
            }
        })
    }

    update(t, dt) {
        let rotation = 0;

        if (this.controllable) {
            if (keys["ArrowLeft"]) {
                rotation += this.speed * this.turnRate;
            }

            if (keys["ArrowRight"]) {
                rotation -= this.speed * this.turnRate;
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
            // console.log("Ship Moving", this.x, this.y);
        } else {
            this.speed = this.speed + (this.acceleration * dt);

            if (t - this.lastTime > randomNum(0, 10000) || !this.lastTime) {
                rotation += this.speed * randomNum(-this.turnRate, this.turnRate) * 20;
                this.lastTime = t;
            } else if (t - this.lastTime > randomNum(0, 60000)) {
                this.fire();
            }
        }


        this.speed = Math.max(this.speed * this.dampSpeed, 0);


        // updateWrapped(() => {
        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);

        this.trail.update(this.x, this.y, this.speed);

        this.angle = wrap(this.angle + rotation, Math.PI * 2);


        // weapon update
        if (this.cooldown > 0) {
            this.cooldown -= 1;
        }

        this.heat = clamp(this.heat - (this.maxHeat * 0.001), 0, this.maxHeat * 5);

        if (this.weaponState === "cool" && this.heat >= this.maxHeat) {
            this.weaponState = "hot";
        } else if (this.weaponState === "hot" && this.heat <= 0) {
            this.weaponState = "cool";
        }

    }

    fire() {
        if (!this.canFire()) return;

        const prop = {
            x: this.x - Math.sin(this.angle) * this.width / 2,
            y: this.y - Math.cos(this.angle) * this.height / 2,
            angle: this.angle,
            speed: this.speed,
            ship: this,
            color: this.controllable ? "#33cfff" : "red"
        }

        WeaponManager.fire(WeaponManager.weaponTypes[this.weaponId], prop)
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
