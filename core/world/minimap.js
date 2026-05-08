import { ship, ships } from "../player/ship.js";
import { world } from "./world.js";
import { canvas, canvasHeight, canvasWidth } from "./space/canvas.js";
import { drawWrapped, toroidalDelta, updateWrapped, wrap } from "./utils.js";

export default class Minimap {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;

        this.sx = this.canvas.width / world.width;
        this.sy = this.canvas.height / world.height;

        this.ctx = this.canvas.getContext("2d");

        this.styleMap = this.canvas.attributeStyleMap;
        this.styleMap.set("width", `${width}px`);
        this.styleMap.set("height", `${height}px`);
        this.styleMap.set("bottom", "20px");
        this.styleMap.set("right", "20px");
        this.styleMap.set("border-radius", "30px");
        this.styleMap.set("border", "3px solid rgba(100, 160, 220, 0.3)");

        document.documentElement.appendChild(this.canvas);
    }

    clear() {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    // render() {
    //     // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //     this.ctx.fillStyle = 'rgba(5, 8, 18, 0.5)';
    //     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    //     for (const ship of ships) {
    //         updateWrapped(()=> {
    //             this.ctx.beginPath();
    //             this.ctx.arc(this.sx * ship.x, this.sy * ship.y, 1.2, 0, Math.PI * 2);
    //             this.ctx.fillStyle = ship.color;
    //             this.ctx.fill();
    //         }, ship.x, ship.y, {
    //             width: 2000, height: 2000
    //         })
    //     }

    //     this.ctx.beginPath();
    //     this.ctx.arc(this.sx * ship.x, this.sy * ship.y, 2.5, 0, Math.PI * 2);
    //     this.ctx.fillStyle = "#80ddff"
    //     this.ctx.fill();

    //     this.ctx.strokeStyle = 'rgba(100, 160, 220, 0.3)';
    //     this.ctx.lineWidth = 0.5;

    //     this.ctx.strokeRect(10, 10, this.canvas.width- 20, this.canvas.height-20)
    // }

    render() {
        this.clear();

        const x = -(this.sx * ship.x) + this.canvas.width / 2;
        const y = -(this.sy * ship.y) + this.canvas.height / 2;

        this.ctx.translate(x, y)
        this.ctx.beginPath();
        this.ctx.arc(this.sx * ship.x, this.sy * ship.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = "#80ddff"
        this.ctx.fill();




        for (const ship of ships) {
            // const x = wrap(this.sx * ship.x, this.canvas.width);
            // const y = wrap(this.sy * ship.y, this.canvas.height);
            // updateWrapped(() => {
            updateWrapped({fn:(wx, wy) => {
                const x = wrap(this.sx * wx, this.wy);
                const y = wrap(this.sy * ship.y, this.canvas.height);
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                this.ctx.fillStyle = ship.color;
                this.ctx.fill();
            }, wx: ship.x, wy: ship.y})
            // }, ship.x, ship.y, {
            //     width: 2000, height: 2000
            // })
        }


    }
}

export const minimap = new Minimap(100, 100);