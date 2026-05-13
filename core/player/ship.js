import { canvas, canvasHeight, canvasWidth, ctx } from "../world/canvas.js";
import { createVerticesPath, drawVertices, drawVerticesPath, tranformVertices } from "../utils/vertices.js";
import { drawWrapped, inScreen, updateWrapped, worldToScreen, wrap } from "../world/utils.js";
import { world } from "../world/world.js";
import { randomNum } from "../utils/random.js";
import Trail from "./object/trail.js";
import { clamp, clampAngle } from "../utils/math.js";
import { keys } from "../events/keys.js";
import { sizeOf } from "../utils/constants.js";

import PulseCanon from "../weapons/pulse-canon.js";
import WeaponManager from "../weapons/manager.js";

const WORLD_MARGIN = world.width / 200;
export default class Ship {
    constructor({ x, y, width, height, angle, acceleration = 10000, maxSpeed = 20000, color = "red", controllable = false, maxWeaponHeat = 100 }) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.acceleration = acceleration;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;
        this.turnRate = 0.00001;

        this.maxSpeed = maxSpeed;
        this.dampSpeed = 0.99;

        this.controllable = controllable;

        this.lastTime = 0;
        this.trail = new Trail(this.maxSpeed / this.acceleration, "white");

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
        this.weaponManager = new WeaponManager(maxWeaponHeat)
    }

    render() {
        this.weaponManager.render();

        ctx.translate(world.width / 2, world.height / 2);
        this.trail.render();
        ctx.translate(-world.width / 2, -world.height / 2);

        drawWrapped({
            fn: () => {
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
                this.speed = clamp(this.speed + (this.acceleration * dt), 0, this.maxSpeed);
            }

            if (keys["ArrowDown"]) {
                this.speed = clamp(this.speed - (this.acceleration * dt), 0, this.maxSpeed);
            }

            if (keys[" "] || keys["Enter"] || keys["Space"]) {
                this.fire();
            }
        } else {
            this.speed = clamp(this.speed + (this.acceleration * dt), 0, this.maxSpeed);

            if (t - this.lastTime > randomNum(0, 10000) || !this.lastTime) {
                rotation += this.speed * randomNum(-this.turnRate, this.turnRate) * 10;
                this.lastTime = t;
            } else if (t - this.lastTime > randomNum(100, 10000)) {
                this.fire();
            }
        }

        this.speed = this.speed * this.dampSpeed;

        // this.speed = 5;

        // updateWrapped(() => {
        this.x = wrap(this.x - Math.sin(this.angle) * (this.speed * dt), world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * (this.speed * dt), world.height);


        this.trail.update(this.x, this.y, this.speed);

        this.angle = wrap(this.angle + rotation, Math.PI * 2);

        this.weaponManager.update(dt);

        // this.angle = this.controllable ? clampAngle(this.angle, -Math.PI/3, Math.PI/3) : this.angle;
        // }, this.x, this.y, {
        //     width: 100,
        //     height: 100
        // })
    }

    fire() {
        this.weaponManager.fire("Pulse Canon", {
            // x: this.x,
            // y: this.y,
            x: this.x - Math.sin(this.angle) * this.width,
            y: this.y - Math.cos(this.angle) * this.height,
            angle: this.angle,
            speed: this.speed,
            ship: this
        })
    }

    getVertices() {
        const world = worldToScreen(this.x, this.y);
        const vertices = tranformVertices(this.vertices, world.x, world.y, this.width, this.height, this.angle);

        return vertices;
    }
}

export const ship = new Ship({ x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 40, height: 40, color: "#84d0ff", controllable: false });

export const ships = [];

for (let i = 0; i < sizeOf.ship; i++) {
    ships.push(new Ship({ x: randomNum(0, world.width), y: randomNum(0, world.height), angle: randomNum(-Math.PI * 2, Math.PI * 2), width: 40, height: 40, color: "blue" }));
}