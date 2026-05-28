import { keybinds } from "./keybind.js";

export const keys = {};
export const orientation = {};
export const touchDetected = {};

addEventListener("keydown", ({ key }) => {
    keys[key] = true;
    keybinds[key]?.();
})

addEventListener("keyup", ({ key }) => {
    keys[key] = false;
})

addEventListener("devicemotion", ({ rotationRate }) => {
    const { alpha, beta, gamma } = rotationRate;
    orientation["alpha"] = alpha;
    orientation["beta"] = beta;
    orientation["gamma"] = gamma;
})


addEventListener('mousedown', () => {
    touchDetected["mouse"] = true;
})

addEventListener('mouseup', () => {
    touchDetected["mouse"] = false;
})

addEventListener("touchstart", () => {
    touchDetected["touch"] = true;
})
addEventListener("touchend", () => {
    touchDetected["touch"] = false;
})
