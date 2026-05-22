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

const WORLD_MARGIN = world.width / 200;


export default class Ship {
    constructor({ x, y, width, height, angle, acceleration = 300, life = 100, color = "red", controllable = false, maxWeaponHeat = 10000 }) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.acceleration = clamp(acceleration, 0, 1000);
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;
        this.turnRate = 1 / (this.acceleration * 1000);

        this.dampSpeed = 0.999;

        this.controllable = controllable;

        this.lastTime = 0;
        this.trail = new Trail(Math.ceil(this.acceleration / 12), "white");

        this.weaponId = controllable ? 0 : Math.floor(randomNum(0, WeaponManager.weaponTypes.length));
        this.killScore = 0;

        this.vertices = [
            {
                "x": 0.23006134969325154,
                "y": -1
            },
            {
                "x": -0.23006134969325154,
                "y": -0.99079754601227
            },
            {
                "x": -0.23006134969325154,
                "y": -0.3834355828220859
            },
            {
                "x": -0.9969325153374233,
                "y": -0.3773006134969325
            },
            {
                "x": -0.9969325153374233,
                "y": 0.08588957055214724
            },
            {
                "x": -0.23006134969325154,
                "y": 0.0736196319018405
            },
            {
                "x": -0.23006134969325154,
                "y": 0.6226993865030674
            },
            {
                "x": -0.6104294478527608,
                "y": 0.6226993865030674
            },
            {
                "x": -0.6104294478527608,
                "y": 1
            },
            {
                "x": 0.6257668711656442,
                "y": 1
            },
            {
                "x": 0.6196319018404908,
                "y": 0.6230061349693252
            },
            {
                "x": 0.2331288343558282,
                "y": 0.6226993865030674
            },
            {
                "x": 0.23006134969325154,
                "y": 0.0705521472392638
            },
            {
                "x": 0.9969325153374233,
                "y": 0.07668711656441718
            },
            {
                "x": 0.9969325153374233,
                "y": -0.3895705521472393
            },
            {
                "x": 0.2331288343558282,
                "y": -0.3803680981595092
            }
        ]

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
