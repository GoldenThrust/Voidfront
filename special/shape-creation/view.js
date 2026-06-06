import { createVerticesPath, tranformVertices } from "../../core/utils/vertices.js";

// ===== CANVAS SETUP =====
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

const dpr = window.devicePixelRatio ?? 1;

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;

ctx.scale(dpr, dpr);

let shapes = [{ x: 0, y: -0.9275 }, { x: -0.06449999999999989, y: -0.8875 }, { x: -0.075, y: -0.9325 }, { x: -0.065, y: -0.7525 }, { x: -0.245, y: -0.6425 }, { x: -0.335, y: -0.1775 }, { x: -1, y: 0.2475 }, { x: -0.335, y: 0.0675 }, { x: -0.135, y: 0.6775 }, { x: -0.75, y: 0.9325 }, { x: -0.2, y: 0.8225 }, { x: 0, y: 0.7225 }, { x: 0, y: 0.7225 }, { x: 0.2, y: 0.8225 }, { x: 0.75, y: 0.9325 }, { x: 0.135, y: 0.6775 }, { x: 0.335, y: 0.0675 }, { x: 1, y: 0.2475 }, { x: 0.335, y: -0.1775 }, { x: 0.245, y: -0.6425 }, { x: 0.065, y: -0.7525 }, { x: 0.075, y: -0.9325 }, { x: 0.06449999999999989, y: -0.8875 },{ x: 0, y: -0.9275 }]; 

const transformVertices = tranformVertices(shapes, canvasWidth/2, canvasHeight/2, 100,100,0);
const path = createVerticesPath(transformVertices);

ctx.fillStyle = "white";
ctx.fill(path);

