import { map } from "./utils";

class SimpleTerrain implements TerrainProvider {
    evaluate(x: number, z: number) {
        // wrap x and z to [-1, 1)
        while (x < -1) x += 2;
        while (x >= 1) x -= 2;
        while (z < -1) z += 2;
        while (z >= 1) z -= 2;

        const y = (x-z) * (x-1) * (x+1) * (z-1) * (z+1);
        return y;
    }
}

class SimpleOrbit implements OrbitProvider {
    evaluate(t: number) {
        // wrap t to [0, 1)
        while (t < 0) t += 1;
        while (t >= 1) t -= 1;

        const x = 0.7*Math.cos(2*Math.PI*t) - 0.5;
        const z = 0.8*Math.sin(4*Math.PI*t);
        return { x, z };
    }
}

class WaveTerrainProcessor extends AudioWorkletProcessor {
    private terrainProvider: TerrainProvider;
    private orbitProvider: OrbitProvider;
    private phase: number;
    private centerX: number;

    static get parameterDescriptors() {
        return [
            {
                name: "centerX",
                defaultValue: 0,
                minValue: -1,
                maxValue: 1,
            },
        ];
    }

    constructor() {
        super();
        this.terrainProvider = new SimpleTerrain();
        this.orbitProvider = new SimpleOrbit();
        this.phase = 0;
        this.centerX = 0;
        this.port.onmessage = this.onMessage.bind(this);
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], params: Record<string, Float32Array>) {
        const output = outputs[0];
        const numChannels = output.length;
        const numSamples = (numChannels > 0) ? output[0].length : 0;

        this.centerX = params.centerX[0];

        for (let i = 0; i < numSamples; i++) {
            // TODO
            const x = 0.7*Math.cos(2*Math.PI*this.phase) + this.centerX;

            const { z } = this.orbitProvider.evaluate(this.phase);
            const y = this.terrainProvider.evaluate(x, z);
            for (let channel = 0; channel < numChannels; channel++) {
                output[channel][i] = y;
            }

            const frequency = 20;
            this.phase += frequency / sampleRate;
            this.phase %= 1;
        }

        return true;
    }

    private onMessage(event: MessageEvent) {
        if (event.data.type === "getTerrain") {
            this.getTerrain(event.data.segments);
        } else if (event.data.type === "getOrbit") {
            this.getOrbit(event.data.segments);
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

    private getOrbit(segments: number) {
        const orbit = new Float32Array(segments * 2);
        for (let i = 0; i < segments; i++) {
            const t = map(i, 0, segments, 0, 1);
            const { z } = this.orbitProvider.evaluate(t);

            // TODO
            const x = 0.7*Math.cos(2*Math.PI*t) + this.centerX;

            orbit[i * 2 + 0] = x;
            orbit[i * 2 + 1] = z;
        }
        this.port.postMessage({ type: "orbit", orbit });
    }
}

registerProcessor("waveterrain_processor", WaveTerrainProcessor);
