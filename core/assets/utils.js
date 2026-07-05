import { audioCtx } from "./audio/context.js";

export function playAudio(buffer, gain, loop = false) {
    const source = audioCtx.createBufferSource();

    source.connect(gain).connect(audioCtx.destination);

    source.loop = loop;
    source.buffer = buffer;
    source.start();

    return source;
}

export function throtlePlayAudio(buffer, gain) {
    let playing = false;
            console.log("throtle audio");


    return () => {
            console.log("player audio");
        if (!playing) {
            console.log("playing audio");
            playing = true;
            const source = playAudio(buffer, gain);
            source.onended = () => {
                playing = false;
            }
        }
    }
}