<script lang="ts">
    import { onMount } from "svelte";
    import ControlPane from "./ControlPane.svelte";
    import SceneComponent from "./Scene.svelte";
    import Scene from "../scene";
    import WaveTerrainNode from "../waveterrain_node";
    import SampledTerrain from "../sampled_terrain";
    import Terrain from "../terrain";
    import SampledOrbit from "../sampled_orbit";
    import Orbit from "../orbit";
    import { map } from "../utils";

    const audioContext = new AudioContext();
    const segments = 16;

    let canvas: HTMLCanvasElement;
    let node: WaveTerrainNode;
    let centerX: number = 0.5;
    let centerY: number = 0.5;
    let radiusX: number = 0.5;
    let radiusY: number = 0.5;
    let freqX: number = 1 / 10;
    let freqY: number = 1 / 10;
    let phaseShift: number = 1 / 4;

    $: if (node) {
        node.parameters.get("centerX").value = map(centerX, 0, 1, -1, 1);
        node.parameters.get("centerZ").value = map(centerY, 0, 1, -1, 1);
        node.parameters.get("radiusX").value = map(radiusX, 0, 1, 0, 2);
        node.parameters.get("radiusZ").value = map(radiusY, 0, 1, 2, 0);
        node.parameters.get("freqX").value = map(freqX, 0, 1, 0, 10);
        node.parameters.get("freqZ").value = map(freqY, 0, 1, 0, 10);
        node.parameters.get("phaseShift").value = map(phaseShift, 0, 1, 0, 2 * Math.PI);
    }

    // click listener
    window.addEventListener("click", async () => {
        if (!node) {
            await audioContext.audioWorklet.addModule("/src/waveterrain_processor.ts");
            node = new WaveTerrainNode(audioContext);
            node.connect(audioContext.destination);
        }

        if (audioContext.state === "suspended") {
            console.log("resuming audio context");
            audioContext.resume();
        }
    });

    onMount(() => {
        const scene = new Scene(canvas);

        const terrainProvider = new SampledTerrain();
        const terrain = new Terrain(terrainProvider, segments);
        scene.add(terrain);

        const orbitProvider = new SampledOrbit();
        const orbit = new Orbit(orbitProvider, terrainProvider);
        scene.add(orbit);

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
    });
</script>

<div class="w-screen h-screen flex bg-gray-900">
    <SceneComponent bind:canvas />
    <ControlPane
        bind:centerX
        bind:centerY
        bind:radiusX
        bind:radiusY
        bind:freqX
        bind:freqY
        bind:phaseShift
    />
</div>
