import Scene from "./scene";
import Terrain from "./terrain";
import WaveTerrainNode from "./waveterrain_node";
import SampledTerrainProvider from "./sampled_terrain_provider";
import SampledOrbitProvider from "./sampled_orbit_provider";
import Orbit from "./orbit";
import { map } from "./utils";

const segments = 16;

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const scene = new Scene(canvas);

const terrainProvider = new SampledTerrainProvider();
const terrain = new Terrain(terrainProvider, segments);
scene.add(terrain);

const orbitProvider = new SampledOrbitProvider();
const orbit = new Orbit(orbitProvider, terrainProvider);
scene.add(orbit);

let audioContext = new AudioContext();
let node: WaveTerrainNode;

document.getElementById("cx")!.addEventListener("input", (event: any) => {
    const v = map(event.target.value, 0, 100, -1, 1);
    node.parameters.get("centerX")!.value = v;
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
