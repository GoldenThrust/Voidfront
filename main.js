import { ship, ships } from "./core/player/ship.js";
import { camera } from "./core/world/camera.js";
import { stars } from "./core/world/object/Star.js";
import { ctx } from "./core/world/space/canvas.js";

async function init() {
    requestAnimationFrame(animate);
}

function animate(t) {
    camera.render();
    camera.attach(ship);

    for (const star of stars) {
        star.render();
    }

    ship.render();
    ship.update(t);

    for (const ship of ships) {
        ship.render();
        ship.update(t);
    }


    requestAnimationFrame(animate);
}

// displayElem.addEventListener("click", async () => {
await init();
// })

addEventListener("keydown", (e) => {
    // console.table(camera);
    if (e.key == 'ArrowUp') {
        camera.updateState({ dy: 10 })
    }
    if (e.key == 'ArrowDown') {
        camera.updateState({ dy: -10 })
    }
    if (e.key == 'ArrowRight') {
        // camera.updateState({ dAngle: 0.5 })
        camera.updateState({ dx: 10 })
    }
    if (e.key == 'ArrowLeft') {
        camera.updateState({ dx: -10 })
        // camera.updateState({ dAngle: -0.5 })
    }
});
