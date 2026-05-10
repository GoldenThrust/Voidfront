import { canvas, canvasHeight, canvasWidth, ctx } from "../world/space/canvas.js";
import { createVerticesPath, drawVertices, drawVerticesPath, tranformVertices } from "../utils/vertices.js";
import { drawWrapped, inScreen, updateWrapped, worldToScreen, wrap } from "../world/utils.js";
import { world } from "../world/world.js";
import { randomNum } from "../utils/random.js";
import Trail from "./object/trail.js";
import { clamp, clampAngle } from "../utils/math.js";
import { keys } from "../events/keys.js";
import { sizeOf } from "../utils/constants.js";

const WORLD_MARGIN = world.width / 200;
export default class Ship {
    constructor({ x, y, width, height, angle, speed = 0, acceleration = 2, maxSpeed = 15, color = "red", controllable = false }) {
        console.log(color);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.acceleration = acceleration;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;

        this.maxSpeed = maxSpeed;
        this.controllable = controllable;


        this.lastTime = 0;
        this.trail = new Trail(this.maxSpeed / this.acceleration * 2, "white");


        this.vertices = tranformVertices([
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
        ], 0, 0, this.width, this.height, 0);

        this.path2D = createVerticesPath(this.vertices)
    }

    render() {
        ctx.translate(world.width / 2, world.height / 2);
        this.trail.render();
        ctx.translate(-world.width / 2, -world.height / 2);
        drawWrapped({
            fn: (wx, wy) => {
                ctx.rotate(-this.angle);
                drawVerticesPath(this.path2D, this.color);
            }, x: this.x, y: this.y, margin: {
                width: 200, height: 200
            }
        })
    }

    update(t, dt) {
        let rotation = 0;
        this.speed = clamp(this.speed + this.acceleration * dt, 0, this.maxSpeed);

        
        if (this.controllable) {
            if (keys["ArrowLeft"]) {
                rotation += this.speed * 0.005;
            }
            
            if (keys["ArrowRight"]) {
                rotation -= this.speed * 0.005;
            }
        } else {            
            if (t - this.lastTime > randomNum(0, 10000) || !this.lastTime) {
                rotation = this.speed * randomNum(-0.05, 0.05);
                this.lastTime = t;
            }
        }

        // this.speed = 5;

        // updateWrapped(() => {
        this.x = wrap(this.x - Math.sin(this.angle) * this.speed, world.width);
        this.y = wrap(this.y - Math.cos(this.angle) * this.speed, world.height);


        this.trail.update(this.x, this.y, this.speed);

        this.angle = wrap(this.angle + rotation, Math.PI * 2);

        // this.angle = this.controllable ? clampAngle(this.angle, -Math.PI/3, Math.PI/3) : this.angle;
        // }, this.x, this.y, {
        //     width: 100,
        //     height: 100
        // })
    }
}

export const ship = new Ship({ x: 150, y: 150, angle: 0, width: 40, height: 40, color: "blue", maxSpeed: 1, controllable: false });

export const ships = [];

for (let i = 0; i < sizeOf.ship; i++) {
    ships.push(new Ship({ x: randomNum(-canvas.width, world.width), y: randomNum(0, world.height), angle: 0, width: 40, height: 40 }));
}