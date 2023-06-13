<script lang="ts">
    import ControlPane from "./ControlPane.svelte";
    import XYPad from "./XYPad.svelte";
    // import { onMount } from "svelte";
    // import SceneComponent from "./Scene.svelte";
    // import Scene from "../scene";

    // let canvas: HTMLCanvasElement;

    // onMount(() => {
    //     const scene = new Scene(canvas);
    //     const render = () => {
    //         requestAnimationFrame(render);
    //         scene.render();
    //     };
    //     render();
    // });
</script>

<div class="flex bg-gray-900">
    <ControlPane />
</div>
