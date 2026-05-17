import { destroyedShips, ship, ships } from "./core/player/ships/ship.js";
import { world } from "./core/world/world.js";
import { stars } from "./core/world/object/Star.js";
import { ctx, resizeCanvas } from "./core/world/canvas.js";
import { minimap } from "./core/world/minimap.js";
import { asteroids } from "./core/world/object/asteroid/asteroid.js";
import { clamp } from "./core/utils/math.js";
import { spatial } from "./core/world/spatialHash.js";
import { explosions } from "./core/player/prop/explosion.js";
import { weaponTypes } from "./core/weapons/manager.js";


async function init() {
    requestAnimationFrame(animate);
}

let attachWorld = -1;
let lastTime = performance.now();
let timeAccumulator = 0;
const FIXED_DT = 1 / 240;



function animate(t) {
    const deltaTime = clamp((t - lastTime) / 1000, 0, 10);
    lastTime = t;

    timeAccumulator += deltaTime;

    spatial.clear();
    spatial.insertAll([ship], ships, asteroids)
    resizeCanvas()
    ctx.font = "20px monospace"
    ctx.fillStyle = "white";
    ctx.fillText(`Ships Alive: ${ships.length} - Destroyed: ${destroyedShips.length} Kill: ${ship.killScore} Weapon name: ${weaponTypes[ship.weaponId].name} heat: ${Math.ceil((ship.weaponManager.heat/ship.weaponManager.maxHeat) * 100)}`, 10, 30)


    while (timeAccumulator >= FIXED_DT) {
        world.attach(attachWorld < 0 ? ship : ships[Math.min(attachWorld, ships.length - 1)]);

        for (const asteroid of asteroids) {
            asteroid.update(FIXED_DT);
        }

        ship.update(t, FIXED_DT);

        for (const ship of ships) {
            ship.update(t, FIXED_DT);
        }

        timeAccumulator -= FIXED_DT;
    }

    world.render();

    for (const star of stars) {
        star.render();
    }

    for (const asteroid of asteroids) {
        asteroid.render();
    }

    ship.render();

    for (const ship of ships) {
        ship.render();
    }

    minimap.render();
    for (const exp of explosions) {
        exp.render();
    }

    // spatial.renderSpatialDebug();

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

    if (key === "a") {
        ship.weaponId = (ship.weaponId - 1) < 0 ? weaponTypes.length - 1 : ship.weaponId - 1;
        console.log(ship.weaponId, ship.weaponId % weaponTypes.length)
    }

    if (key === 'd') {
        ship.weaponId = (ship.weaponId + 1) % weaponTypes.length;
        console.log(ship.weaponId, ship.weaponId % weaponTypes.length)
    }

    console.log(key)

    if (key == '1') attachWorld = -1;
});