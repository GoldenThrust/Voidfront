import { world } from "./world.js";
import { canvas, canvasHeight, canvasWidth } from "./canvas.js";
import { drawWrapped, toroidalDelta, updateWrapped, wrap } from "./utils.js";
import { clamp } from "../utils/math.js";
import { ship } from "../player/ships/player.js";
import WeaponManager from "../weapons/manager.js";
import EnemyManager from "../player/ships/enemies/manager.js";


export default class Minimap {
    constructor(width, height, scale) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "minimap";
        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        const minScale = Math.max(canvas.width / world.width, canvas.height / world.height);

        scale = clamp(scale, minScale, 1);

        this.world = {
            x: 0,
            y: 0,
            width: width / scale,
            height: height / scale
        }

        this.sx = this.world.width / world.width;
        this.sy = this.world.height / world.height;

        this.ctx = this.canvas.getContext("2d");

        document.documentElement.appendChild(this.canvas);

        this.lastTime = 0;
    }

    clear() {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    drawMainShip(x, y, angle, size = 1, color = "red") {
        const dx = this.sx * x;
        const dy = this.sy * y;

        drawWrapped({
            fn: (wx, wy) => {
                this.ctx.beginPath();
                this.ctx.rotate(-angle);
                this.ctx.moveTo(0, -size * 2);
                this.ctx.lineTo(size, size * 2);
                this.ctx.lineTo(0, size / 2);
                this.ctx.lineTo(-size, size * 2);

                this.ctx.closePath();
                this.ctx.fillStyle = color;
                this.ctx.fill();
            }, x: dx, y: dy, space: this.world, screen: this.canvas, wCtx: this.ctx
        })
    }


    draw(x, y, size = 1, color = "red") {
        const dx = this.sx * x;
        const dy = this.sy * y;

        drawWrapped({
            fn: (wx, wy) => {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size, 0, Math.PI * 2);
                this.ctx.fillStyle = color;
                // this.ctx.shadowColor = color;
                // this.ctx.shadowBlur = 10;

                this.ctx.fill();
            }, x: dx, y: dy, space: this.world, screen: this.canvas, wCtx: this.ctx
        })
    }

    render() {
        const captureDuration = 5000;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = `rgba(12, 16, 26, 0.1)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.save();
        this.ctx.translate((this.canvas.width - this.world.width) / 2, (this.canvas.height - this.world.height) / 2);

        const dx = this.sx * ship.x;
        const dy = this.sy * ship.y;

        this.world.x = dx;
        this.world.y = dy;

        this.drawMainShip(ship.x, ship.y, ship.angle, this.canvas.width / 25, "#84d0ff");
        this.ctx.globalAlpha = Math.sin((performance.now() % captureDuration) / captureDuration * Math.PI);

        for (const weapon of WeaponManager.weapons) {
            this.draw(weapon.x, weapon.y, 0.8, "yellow");
        }

        for (const ship of EnemyManager.ships) {
            this.draw(ship.x, ship.y, 1.5, `rgb(0, 8, 255)`);
        }
        this.ctx.restore();
    }


    // render() {
    //     this.ctx.fillStyle = 'rgba(5, 8, 18, 0.5)';
    //     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    //     for (const ship of ships) {
    //         this.ctx.beginPath();
    //         this.ctx.arc(this.sx * ship.x, this.sy * ship.y, 1.2, 0, Math.PI * 2);
    //         this.ctx.fillStyle = ship.color;
    //         this.ctx.fill();
    //     }

    //     this.ctx.beginPath();
    //     this.ctx.arc(this.sx * ship.x, this.sy * ship.y, 2.5, 0, Math.PI * 2);
    //     this.ctx.fillStyle = "#80ddff"
    //     this.ctx.fill();
    // }
}

export const minimap = new Minimap(100, 100, 0.1);