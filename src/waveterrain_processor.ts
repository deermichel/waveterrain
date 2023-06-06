import SimpleOrbit, { SimpleOrbitParams } from "./simple_orbit";
import SimpleTerrain from "./simple_terrain";
import { map } from "./utils";

class WaveTerrainProcessor extends AudioWorkletProcessor {
    private terrainProvider: TerrainProvider;
    private orbitProvider: SimpleOrbit;
    private orbitParams: Partial<SimpleOrbitParams> = {};
    private phase: number = 0;

    static get parameterDescriptors() {
        return [
            { name: "centerX", defaultValue: 0, minValue: -1, maxValue: 1 },
            { name: "centerZ", defaultValue: 0, minValue: -1, maxValue: 1 },
            { name: "radiusX", defaultValue: 1, minValue: 0, maxValue: 1 },
            { name: "radiusZ", defaultValue: 1, minValue: 0, maxValue: 1 },
            { name: "freqX", defaultValue: 1, minValue: 0, maxValue: 10 },
            { name: "freqZ", defaultValue: 1, minValue: 0, maxValue: 10 },
            { name: "phaseShift", defaultValue: Math.PI / 2, minValue: 0, maxValue: 2 * Math.PI },
        ];
    }

    constructor() {
        super();
        this.terrainProvider = new SimpleTerrain();
        this.orbitProvider = new SimpleOrbit();
        this.port.onmessage = this.onMessage.bind(this);
    }

    process(_inputs: Float32Array[][], outputs: Float32Array[][], params: Record<string, Float32Array>) {
        const output = outputs[0];
        const numChannels = output.length;
        const numSamples = (numChannels > 0) ? output[0].length : 0;

        // update internal parameters
        this.orbitParams.centerX = params.centerX[0];
        this.orbitParams.centerZ = params.centerZ[0];
        this.orbitParams.radiusX = params.radiusX[0];
        this.orbitParams.radiusZ = params.radiusZ[0];
        this.orbitParams.freqX = params.freqX[0];
        this.orbitParams.freqZ = params.freqZ[0];
        this.orbitParams.phaseShift = params.phaseShift[0];

        for (let i = 0; i < numSamples; i++) {
            const { x, z } = this.orbitProvider.evaluate(this.phase, this.orbitParams);
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
            const { x, z } = this.orbitProvider.evaluate(t, this.orbitParams);
            orbit[i * 2 + 0] = x;
            orbit[i * 2 + 1] = z;
        }
        this.port.postMessage({ type: "orbit", orbit });
    }
}

registerProcessor("waveterrain_processor", WaveTerrainProcessor);
