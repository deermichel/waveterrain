import Scene from "./scene";
import Terrain from "./terrain";
import WaveTerrainNode from "./waveterrain_node";
import SampledTerrainProvider from "./sampled_terrain_provider";

const segments = 16;

const scene = new Scene();
const terrainProvider = new SampledTerrainProvider();
const terrain = new Terrain(terrainProvider, segments);
scene.add(terrain);

let audioContext = new AudioContext();
let node: WaveTerrainNode;

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
    }

    scene.render();
};
render();
