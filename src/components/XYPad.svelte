<script lang="ts">
    import { clamp } from "../utils";

    export let x = 0.5;
    export let y = 0.5;

    const handleSize = 32;

    let el: HTMLElement;
    let padHeight = 0;
    let padWidth = 0;
    $: maxOffsetX = padWidth - handleSize;
    $: maxOffsetY = padHeight - handleSize;

    const onPointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - handleSize / 2;
        const offsetY = event.clientY - rect.top - handleSize / 2;

        x = clamp(offsetX, 0, maxOffsetX) / maxOffsetX;
        y = clamp(offsetY, 0, maxOffsetY) / maxOffsetY;
    };

    const onPointerUp = () => {
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
    };

    const onPointerDown = () => {
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointermove", onPointerMove);
    };
</script>

<!-- pad -->
<div
    class="w-40 h-40 rounded-2xl bg-gray-500"
    bind:clientHeight={padHeight}
    bind:clientWidth={padWidth}
    bind:this={el}
    on:pointerdown={onPointerDown}
>
    <!-- handle -->
    <div
        class="rounded-full bg-white"
        style:height="{handleSize}px"
        style:width="{handleSize}px"
        style:transform="translate({x * maxOffsetX}px, {y * maxOffsetY}px)"
    >
    </div>
</div>
