const audCtx = new (window.AudioContext || window.webkitAudioContext)();

const analyser = new AnalyserNode(audCtx, {
    fftSize: 2048,
});

const osc = new OscillatorNode(audCtx, {
    frequency: 440,
})

osc.connect(analyser);


audCtx.connect(analyser);
analyser.connect(audCtx.destination);

addEventListener("click", () => {
    if (audCtx.state === 'suspended' || audCtx.state === 'interrupted' || audCtx.state === 'closed') {
        alert("Started")
        osc.start();
    }
})