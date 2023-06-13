<script lang="ts">
    import { bind } from "svelte/internal";
import Control from "./Control.svelte";
    import Slider from "./Slider.svelte";
    import XYPad from "./XYPad.svelte";

    export let centerX: number;
    export let centerY: number;
    export let radiusX: number;
    export let radiusY: number;
    export let freqX: number;
    export let freqY: number;
    export let phaseShift: number;
</script>

<div class="bg-gray-800 text-white">

    <!-- xy pads -->
    <div class="flex m-8">
        <Control label="Center XY">
            <XYPad
                bind:x={centerX}
                bind:y={centerY}
            />
        </Control>

        <div class="w-8"></div>

        <Control label="Radius XY">
            <XYPad
                bind:x={radiusX}
                bind:y={radiusY}
            />
        </Control>
    </div>

    <!-- sliders -->
    <div class="flex flex-col m-8">
        <Control label="Frequency X">
            <Slider bind:v={freqX} />
        </Control>

        <div class="h-8"></div>

        <Control label="Frequency Y">
            <Slider bind:v={freqY} />
        </Control>

        <div class="h-8"></div>

        <Control label="Phase Shift">
            <Slider bind:v={phaseShift} />
        </Control>
    </div>

</div>
