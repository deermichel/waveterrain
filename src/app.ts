import Orbit from "./orbit";
import SampledOrbit from "./sampled_orbit";
import SampledTerrain from "./sampled_terrain";
import Scene from "./scene";
import Terrain from "./terrain";
import { map } from "./utils";
import WaveTerrainNode from "./waveterrain_node";

// @ts-ignore
import WaveTerrainProcessor from "./waveterrain_processor?worker&url";

const terrainSegments = 16;
const orbitSegments = 64;

class App {
    private audioContext: AudioContext;
    private node: WaveTerrainNode;
    private scene: Scene;
    private terrainProvider: SampledTerrain;
    private orbitProvider: SampledOrbit;

    // parameters
    get centerX() { return map(this.node.parameters.get("centerX").value, -1, 1, 0, 1); }
    set centerX(centerX: number) { this.node.parameters.get("centerX").value = map(centerX, 0, 1, -1, 1); }
    get centerZ() { return map(this.node.parameters.get("centerZ").value, -1, 1, 0, 1); }
    set centerZ(centerZ: number) { this.node.parameters.get("centerZ").value = map(centerZ, 0, 1, -1, 1); }
    get radiusX() { return map(this.node.parameters.get("radiusX").value, 0, 2, 0, 1); }
    set radiusX(radiusX: number) { this.node.parameters.get("radiusX").value = map(radiusX, 0, 1, 0, 2); }
    get radiusZ() { return map(this.node.parameters.get("radiusZ").value, 2, 0, 0, 1); }
    set radiusZ(radiusZ: number) { this.node.parameters.get("radiusZ").value = map(radiusZ, 0, 1, 2, 0); }
    get freqX() { return map(this.node.parameters.get("freqX").value, 0, 8, 0, 1); }
    set freqX(freqX: number) { this.node.parameters.get("freqX").value = map(freqX, 0, 1, 0, 8); }
    get freqZ() { return map(this.node.parameters.get("freqZ").value, 0, 8, 0, 1); }
    set freqZ(freqZ: number) { this.node.parameters.get("freqZ").value = map(freqZ, 0, 1, 0, 8); }
    get phaseShift() { return map(this.node.parameters.get("phaseShift").value, 0, 2 * Math.PI, 0, 1); }
    set phaseShift(phaseShift: number) { this.node.parameters.get("phaseShift").value = map(phaseShift, 0, 1, 0, 2 * Math.PI); }

    constructor(canvas: HTMLCanvasElement) {
        this.setupAudio();
        this.setupScene(canvas);
    }

    public async start() {
        await this.audioContext.resume();
    }

    public render() {
        if (this.node) {
            this.node.getTerrain(terrainSegments).then((terrain) => {
                this.terrainProvider.setTerrain(terrain, terrainSegments);
            });
            this.node.getOrbit(orbitSegments).then((orbit) => {
                this.orbitProvider.setOrbit(orbit, orbitSegments);
            });
        }

        this.scene.render();
    }

    private async setupAudio() {
        this.audioContext = new AudioContext();
        this.audioContext.suspend();

        await this.audioContext.audioWorklet.addModule(WaveTerrainProcessor);
        this.node = new WaveTerrainNode(this.audioContext);
        this.node.connect(this.audioContext.destination);
    }

    private setupScene(canvas: HTMLCanvasElement) {
        this.scene = new Scene(canvas);

        this.terrainProvider = new SampledTerrain();
        const terrain = new Terrain(this.terrainProvider, terrainSegments, 3);
        this.scene.add(terrain);

        this.orbitProvider = new SampledOrbit();
        const orbit = new Orbit(this.orbitProvider, this.terrainProvider);
        this.scene.add(orbit);
    }
}

export default App;
