// Helper to generate a White Noise Buffer
function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of looping noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

const shipPresets = {
    // 1. Alien Scout
    alienScout: {
        oscType: 'triangle',
        baseFreq: 170,
        detune: 12,
        filterType: 'bandpass',
        filterFreq: 1200,
        filterQ: 6,
        lfoFreq: 9,
        lfoGain: 45,
        noiseGain: 0.08
    },

    // 2. Heavy Dreadnought
    heavyDreadnought: {
        oscType: 'sawtooth',
        baseFreq: 38,
        detune: 3,
        filterType: 'lowpass',
        filterFreq: 140,
        filterQ: 1.8,
        lfoFreq: 2,
        lfoGain: 12,
        noiseGain: 0.35
    },

    // 3. Plasma Fighter
    plasmaFighter: {
        oscType: 'sawtooth',
        baseFreq: 95,
        detune: 6,
        filterType: 'bandpass',
        filterFreq: 700,
        filterQ: 3,
        lfoFreq: 7,
        lfoGain: 28,
        noiseGain: 0.18
    },

    // 4. Cargo Hauler
    cargoHauler: {
        oscType: 'triangle',
        baseFreq: 52,
        detune: 2,
        filterType: 'lowpass',
        filterFreq: 180,
        filterQ: 1,
        lfoFreq: 1.2,
        lfoGain: 18,
        noiseGain: 0.25
    },

    // 5. Warp Cruiser
    warpCruiser: {
        oscType: 'sine',
        baseFreq: 130,
        detune: 1,
        filterType: 'lowpass',
        filterFreq: 1800,
        filterQ: 0.8,
        lfoFreq: 0.4,
        lfoGain: 120,
        noiseGain: 0.08
    },

    // 6. Steampunk Rocket
    steampunkRocket: {
        oscType: 'sawtooth',
        baseFreq: 70,
        detune: 18,
        filterType: 'bandpass',
        filterFreq: 450,
        filterQ: 4,
        lfoFreq: 15,
        lfoGain: 20,
        noiseGain: 0.55
    },

    // 7. Cyber Drone
    cyberDrone: {
        oscType: 'square',
        baseFreq: 72,
        detune: 0,
        filterType: 'lowpass',
        filterFreq: 280,
        filterQ: 2.5,
        lfoFreq: 5,
        lfoGain: 22,
        noiseGain: 0.03
    },

    // 8. Quantum Explorer
    quantumExplorer: {
        oscType: 'triangle',
        baseFreq: 145,
        detune: 8,
        filterType: 'notch',
        filterFreq: 900,
        filterQ: 5,
        lfoFreq: 3.5,
        lfoGain: 90,
        noiseGain: 0.12
    }
};

// const shipPresets = {
//     // 1. Alien Scout: High pitched, eerie, heavy frequency modulation
//     alienScout: {
//         oscType: 'sine', baseFreq: 180, detune: 15,
//         filterType: 'peaking', filterFreq: 800, filterQ: 10,
//         lfoFreq: 12, lfoGain: 80, noiseGain: 0.1
//     },
//     // 2. Heavy Dreadnought: Massive, low rumbling bass, deep brown-ish noise
//     heavyDreadnought: {
//         oscType: 'sawtooth', baseFreq: 35, detune: 4,
//         filterType: 'lowpass', filterFreq: 120, filterQ: 3,
//         lfoFreq: 2.5, lfoGain: 15, noiseGain: 0.6
//     },
//     // 3. Plasma Fighter: Buzzing, sharp, mid-range energy
//     plasmaFighter: {
//         oscType: 'sawtooth', baseFreq: 90, detune: 8,
//         filterType: 'bandpass', filterFreq: 450, filterQ: 4,
//         lfoFreq: 8, lfoGain: 50, noiseGain: 0.3
//     },
//     // 4. Cargo Hauler: Sluggish, rhythmic mechanical pulsing
//     cargoHauler: {
//         oscType: 'triangle', baseFreq: 55, detune: 5,
//         filterType: 'lowpass', filterFreq: 200, filterQ: 1,
//         lfoFreq: 1.5, lfoGain: 30, noiseGain: 0.4
//     },
//     // 5. Warp Cruiser: Clean, futuristic, high filter sweep focus
//     warpCruiser: {
//         oscType: 'sine', baseFreq: 120, detune: 2,
//         filterType: 'lowpass', filterFreq: 1500, filterQ: 0.5,
//         lfoFreq: 0.5, lfoGain: 200, noiseGain: 0.15
//     },
//     // 6. Steampunk Rocket: Violent, exploding high-frequency noise dominant
//     steampunkRocket: {
//         oscType: 'sawtooth', baseFreq: 65, detune: 25,
//         filterType: 'lowpass', filterFreq: 300, filterQ: 8,
//         lfoFreq: 20, lfoGain: 10, noiseGain: 0.9
//     },
//     // 7. Cyber Drone: Digital, precise, cold square wave notes
//     cyberDrone: {
//         oscType: 'square', baseFreq: 70, detune: 1,
//         filterType: 'lowpass', filterFreq: 250, filterQ: 5,
//         lfoFreq: 6, lfoGain: 40, noiseGain: 0.05
//     },
//     // 8. Quantum Explorer: Shifting, phasey, high resonance
//     quantumExplorer: {
//         oscType: 'triangle', baseFreq: 140, detune: 12,
//         filterType: 'notch', filterFreq: 600, filterQ: 12,
//         lfoFreq: 4.5, lfoGain: 350, noiseGain: 0.2
//     }
// };

