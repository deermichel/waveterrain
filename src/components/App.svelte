<script lang="ts">
    import { onMount } from "svelte";
    import ControlPane from "./ControlPane.svelte";
    import SceneComponent from "./Scene.svelte";
    import App from "../app";

    let app: App;
    let canvas: HTMLCanvasElement;
    let started: boolean = false;

    onMount(() => {
        // init app
        app = new App(canvas);

        // start listener
        document.addEventListener("click", () => {
            app.start();
            started = true;
        }, { once: true });

        // render loop
        const render = () => {
            requestAnimationFrame(render);
            app.render();
        };
        render();
    });
</script>

<div class="lg:h-screen flex flex-col lg:flex-row select-none font-mono">
    <!-- 3d scene -->
    <SceneComponent bind:canvas />

    <!-- sidebar -->
    <div class="flex flex-col items-center lg:w-[420px] py-8 overflow-x-auto text-white">
        <span class="text-3xl font-bold mb-8">waveterrain</span>

        {#if !started}
            <!-- onboarding -->
            <div class="flex-1 flex items-center">
                <span class="text-xl">tap to start</span>
            </div>
        {:else}
            <!-- main controls -->
            <ControlPane
                bind:centerX={app.centerX}
                bind:centerY={app.centerZ}
                bind:radiusX={app.radiusX}
                bind:radiusY={app.radiusZ}
                bind:freqX={app.freqX}
                bind:freqY={app.freqZ}
                bind:phaseShift={app.phaseShift}
            />
        {/if}

        <span class="text-xs mt-8">(c) 2023 deermichel</span>
    </div>
</div>

<style>
    @supports (-webkit-touch-callout: none) {
        @media (min-width: 1024px) {
            .lg\:h-screen {
                height: -webkit-fill-available;
            }
        }
    }
</style>
