import Scene from "./scene";
import Terrain from "./terrain";
import WaveTerrainNode from "./waveterrain_node";
import SampledTerrain from "./sampled_terrain";
import SampledOrbit from "./sampled_orbit";
import Orbit from "./orbit";
import { map } from "./utils";

const segments = 16;

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const scene = new Scene(canvas);

const terrainProvider = new SampledTerrain();
const terrain = new Terrain(terrainProvider, segments);
scene.add(terrain);

const orbitProvider = new SampledOrbit();
const orbit = new Orbit(orbitProvider, terrainProvider);
scene.add(orbit);

let audioContext = new AudioContext();
let node: WaveTerrainNode;

document.getElementById("cx")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, -1, 1);
    node.parameters.get("centerX")!.value = v;
});
document.getElementById("cz")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, -1, 1);
    node.parameters.get("centerZ")!.value = v;
});
document.getElementById("rx")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, 0, 1);
    node.parameters.get("radiusX")!.value = v;
});
document.getElementById("rz")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, 0, 1);
    node.parameters.get("radiusZ")!.value = v;
});
document.getElementById("fx")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, 0, 10);
    node.parameters.get("freqX")!.value = v;
});
document.getElementById("fz")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, 0, 10);
    node.parameters.get("freqZ")!.value = v;
});
document.getElementById("ps")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, 0, 2 * Math.PI);
    node.parameters.get("phaseShift")!.value = v;
});

// click listener
document.addEventListener("click", async () => {
    if (audioContext.state === "suspended") {
        await audioContext.audioWorklet.addModule("/src/waveterrain_processor.ts");
        node = new WaveTerrainNode(audioContext);
        // node.connect(audioContext.destination);

        console.log("resuming audio context");
        audioContext.resume();
    }
});

// render loop
const render = () => {
    requestAnimationFrame(render);

    if (node) {
        node.getTerrain(segments).then((terrain) => {
            terrainProvider.setTerrain(terrain, segments);
        });
        node.getOrbit(4 * segments).then((orbit) => {
            orbitProvider.setOrbit(orbit, 4 * segments);
        });
    }

    scene.render();
};
render();
