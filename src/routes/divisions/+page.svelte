<script lang="ts">
	import { Button } from "flowbite-svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="p-4">
	<h1 class="text-3xl mb-4">Divisions</h1>
	<p class="text-xl mb-2">Select a division to go to prelim games</p>

	{#if data?.divisions}
		<ul class="space-y-4">
			{#each data.divisions as division (division.id)}
				<li class="max-w-md">
					<a href={`/division/${division.id}`}>
						<Button class="text-lg w-full">{division.name}</Button>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No Divisions!</p>
	{/if}
</div>
