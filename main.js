import Ship, { destroyedShips } from "./core/player/ships/ship.js";
import { world } from "./core/world/world.js";
import { stars } from "./core/world/object/Star.js";
import { ctx, resizeCanvas } from "./core/world/canvas.js";
import { minimap } from "./core/world/minimap.js";
import { asteroids } from "./core/world/object/asteroid/asteroid.js";
import { clamp } from "./core/utils/math.js";
import { spatial } from "./core/world/spatialHash.js";
import { explosions } from "./core/player/prop/explosion.js";


import { ship } from "./core/player/ships/player.js";
import EnemyManager from "./core/player/ships/enemies/manager.js";
import WeaponManager from "./core/weapons/manager.js";



async function init() {
    EnemyManager.init();
    requestAnimationFrame(animate);
}

let attachWorld = -1;
let lastTime = performance.now();
let timeAccumulator = 0;
const FIXED_DT = 1 / 240;


async function animate(t) {
    const deltaTime = clamp((t - lastTime) / 1000, 0, 10);
    lastTime = t;

    timeAccumulator += deltaTime;

    while (timeAccumulator >= FIXED_DT) {
        spatial.clear();
        spatial.insertAll([ship], EnemyManager.ships, asteroids)

        world.attach(attachWorld < 0 ? ship : EnemyManager.ships[Math.min(attachWorld, ships.length - 1)]);

        for (const asteroid of asteroids) {
            asteroid.update(FIXED_DT);
        }

        ship.update(t, FIXED_DT);
        EnemyManager.update(t, FIXED_DT);
        WeaponManager.update(FIXED_DT)

        timeAccumulator -= FIXED_DT;
    }

    resizeCanvas()
    ctx.font = "20px monospace"
    ctx.fillStyle = "white";
    ctx.fillText(`Ships Alive: ${EnemyManager.ships.length} - Destroyed: ${destroyedShips.length} Kill: ${ship.killScore} Weapon name: ${(await (WeaponManager.weaponTypes[ship.weaponId])).default.name} heat: ${Math.ceil((ship.heat / ship.maxHeat) * 100)}`, 10, 30)

    world.render();

    for (const star of stars) {
        star.render();
    }

    for (const asteroid of asteroids) {
        asteroid.render();
    }

    ship.render();

    EnemyManager.render();

    WeaponManager.render();

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
        attachWorld = Math.min(attachWorld + 1, EnemyManager.ships.length - 1)
    }
    if (key == '6') {
        attachWorld = Math.max(-1, attachWorld - 1)
    }

    if (key === "a") {
        ship.weaponId = (ship.weaponId - 1) < 0 ? WeaponManager.weaponTypes.length - 1 : ship.weaponId - 1;
    }

    if (key === 'd') {
        ship.weaponId = (ship.weaponId + 1) % WeaponManager.weaponTypes.length;
    }

    // console.log(key)

    if (key == '1') attachWorld = -1;
});