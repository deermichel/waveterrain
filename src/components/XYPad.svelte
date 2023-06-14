<script lang="ts">
    import { clamp } from "../utils";

    export let x = 0.5;
    export let y = 0.5;

    const handleSize = 32;

    let el: HTMLElement;
    let padHeight = 0;
    let padWidth = 0;
    let pointerId = -1;
    $: maxOffsetX = padWidth - handleSize;
    $: maxOffsetY = padHeight - handleSize;
    $: active = pointerId !== -1;

    const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        const rect = el.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - handleSize / 2;
        const offsetY = event.clientY - rect.top - handleSize / 2;

        x = clamp(offsetX, 0, maxOffsetX) / maxOffsetX;
        y = clamp(offsetY, 0, maxOffsetY) / maxOffsetY;
    };

    const onPointerUp = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
        pointerId = -1;
    };

    const onPointerDown = (event: PointerEvent) => {
        pointerId = event.pointerId;
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointermove", onPointerMove);

        // reset to default
        if (event.altKey) {
            x = 0.5;
            y = 0.5;
        }
    };
</script>

<!-- pad -->
<div
    class="w-40 h-40 rounded-2xl bg-gray-700 touch-none"
    bind:clientHeight={padHeight}
    bind:clientWidth={padWidth}
    bind:this={el}
    on:pointerdown={onPointerDown}
>
    <!-- handle -->
    <div
        class="rounded-full transition-colors"
        class:bg-white={!active}
        class:bg-rose-300={active}
        style:height="{handleSize}px"
        style:width="{handleSize}px"
        style:transform="translate({x * maxOffsetX}px, {y * maxOffsetY}px)"
    >
    </div>
</div>
