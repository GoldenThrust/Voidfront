import Ship from "../player/ships/ship.js";
import { isSeperatingAxes } from "../utils/collision.js";
import { createVerticesPath, drawVerticesPath, tranformVertices } from "../utils/vertices.js";
import { ctx } from "../world/canvas.js";
import { spatial } from "../world/spatialHash.js";
import { drawWrapped, toroidalDistance, worldToScreen } from "../world/utils.js";
import WeaponManager from "./manager.js";

import { shapes } from "./shapes.js";


export default class Weapon {
    constructor({ name, type, x, y, width, height, angle, ship, acceleration = 10, speed = 10, damage = 10, range = 1000, energyCost = 10, fireRate = 1, vertices = shapes[0], color = "red", img }, force) {
        this.name = name;
        this.type = type;
        this.acceleration = acceleration;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.damage = damage;
        this.img = img;

        this.range = range;
        this.fireRate = fireRate;
        this.energyCost = energyCost;

        this.vertices = vertices;

        this.color = color;
        this.ship = ship;

        this.dampSpeed = 0.99;

        this.path2D = createVerticesPath(tranformVertices(this.vertices, 0, -this.height / 2, this.width, this.height, 0));

        this.active = true;

        if (!force) {
            ship.increaseHeat(this.energyCost);
            ship.setCoolDown(1 / this.fireRate);
        }
    }

    render() {
        drawWrapped({
            fn: () => {
                ctx.rotate(-this.angle);
                // ctx.shadowColor = this.color;
                // ctx.shadowBlur = 10;
                if (this.img) {
                    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
                } else {
                    drawVerticesPath(this.path2D, this.color);
                }
            }, x: this.x, y: this.y, margin: {
                width: 200, height: 200
            }
        })
    }

    destroy() {
        WeaponManager.destroy(this);
    }

    getVertices() {
        const world = worldToScreen(this.x, this.y);
        const vertices = tranformVertices(this.vertices, world.x, world.y, this.width, this.height, this.angle);

        return vertices;
    }

    static nearBy(weapon, vertices, x, y) {
        const object = spatial.query(x, y, Math.ceil(weapon.height) + 1);


        for (const element of object) {
            if ((element instanceof Ship && (weapon.ship === element || element.state === "dead")) || (element instanceof Weapon && (weapon.ship === element.ship || weapon === element))) continue;


            weapon.closeObject(element)
            if (isSeperatingAxes(element.getVertices(), vertices).collision) {
                if (element instanceof Ship) {
                    element.life = Math.max(0, element.life - weapon.damage);
                    if (element.life <= 0) {
                        element.destroy();
                        weapon.ship.killScore++;
                    }
                } else {
                    element.destroy();
                }

                weapon.acceleration *= 0.8;
                weapon.range *= 0.8;


                if (!(--weapon.penetration)) {
                    weapon.colide();
                    weapon.destroy();
                }
            }
        }
    }

    getNearPlayers(radius) {
        const objects = spatial.query(this.x, this.y, Math.ceil(radius) + 1);

        const players = [];

        for (const obj of objects) {
            if (obj instanceof Ship && obj !== this.ship) {
                const dist = toroidalDistance(this.x, this.y, obj.x, obj.y);
                if (dist <= radius) {
                    players.push(obj);
                }
            }
        }
        return players;
    }

    getNearWeapons(radius) {
        const objects = spatial.query(this.x, this.y, Math.ceil(radius) + 1);

        const weapons = [];

        for (const obj of objects) {
            if (obj instanceof Weapon && obj !== this) {
                const dist = toroidalDistance(this.x, this.y, obj.x, obj.y);
                if (dist <= radius) {
                    weapons.push(obj);
                }
            }
        }
        return weapons;
    }


    colliding() {
        Weapon.nearBy(this, this.getVertices(), this.x, this.y);
    }

    colide() { }
    travelEnd() { }
    closeObject() { }
}