class SpaceshipEngine {
    constructor() {
        this.ctx = null;
        this.activeNodes = [];
        this.masterGain = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // Safety volume
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    start(presetName) {
        this.init();
        this.stop(); // Clear any playing sound before starting a new one

        const config = shipPresets[presetName];
        const ctx = this.ctx;

        // 1. Core Synthesis Layers (Two Detuned Oscillators for Thickness)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc1.type = config.oscType;
        osc1.frequency.setValueAtTime(config.baseFreq, ctx.currentTime);
        osc1.detune.setValueAtTime(-config.detune, ctx.currentTime);

        osc2.type = config.oscType;
        osc2.frequency.setValueAtTime(config.baseFreq, ctx.currentTime);
        osc2.detune.setValueAtTime(config.detune, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.5, ctx.currentTime);

        // 2. White Noise Engine Jet Layer
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = createNoiseBuffer(ctx);
        noiseSource.loop = true;
        const noiseGainNode = ctx.createGain();
        noiseGainNode.gain.setValueAtTime(config.noiseGain, ctx.currentTime);

        // 3. Audio Filter Configuration
        const mainFilter = ctx.createBiquadFilter();
        mainFilter.type = config.filterType;
        mainFilter.frequency.setValueAtTime(config.filterFreq, ctx.currentTime);
        mainFilter.Q.setValueAtTime(config.filterQ, ctx.currentTime);

        // 4. Low Frequency Oscillator (LFO) for Throbbing Effect
        const lfo = ctx.createOscillator();
        const lfoGainNode = ctx.createGain();
        lfo.frequency.setValueAtTime(config.lfoFreq, ctx.currentTime);
        lfoGainNode.gain.setValueAtTime(config.lfoGain, ctx.currentTime);

        // --- CONNECTIONS (The Audio Graph) ---
        // Connect tone generators to filter
        osc1.connect(oscGain);
        osc2.connect(oscGain);
        oscGain.connect(mainFilter);

        // Connect noise generator to filter
        noiseSource.connect(noiseGainNode);
        noiseGainNode.connect(mainFilter);

        // Routing the LFO to modulate the main filter's frequency cutoff dynamically
        lfo.connect(lfoGainNode);
        lfoGainNode.connect(mainFilter.frequency);

        // Output to Master Gain
        mainFilter.connect(this.masterGain);

        // Play sources
        osc1.start();
        osc2.start();
        noiseSource.start();
        lfo.start();

        // Save reference to stop them later
        this.activeNodes = [osc1, osc2, noiseSource, lfo];
    }

    stop() {
        this.activeNodes.forEach(node => {
            try { node.stop(); } catch (e) { }
        });
        this.activeNodes = [];
    }
}

const engine = new SpaceshipEngine();

const weaponPresets = {
    // 1. Standard Blaster
    gun: {
        type: 'noise',
        filterType: 'bandpass',
        filterFreq: 1800,
        filterQ: 2,
        duration: 0.08,
        decay: 0.06,
        noiseGain: 0.8
    },

    // 2. Gatling Gun
    gatling: {
        type: 'noise',
        filterType: 'highpass',
        filterFreq: 2500,
        filterQ: 1,
        duration: 0.035,
        decay: 0.025,
        noiseGain: 0.55
    },

    // 3. Pulse Cannon
    pulseCannon: {
        type: 'tone',
        oscType: 'triangle',
        startFreq: 1400,
        endFreq: 250,
        duration: 0.18,
        filterFreq: 2200
    },

    // 4. Plasma Cannon
    plasmaCannon: {
        type: 'tone',
        oscType: 'sawtooth',
        startFreq: 700,
        endFreq: 90,
        duration: 0.35,
        filterFreq: 1200,
        resonance: 2
    },

    // 5. Heavy Railgun
    heavyRailGun: {
        type: 'railgun',
        startFreq: 120,
        endFreq: 4200,
        duration: 0.65,
        chargeTime: 0.25
    },

    // 6. Homing Missile
    hommingMissile: {
        type: 'missile',
        oscType: 'triangle',
        baseFreq: 75,
        filterFreq: 500,
        noiseGain: 0.35,
        lfoFreq: 6
    },

    // 7. Rocket Missile
    explodingMissile: {
        type: 'missile',
        oscType: 'sawtooth',
        baseFreq: 55,
        filterFreq: 320,
        noiseGain: 0.45,
        lfoFreq: 3
    },

    // 8. Space Mine
    mine: {
        type: 'mine',
        oscType: 'sine',
        baseFreq: 900,
        endFreq: 700,
        rate: 0.45,
        duration: 0.3
    },

    // 9. Explosion
    explosion: {
        type: 'explosion',
        duration: 1.2,
        filterFreq: 180,
        noiseGain: 1.0,
        bassFreq: 55
    }
};
// const weaponPresets = {
//     // 1. Regular Gun: Short, sharp burst of filtered white noise
//     gun: { type: 'noise', filterType: 'bandpass', filterFreq: 1000, duration: 0.15, decay: 0.1 },

//     // 2. Gatling Gun: Ultra-short clicky transients designed to be fired in rapid succession
//     gatling: { type: 'noise', filterType: 'lowpass', filterFreq: 1800, duration: 0.08, decay: 0.05 },

//     // 3. Pulse Cannon: High-frequency retro synth blip dropping rapidly in pitch
//     pulseCannon: { type: 'tone', oscType: 'triangle', startFreq: 1200, endFreq: 150, duration: 0.25 },

//     // 4. Plasma Cannon: A heavy, thick energy blast with high resonance and a wider sweep
//     plasmaCannon: { type: 'tone', oscType: 'sawtooth', startFreq: 800, endFreq: 80, duration: 0.4, filterFreq: 2000 },

//     // 5. Heavy Rail Gun: Electric charge-up whine followed by a massive, instantaneous kinetic crack
//     heavyRailGun: { type: 'railgun', startFreq: 80, endFreq: 3000, duration: 0.8 },

//     // 6. Homming Missile: Continuous rocket-thruster tracking hiss that stays active until impact
//     hommingMissile: { type: 'missile', oscType: 'sawtooth', baseFreq: 90, filterFreq: 600 },

//     // 7. Exploding Missile: A standard rocket launch sound that transitions instantly into a detonator trigger
//     explodingMissile: { type: 'missile', oscType: 'triangle', baseFreq: 60, filterFreq: 400 },

//     // 8. Space Mine: A rhythmic, expanding proximity beep that gets faster or deeper
//     mine: { type: 'mine', baseFreq: 880, rate: 0.4 },

//     // 9. Explosion: Massive burst of low-passed brown/white noise expanding and dissipating slowly
//     explosion: { type: 'explosion', duration: 1.5 }
// };


class SpaceshipWeapons {
    constructor(audioContext) {
        // Reuse the context from your engine setup if possible
        this.ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    }

