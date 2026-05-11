import { ship, ships } from "./core/player/ship.js";
import { world } from "./core/world/world.js";
import { stars } from "./core/world/object/Star.js";
import { ctx } from "./core/world/space/canvas.js";
import { minimap } from "./core/world/minimap.js";
import { asteroids } from "./core/world/object/asteroid/asteroid.js";
import { clamp } from "./core/utils/math.js";
import { spatial } from "./core/world/spatialHash.js";


async function init() {
    requestAnimationFrame(animate);
}

let attachWorld = -1;
let lastTime = performance.now();
let timeAccumulator = 0;
const FIXED_DT = 1 / 60;


function animate(t) {
    const deltaTime = clamp((t - lastTime) / 1000, 0, FIXED_DT);
    lastTime = t;

    timeAccumulator += deltaTime;

    // Remove all render from while loop
    while (timeAccumulator >= FIXED_DT) {
        spatial.clear();

        world.render();

        world.attach(attachWorld < 0 ? ship : ships[Math.min(attachWorld, ships.length - 1)]);

        for (const star of stars) {
            star.render();
        }

        for (const asteroid of asteroids) {
            asteroid.render();
            asteroid.update();
            spatial.insert(asteroid);
        }

        ship.render();
        ship.update(t, deltaTime);
        spatial.insert(ship);

        for (const ship of ships) {
            ship.render();
            ship.update(t, deltaTime);
            spatial.insert(ship);
        }

        minimap.render();
        // spatial.renderSpatialDebug();

        timeAccumulator -= FIXED_DT;
    }

    requestAnimationFrame(animate);
}

// displayElem.addEventListener("click", async () => {
await init();
// })


addEventListener("keydown", ({ key }) => {
    if (key == '5') {
        attachWorld = Math.min(attachWorld + 1, ships.length - 1)
    }
    if (key == '6') {
        attachWorld = Math.max(-1, attachWorld - 1)
    }

    if (key == '1') attachWorld = -1;
});