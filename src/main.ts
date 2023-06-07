import Scene from "./scene";
import Terrain from "./terrain";
import WaveTerrainNode from "./waveterrain_node";
import SampledTerrain from "./sampled_terrain";
import SampledOrbit from "./sampled_orbit";
import Orbit from "./orbit";
import { clamp, map } from "./utils";

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

const xyPadCenter = document.getElementById("xypad-center")!;
const xyPadRadius = document.getElementById("xypad-radius")!;
let target: HTMLElement | undefined;
const pointerMoveListener = (event: PointerEvent) => {
    if (!target) throw new Error("No target");
    const handle = target.getElementsByClassName("handle")[0] as HTMLElement;

    const rect = target.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, target.clientWidth);
    const y = clamp(event.clientY - rect.top, 0, target.clientHeight);

    handle.style.left = `${x}px`;
    handle.style.top = `${y}px`;

    if (target === xyPadCenter) {
        node.parameters.get("centerX")!.value = map(x, 0, target.clientWidth, -1, 1);
        node.parameters.get("centerZ")!.value = map(y, 0, target.clientHeight, -1, 1);
    } else if (target === xyPadRadius) {
        node.parameters.get("radiusX")!.value = map(x, 0, target.clientWidth, 0, 2);
        node.parameters.get("radiusZ")!.value = map(y, 0, target.clientHeight, 2, 0);
    }
};
[xyPadCenter, xyPadRadius].forEach((xyPad) => {
    xyPad.addEventListener("pointerdown", () => {
        target = xyPad;
        xyPad.style.borderColor = "orange";
        window.addEventListener("pointermove", pointerMoveListener);
    });
});
window.addEventListener("pointerup", () => {
    if (target) target.style.borderColor = "white";
    target = undefined;
    window.removeEventListener("pointermove", pointerMoveListener);
});

// document.getElementById("fx")!.addEventListener("input", (event: any) => {
//     const v = map(event.target.value, 0, 10, 0, 10);
//     node.parameters.get("freqX")!.value = v;
// });
// document.getElementById("fz")!.addEventListener("input", (event: any) => {
//     const v = map(event.target.value, 0, 100, 0, 10);
//     node.parameters.get("freqZ")!.value = v;
// });
// document.getElementById("ps")!.addEventListener("input", (event: any) => {
//     const v = map(event.target.value, 0, 100, 0, 2 * Math.PI);
//     node.parameters.get("phaseShift")!.value = v;
// });

// click listener
document.addEventListener("click", async () => {
    if (audioContext.state === "suspended") {
        await audioContext.audioWorklet.addModule("/src/waveterrain_processor.ts");
        node = new WaveTerrainNode(audioContext);
        node.connect(audioContext.destination);

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
