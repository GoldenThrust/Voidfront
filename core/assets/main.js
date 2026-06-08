import { audioCtx } from "./audio/context.js";
import { assetsUrl } from "./urls.js";

export const assets = {};

function loadImage(name, src) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.src = `/assets/img/${src}`;
        img.onload = () => {
            res({
                [name]: img
            });
        }
        img.onerror = rej;
    })
}

function loadVideo(name, src) {

    return new Promise((res, rej) => {
        const vid = document.createElement('video');
        vid.src = `/assets/video/${src}`;

        vid.muted = true;
        vid.loop = true;
        vid.autoplay = true;
        vid.onloadeddata = () => {
            vid.play();
            res({
                [name]: vid
            });
        }

        vid.onerror = rej;
    })
}

export function loadAudio(name, src) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`/assets/audio/${src}`);
            const audioData = await response.arrayBuffer();

            const buffer = audioCtx.decodeAudioData(audioData);

            res({
                [name]: buffer
            });
        } catch (error) {
            reject(error)
        }
    })
}

const loaders = {
    image: loadImage,
    video: loadVideo,
    audio: loadAudio,
}


export async function buildAssets() {
    await Promise.all(
        Object.entries(assetsUrl).map(async ([type, paths]) => {
            const loader = loaders[type];
            if (!loader) return;

            assets[type] = await Promise.all(Object.entries(paths).map(([name, src]) => loader(name, src)));
        })
    )
}
