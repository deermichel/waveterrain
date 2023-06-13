<script lang="ts">
    export let label: string;
</script>

<div class="flex flex-col items-center">
    <slot></slot>
    <span class="mt-1">
        {label}
    </span>
</div>
