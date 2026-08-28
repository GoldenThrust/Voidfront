import { audioCtx } from "../../assets/audio/context.js";
import { assets } from "../../assets/main.js";
import { clamp } from "../../utils/math.js";
import { randomNum } from "../../utils/random.js";
import Ship from "./ship.js";


export let ship;

export default class PlayerShip extends Ship {
    constructor({ x, y, width, height, angle, acceleration, color = "red", name = "Player", controllable = true, turnRate, maxWeaponHeat = 10000 }) {
        super({ x, y, width, height, angle, img: assets?.images?.mainship, flameImg: assets?.images?.flame1, acceleration, color, name, maxWeaponHeat, controllable, life: 10000, turnRate });
        this.audioGain = audioCtx.createGain();

        // this.audioPlayer = throtlePlayAudio(assets?.audios?.engine, this.audioGain);

        if (this.controllable === false)
            this.state = "idle";
    }

    update(t, dt) {
        super.update(t, dt);


        if (this.speed > 50) {
            const { maxValue, minValue } = this.audioGain.gain;
            this.audioGain.gain.value = clamp(this.speed / 200, minValue, maxValue);
            // this.audioPlayer();
        }
    }

    static spawn(x, y) {
        const angle = randomNum(-Math.PI * 2, Math.PI * 2);
        const spawnDistance = 200000;
        const spawnX = randomNum(x - spawnDistance, x + spawnDistance);
        const spawnY = randomNum(y - spawnDistance, y + spawnDistance);
        ship = new PlayerShip({ x: spawnX, y: spawnY, angle, width: 50, height: 50, color: "#84d0ff", controllable: true, acceleration: 600, turnRate: 4.5, maxWeaponHeat: 10000 });
    }
}    


// 600-1500
// 2-4.5