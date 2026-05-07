import { canvas, canvasHeight, canvasWidth, ctx } from "../world/space/canvas.js";
import { drawVertices, tranformVertices } from "../utils/vertices.js";
import { drawWrapped, inScreen, updateWrapped, worldToScreen, wrap } from "../world/utils.js";
import { camera } from "../world/camera.js";
import { randomNum } from "../utils/random.js";
import Trail from "./object/trail.js";

const WORLD_MARGIN = camera.width / 200;
export default class Ship {
    constructor({ x, y, width, height, angle, color = "red" }) {
        console.log(color);
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;

        this.lastTime = 0;
        this.trail = new Trail(20, "white");

        this.points = tranformVertices([
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
    }

    render() {
        ctx.translate(camera.width / 2, camera.height / 2);
        this.trail.render();
        ctx.translate(-camera.width / 2, -camera.height / 2);
        drawWrapped((wx, wy) => {
            ctx.rotate(-this.angle);
            drawVertices(this.points, this.color);
        }, this.x, this.y)
    }

    update(dt) {
        let rotate = 0;

        if (dt - this.lastTime > randomNum(0, 10000) || !this.lastTime) {
            rotate = randomNum(-0.5, 0.5);
            this.lastTime = dt;
        }

        this.speed = 20;

        // updateWrapped(() => {
        this.x = wrap(this.x - Math.sin(this.angle) * this.speed, camera.width);
        this.y = wrap(this.y - Math.cos(this.angle) * this.speed, camera.height);


        this.trail.update(this.x, this.y, this.speed);

        this.angle += rotate;
        // }, this.x, this.y, {
        //     width: 100,
        //     height: 100
        // })

    }


    getVertices() {
        const dist = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        const vertices = [
            {
                x: this.x - Math.sin(this.angle - alpha) * dist,
                y: this.y - Math.cos(this.angle - alpha) * dist
            }, // Top-left
            {
                x: this.x - Math.sin(this.angle + alpha) * dist,
                y: this.y - Math.cos(this.angle + alpha) * dist
            },  // Top-right
            {
                x: this.x - Math.sin(Math.PI + this.angle - alpha) * dist,
                y: this.y - Math.cos(Math.PI + this.angle - alpha) * dist
            },   // Bottom-left
            {
                x: this.x - Math.sin(Math.PI + this.angle + alpha) * dist,
                y: this.y - Math.cos(Math.PI + this.angle + alpha) * dist
            },  // Bottom-right
        ];

        this.points

        return vertices;
    }
}

export const ship = new Ship({ x: 150, y: 150, angle: 0, width: 20, height: 20, color: "blue" });

export const ships = [];

for (let i = 0; i < 500; i++) {
    ships.push(new Ship({ x: randomNum(-canvas.width, camera.width), y: randomNum(0, camera.height), angle: 0, width: 20, height: 20 }));
}