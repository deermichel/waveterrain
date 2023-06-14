<script lang="ts">
    import { clamp } from "../utils";

    export let v = 0.5;
    export let resolution = undefined;
    export let defaultValue = undefined;

    const handleSize = 32;

    let el: HTMLElement;
    let sliderWidth = 0;
    let pointerId = -1;
    $: maxOffset = sliderWidth - handleSize;

    const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        const rect = el.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - handleSize / 2;

        v = clamp(offsetX, 0, maxOffset) / maxOffset;

        // step or fine mode
        if (resolution && !event.shiftKey) {
            v = Math.round(v * resolution) / resolution;
        }
    };

    const onPointerUp = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
    };

    const onPointerDown = (event: PointerEvent) => {
        pointerId = event.pointerId;
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointermove", onPointerMove);

        // reset to default
        if (defaultValue && event.altKey) {
            v = defaultValue;
        }
    };
</script>

<!-- slider -->
<div
    class="w-full rounded-full bg-gray-500 touch-none"
    bind:clientWidth={sliderWidth}
    bind:this={el}
    on:pointerdown={onPointerDown}
>
    <!-- handle -->
    <div
        class="rounded-full bg-white"
        style:height="{handleSize}px"
        style:width="{handleSize}px"
        style:transform="translate({v * maxOffset}px, 0)"
    >
    </div>
</div>
