import { default as initModule } from "./cpp/waveterrain.js";
const Module = initModule();

class Processor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = this.handleMessage.bind(this);
        this.kernel = new Module.WaveTerrain();
    }

    handleMessage(message) {
        if (message.data.message === "get_terrain") {
            const terrainBuffer = new Float32Array(512 * 512);
            terrainBuffer[2] = 1.0;
            this.port.postMessage({ message: "terrain", terrain: terrainBuffer });
        }
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        return true;
    }
}

registerProcessor("processor", Processor);
