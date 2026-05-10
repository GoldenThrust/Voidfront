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
let lastTime = 0;

function animate(t) {
    const deltaTime = clamp((t - lastTime) / 1000, 0.02);

    lastTime = t;
    spatial.clear();

    world.render();

    world.attach(attachWorld < 0 ? ship : ships[Math.min(attachWorld, ships.length - 1)]);

    for (const star of stars) {
        star.render();
    }

    for (const asteroid of asteroids) {
        asteroid.render();
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
    spatial.renderSpatialDebug();

    requestAnimationFrame(animate);
}

// displayElem.addEventListener("click", async () => {
await init();
// })


addEventListener("keydown", ({ key }) => {
    if (key == 'ArrowUp') {
        attachWorld = Math.min(attachWorld + 1, ships.length - 1)
    }
    if (key == 'ArrowDown') {
        attachWorld = Math.max(-1, attachWorld - 1)
    }

    if (key == '1') attachWorld = -1;

    console.log(key)
});