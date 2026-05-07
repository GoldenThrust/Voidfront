import { randomNum } from "../../utils/random.js";
import { camera } from "../camera.js";
import { ctx } from "../space/canvas.js";
import { drawWrapped } from "../utils.js";

class Star {
    constructor({
        x, y, radius, bright, twinkle, speed
    }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.bright = bright;
        this.twinkle = twinkle;
        this.speed = speed;
    }

    render() {
        this.twinkle += this.speed;
        const alpha = this.bright * (0.7 + 0.3 * Math.sin(this.twinkle));

        drawWrapped(()=> {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,215,255, ${alpha})`;
            ctx.fill();
        }, this.x, this.y)
    }
}

export const stars = [];

for (let i = 0; i < 100000; i++) {
    stars.push(new Star({
        x: randomNum(0, camera.width),
        y: randomNum(0, camera.height),
        radius: randomNum(0.2, 2),
        bright: randomNum(0.2, 0.7),
        twinkle: randomNum(-Math.PI, Math.PI),
        speed: randomNum(0.002, 0.006)
    }))    
}