    fire(weaponName) {
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const config = weaponPresets[weaponName];

        // Master weapon node graph destination
        const weaponGain = this.ctx.createGain();
        weaponGain.connect(this.ctx.destination);

        switch (config.type) {
            case 'noise': {
                // Gun & Gatling: Filtered Noise Snap
                const noise = this.ctx.createBufferSource();
                noise.buffer = createNoiseBuffer(this.ctx); // Reuses the noise buffer function from engine step

                const filter = this.ctx.createBiquadFilter();
                filter.type = config.filterType;
                filter.frequency.setValueAtTime(config.filterFreq, now);

                weaponGain.gain.setValueAtTime(0.4, now);
                weaponGain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);

                noise.connect(filter);
                filter.connect(weaponGain);

                noise.start(now);
                noise.stop(now + config.duration);
                break;
            }

            case 'tone': {
                // Pulse & Plasma: Fast, falling pitch curves (Pitch Envelopes)
                const osc = this.ctx.createOscillator();
                osc.type = config.oscType;

                // Exponentially drop the pitch from high to low to sound like a projectile exiting a barrel
                osc.frequency.setValueAtTime(config.startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(config.endFreq, now + config.duration);

                weaponGain.gain.setValueAtTime(0.5, now);
                weaponGain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);

                if (config.filterFreq) {
                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(config.filterFreq, now);
                    osc.connect(filter);
                    filter.connect(weaponGain);
                } else {
                    osc.connect(weaponGain);
                }

                osc.start(now);
                osc.stop(now + config.duration);
                break;
            }

            case 'railgun': {
                // Railgun: Charge phase + Instant blast
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                // Charge up frequency whine
                osc.frequency.setValueAtTime(config.startFreq, now);
                osc.frequency.linearRampToValueAtTime(config.endFreq, now + 0.4);

                weaponGain.gain.setValueAtTime(0.01, now);
                weaponGain.gain.linearRampToValueAtTime(0.15, now + 0.4);

                // Kinetic Burst Event
                weaponGain.gain.setValueAtTime(0.8, now + 0.4);
                weaponGain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);

                // Add a noise layer specifically for the kinetic impact crack at t + 0.4
                const crack = this.ctx.createBufferSource();
                crack.buffer = createNoiseBuffer(this.ctx);
                const crackFilter = this.ctx.createBiquadFilter();
                crackFilter.type = 'bandpass';
                crackFilter.frequency.setValueAtTime(200, now + 0.4);

                crack.connect(crackFilter);
                crackFilter.connect(weaponGain);

                osc.connect(weaponGain);
                osc.start(now);
                osc.stop(now + config.duration);
                crack.start(now + 0.4);
                crack.stop(now + config.duration);
                break;
            }

