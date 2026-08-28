import { InferenceSession, Tensor } from "onnxruntime-web";
import { world } from "../world/world.js";
import { toroidalAngle, toroidalDelta, toroidalDistance, updateWrapped, wrap } from "../world/utils.js";
import { clamp } from "../utils/math.js";
import AI from "../player/ships/enemies/AI.js";
import EnemyManager from "../player/ships/enemies/manager.js";
import { ship } from "../player/ships/player.js";

export let SESSION;
let predicting = false;

export async function loadModel() {
    SESSION = await InferenceSession.create(
        "/models/nav_policy.onnx"
    );
    console.log("Model loaded!")
}

export async function processAction(me, enemy, t, dt) {
    if (predicting) return;

    const x = me.x / world.width;
    const y = me.y / world.height;
    const angle = me.angle / Math.PI - 1;
    const speed = me.speed / 50000;


    const selfObs = new Float32Array([
        x,
        y,
        angle,
        speed
    ]);

    let action = new Float32Array([0, 0]);

    const dx = toroidalDelta(enemy.x, me.x, world.width) / (world.width / 2)
    const dy = toroidalDelta(enemy.y, me.y, world.height) / (world.height / 2)

    const eAngle = enemy.angle / Math.PI - 1;
    const eSpeed = enemy.speed / 50000;

    const enemyObs = new Float32Array([
        dx,
        dy,
        eAngle,
        eSpeed
    ]);

    const inputs = {
        self_obs: new Tensor(
            "float32",
            selfObs,
            [1, 4]
        ),

        enemy_obs: new Tensor(
            "float32",
            enemyObs,
            [1, 4]
        ),
    };

    if (SESSION) {
        predicting = true;

        try {
            const output = await SESSION.run(inputs);
            action = output.action.data;

            const thrust = action.at(0);
            const turn = action.at(1);

            me.speed = me.speed + (thrust * me.acceleration * dt);

            me.angle = wrap(me.angle + turn * dt * me.turnRate * (me.speed / me.acceleration), Math.PI * 2);


            me.speed = Math.max(me.speed * me.dampSpeed, 0);


            // updateWrapped(() => {
            me.x = wrap(me.x - Math.sin(me.angle) * (me.speed * dt), world.width);
            me.y = wrap(me.y - Math.cos(me.angle) * (me.speed * dt), world.height);

            me.trail.update(me.x, me.y, me.speed);

            // weapon update
            if (me.cooldown >= 0) {
                me.cooldown -= 1;
            }

            me.heat = clamp(me.heat - (me.maxHeat * 0.001), 0, me.maxHeat * 5);

            if (me.weaponState === "cool" && me.heat >= me.maxHeat) {
                me.weaponState = "hot";
            } else if (me.weaponState === "hot" && me.heat <= 0) {
                me.weaponState = "cool";
            }
        } finally {
            predicting = false
        }
    }
}

export async function runAI(t, dt) {
    if (!SESSION || predicting) return;

    const aiShips = EnemyManager.ships.filter(
        ship => ship instanceof AI
    );

    if (aiShips.length === 0) return;


    const selfData = new Float32Array(aiShips.length * 4);
    const enemyData = new Float32Array(aiShips.length * 4);


    aiShips.forEach((enemy, i) => {
        // self observation
        selfData[i * 4 + 0] = enemy.x / world.width;
        selfData[i * 4 + 1] = enemy.y / world.height;
        selfData[i * 4 + 2] = enemy.angle / Math.PI - 1;
        selfData[i * 4 + 3] = enemy.speed / 50000;


        // target observation
        const dx =
            toroidalDelta(
                enemy.x,
                ship.x,
                world.width
            ) / (world.width / 2);

        const dy =
            toroidalDelta(
                enemy.y,
                ship.y,
                world.height
            ) / (world.height / 2);


        enemyData[i * 4 + 0] = dx;
        enemyData[i * 4 + 1] = dy;
        enemyData[i * 4 + 2] = ship.angle / Math.PI - 1;
        enemyData[i * 4 + 3] = ship.speed / 50000;
    });


    const inputs = {
        self_obs: new Tensor(
            "float32",
            selfData,
            [aiShips.length, 4]
        ),

        enemy_obs: new Tensor(
            "float32",
            enemyData,
            [aiShips.length, 4]
        )
    };

    predicting = true;
    const output = await SESSION.run(inputs);
    const actions = output.action.data;
    
    
    aiShips.forEach((enemy, i) => {
        const thrust = actions[i * 2];
        const turn = actions[i * 2 + 1];
        
        enemy.update(t, dt,thrust, turn);
    });
    
    predicting = false;
}