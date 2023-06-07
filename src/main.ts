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
const sliderFreqX = document.getElementById("slider-freqx")!;
const sliderFreqY = document.getElementById("slider-freqy")!;
const sliderPhaseShift = document.getElementById("slider-phaseshift")!;
let target: HTMLElement | undefined;
const pointerMoveListener = (event: PointerEvent) => {
    if (!target) throw new Error("No target");
    const handle = target.getElementsByClassName("handle")[0] as HTMLElement;

    const rect = target.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, target.clientWidth);
    const y = clamp(event.clientY - rect.top, 0, target.clientHeight);

    handle.style.left = `${x}px`;
    if (target.id.includes("xypad")) handle.style.top = `${y}px`;

    if (target === xyPadCenter) {
        node.parameters.get("centerX")!.value = map(x, 0, target.clientWidth, -1, 1);
        node.parameters.get("centerZ")!.value = map(y, 0, target.clientHeight, -1, 1);
    } else if (target === xyPadRadius) {
        node.parameters.get("radiusX")!.value = map(x, 0, target.clientWidth, 0, 2);
        node.parameters.get("radiusZ")!.value = map(y, 0, target.clientHeight, 2, 0);
    } else if (target === sliderFreqX) {
        node.parameters.get("freqX")!.value = map(x, 0, target.clientWidth, 0, 10);
    } else if (target === sliderFreqY) {
        node.parameters.get("freqZ")!.value = map(x, 0, target.clientWidth, 0, 10);
    } else if (target === sliderPhaseShift) {
        node.parameters.get("phaseShift")!.value = map(x, 0, target.clientWidth, 0, 2 * Math.PI);
    }
};
[xyPadCenter, xyPadRadius, sliderFreqX, sliderFreqY, sliderPhaseShift].forEach((elem) => {
    elem.addEventListener("pointerdown", () => {
        target = elem;
        elem.style.borderColor = "orange";
        window.addEventListener("pointermove", pointerMoveListener);
    });
});
window.addEventListener("pointerup", () => {
    if (target) target.style.borderColor = "white";
    target = undefined;
    window.removeEventListener("pointermove", pointerMoveListener);
});

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
