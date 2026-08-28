const ctx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = this.ctx.createGain();
masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
masterGain.connect(this.ctx.destination);

class EngineSound {
    constructor() {

    }

    start() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = ctx.createOscillator();

        osc.type = "sawtooth";

        osc
    }
}