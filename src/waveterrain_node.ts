import Deferred from "./deferred";

class WaveTerrainNode extends AudioWorkletNode {
    private terrainDeferred?: Deferred<Float32Array>;

    constructor(context: AudioContext) {
        super(context, "waveterrain_processor");
        this.port.onmessage = this.onMessage.bind(this);
    }

    onMessage(event: MessageEvent) {
        if (event.data.type === "terrain") {
            if (!this.terrainDeferred?.resolve) {
                throw new Error("terrainDeferred not ready");
            }
            this.terrainDeferred.resolve(event.data.terrain);
            this.terrainDeferred = undefined;
        }
    }

    async getTerrain(segments: number) {
        if (!this.terrainDeferred) {
            this.terrainDeferred = new Deferred(() => {
                this.port.postMessage({ type: "getTerrain", segments });
            });
        }
        return this.terrainDeferred.promise;
    }
}

export default WaveTerrainNode;
