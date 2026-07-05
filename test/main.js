const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

export const audCtx =
    new (window.AudioContext || window.webkitAudioContext)();

// Create one analyser for the entire application
const analyser = audCtx.createAnalyser();
analyser.fftSize = 2048;
analyser.connect(audCtx.destination);

/**
 * Generate a beep sound
 * @param {number} frequency Frequency in Hz
 * @param {number} duration Duration in seconds
 * @param {string} type Oscillator type
 */
function beep(
    frequency = 400,
    duration = 0.4,
    type = "sine"
) {
    const now = audCtx.currentTime;

    const osc = audCtx.createOscillator();
    const gainNode = audCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    // Connect nodes
    osc.connect(gainNode);
    gainNode.connect(analyser);

    // Envelope (Attack / Release)
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(
        1,
        now + 0.02
    );
    gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    osc.start(now);
    osc.stop(now + duration);

    osc.onended = () => {
        osc.disconnect();
        gainNode.disconnect();
    };
}

function RocketEngineSound() {
    const osc = new OscillatorNode(audCtx, {
        frequency: 400,
        type: "sine",
    })

    const lfo = new OscillatorNode(audCtx, {
        frequency: 10000,
        type: "sawtooth"
    })

    const gainNode = new GainNode(audCtx, {
        gain: 600,
    })


    lfo.connect(gainNode);

    osc.
    osc.connect(analyser);

    osc.start();
}

/**
 * Play a sequence of notes
 */
function playSequence(notes, interval = 1000) {
    notes.forEach((frequency, index) => {
        setTimeout(() => {
            beep(frequency);
        }, index * interval);
    });
}

// Start audio after user interaction
window.addEventListener("click", async () => {
    if (audCtx.state === "suspended") {
        await audCtx.resume();
    }

    RocketEngineSound()
});

function drawWaveform() {
    const bufferLength = analyser.fftSize;
    const data = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(data);

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.beginPath();

    for (let i = 0; i < bufferLength; i++) {
        const x =
            (i / bufferLength) * canvas.width;

        const y =
            canvas.height / 2 +
            ((data[i] - 128) / 128) * 150;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.lineWidth = 2;
    ctx.stroke();

    requestAnimationFrame(drawWaveform);
}

drawWaveform();