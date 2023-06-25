<script lang="ts">
	export let zodError: { _errors: string[] } | undefined;
</script>

{#if zodError}
	<span class="text-red-600">{zodError._errors.join(", ")}</span>
{/if}