            case 'missile': {
                // Missile/Rocket: Continuous burning noise + low rumble
                const osc = this.ctx.createOscillator();
                const noise = this.ctx.createBufferSource();
                const filter = this.ctx.createBiquadFilter();

                osc.type = config.oscType;
                osc.frequency.setValueAtTime(config.baseFreq, now);
                noise.buffer = createNoiseBuffer(this.ctx);
                noise.loop = true;

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(config.filterFreq, now);

                weaponGain.gain.setValueAtTime(0.01, now);
                weaponGain.gain.linearRampToValueAtTime(0.4, now + 0.1); // Launch swell

                osc.connect(filter);
                noise.connect(filter);
                filter.connect(weaponGain);

                osc.start(now);
                noise.start(now);

                // Return control hooks so your game can choose when it impacts/stops tracking
                this.activeMissile = { osc, noise, gain: weaponGain };
                break;
            }

            case 'mine': {
                // Proximity Mine: Alternating Electronic Ping
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(config.baseFreq, now);

                weaponGain.gain.setValueAtTime(0.4, now);
                weaponGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

                osc.connect(weaponGain);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            }

            case 'explosion': {
                // Explosion: Heavy low-frequency noise bloom
                const noise = this.ctx.createBufferSource();
                noise.buffer = createNoiseBuffer(this.ctx);

                const lpFilter = this.ctx.createBiquadFilter();
                lpFilter.type = 'lowpass';
                // Start with a bright blast, immediately drop filter to simulate sub-bass rumble
                lpFilter.frequency.setValueAtTime(800, now);
                lpFilter.frequency.exponentialRampToValueAtTime(60, now + 0.5);

                weaponGain.gain.setValueAtTime(0.9, now);
                weaponGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

                noise.connect(lpFilter);
                lpFilter.connect(weaponGain);

                noise.start(now);
                noise.stop(now + config.duration);
                break;
            }
        }
    }

    stopMissile() {
        if (this.activeMissile) {
            const now = this.ctx.currentTime;
            this.activeMissile.gain.gain.cancelScheduledValues(now);
            this.activeMissile.gain.gain.setValueAtTime(this.activeMissile.gain.gain.value, now);
            this.activeMissile.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

            setTimeout(() => {
                try { this.activeMissile.osc.stop(); this.activeMissile.noise.stop(); } catch (e) { }
            }, 60);
        }
    }
}

const weapons = new SpaceshipWeapons(engine.ctx); 
