import { map } from "./utils";

class SimpleTerrain implements TerrainProvider {
    evaluate(x: number, z: number) {
        return (x-z) * (x-1) * (x+1) * (z-1) * (z+1);
    }
}

class SimpleOrbit implements OrbitProvider {
    evaluate(t: number) {
        return { x: Math.cos(2*Math.PI*t), z: Math.sin(2*Math.PI*t) };
    }
}

class WaveTerrainProcessor extends AudioWorkletProcessor {
    private terrainProvider: TerrainProvider;
    private orbitProvider: OrbitProvider;
    private phase: number;

    constructor() {
        super();
        this.terrainProvider = new SimpleTerrain();
        this.orbitProvider = new SimpleOrbit();
        this.phase = 0;
        this.port.onmessage = this.onMessage.bind(this);
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], params: Record<string, Float32Array>) {
        const output = outputs[0];
        const numChannels = output.length;
        const numSamples = (numChannels > 0) ? output[0].length : 0;

        for (let i = 0; i < numSamples; i++) {
            const { x, z } = this.orbitProvider.evaluate(this.phase);
            const y = this.terrainProvider.evaluate(x, z);
            for (let channel = 0; channel < numChannels; channel++) {
                output[channel][i] = y;
            }

            const frequency = 20;
            this.phase += frequency / 44100;
            this.phase %= 1;
        }

        return true;
    }

    private onMessage(event: MessageEvent) {
        if (event.data.type === "getTerrain") {
            this.getTerrain(event.data.segments);
        }
    }

    private getTerrain(segments: number) {
        const terrain = new Float32Array(segments * segments);
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const x = map(i, 0, segments, -1, 1);
                const z = map(j, 0, segments, -1, 1);
                terrain[i * segments + j] = this.terrainProvider.evaluate(x, z);
            }
        }
        this.port.postMessage({ type: "terrain", terrain });
    }
}

registerProcessor("waveterrain_processor", WaveTerrainProcessor);
