const AudioGraph = {
    nodes: new Map(),
    edges: []
};

const originalConnect = AudioNode.prototype.connect;

AudioNode.prototype.connect = function (destination, name) {

    // Give nodes ids
    if (!this.__graphId) {
        this.__graphId = crypto.randomUUID();
    }

    if (!destination.__graphId) {
        destination.__graphId = crypto.randomUUID();
    }

    // Optional name
    if (name)
        destination.__graphName = name;

    AudioGraph.nodes.set(this.__graphId, {
        id: this.__graphId,
        node: this,
        name:
            this.__graphName ||
            this.constructor.name
    });

    AudioGraph.nodes.set(destination.__graphId, {
        id: destination.__graphId,
        node: destination,
        name:
            destination.__graphName ||
            destination.constructor.name
    });

    AudioGraph.edges.push({
        from: this.__graphId,
        to: destination.__graphId
    });

    drawAudioGraph();

    return originalConnect.call(this, destination);
};

AudioNode.prototype.setName = function (name) {
    this.__graphName = name;
    return this;
};

const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

function drawAudioGraph() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodes = [...AudioGraph.nodes.values()];

    // simple vertical layout
    nodes.forEach((node, i) => {

        node.x = canvas.width / 2;
        node.y = 80 + i * 100;

    });

    // draw edges
    AudioGraph.edges.forEach(edge => {

        const a = AudioGraph.nodes.get(edge.from);
        const b = AudioGraph.nodes.get(edge.to);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

    });

    // draw nodes
    nodes.forEach(node => {

        ctx.fillStyle = "#222";
        ctx.strokeStyle = "#00ff88";

        ctx.beginPath();
        ctx.roundRect(node.x - 60, node.y - 20, 120, 40, 8);

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, node.y + 5);

    });

}