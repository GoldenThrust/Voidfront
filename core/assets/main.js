import { audioCtx } from "./audio/context.js";
import { assetsUrl } from "./urls.js";

export const assets = {};

function loadImage(src) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.src = `/assets/img/${src}`;
        img.onload = () => {
            res(img);
        }
        img.onerror = rej;
    })
}

function loadVideo(src) {
    return new Promise((res, rej) => {
        const vid = document.createElement('video');
        vid.src = `/assets/video/${src}`;

        vid.muted = true;
        vid.loop = true;
        vid.autoplay = true;
        vid.onloadeddata = () => {
            vid.play();
            res(vid);
        }

        vid.onerror = rej;
    })
}

export function loadAudio(src) {
    return new Promise(async (res, rej) => {
        try {
            const response = await fetch(`/assets/audio/${src}`);
            const audioData = await response.arrayBuffer();

            const buffer = audioCtx.decodeAudioData(audioData);

            res(buffer);
        } catch (error) {
            rej(error)
        }
    })
}

const loaders = {
    images: loadImage,
    videos: loadVideo,
    audios: loadAudio,
}


export async function buildAssets() {
    await Promise.all(
        Object.entries(assetsUrl).map(async ([type, paths]) => {
            const loader = loaders[type];
            if (!loader) return;
            assets[type] = {};

            for (const [name, src] of Object.entries(paths)) {
                assets[type][name] = await loader(src);
            }
        })
    )
}
