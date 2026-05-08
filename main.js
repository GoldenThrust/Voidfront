import { ship, ships } from "./core/player/ship.js";
import { world } from "./core/world/world.js";
import { stars } from "./core/world/object/Star.js";
import { ctx } from "./core/world/space/canvas.js";
import { minimap } from "./core/world/minimap.js";
import { asteroids } from "./core/world/object/asteroid/asteroid.js";

async function init() {
    requestAnimationFrame(animate);
}

let attachWorld = -1;

function animate(t) {
    world.render();

    world.attach(attachWorld < 0 ? ship : ships[Math.min(attachWorld, ships.length - 1)]);

    for (const star of stars) {
        star.render();
    }

    for (const asteroid of asteroids) {
        asteroid.render();
    }

    ship.render();
    ship.update(t);

    for (const ship of ships) {
        ship.render();
        ship.update(t);
    }

    minimap.render();


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
});