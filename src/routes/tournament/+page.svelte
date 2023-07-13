<script lang="ts">
	import { Card } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";

	export let data: PageData;

	let idx = 0;

	const decIdx = () => {
		if (idx > 0) {
			idx = idx - 1;
		}
	};
	const incIdx = () => {
		if (idx < data.rounds.length - 1) {
			idx = idx + 1;
		}
	};
	const setIdx = (i: number) => {
		return () => {
			idx = i;
		};
	};

	let games: (typeof data.rounds)[number];
	$: {
		games = data.rounds[idx];
	}
</script>

<div class="mx-auto mt-4 w-full flex justify-center space-x-4 text-xl font-semibold">
	<button on:click={decIdx} class="text-gray-300">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<path fill="currentColor" d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6L14 18Z" />
		</svg>
	</button>
	{#each data.rounds as _, i}
		<button
			on:click={setIdx(i)}
			class={`rounded-full px-4 py-2 ${i === idx ? "bg-orange-500" : ""}`}
		>
			{i + 1}
		</button>
	{/each}
	<button on:click={incIdx} class="text-gray-300">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<path fill="currentColor" d="M9.4 18L8 16.6l4.6-4.6L8 7.4L9.4 6l6 6l-6 6Z" />
		</svg>
	</button>
</div>

<h1 class="text-3xl text-center my-4">Tounament Round {idx + 1}</h1>

<div class="flex flex-col space-y-4 pt-4 justify-between items-center">
	{#each games as game}
		<button class="w-full max-w-2xl p-0">
			<Card class="w-full space-y-8 text-xl mx-auto hover:dark:bg-gray-700" size="lg">
				{#if game.team1}
					<div class="flex justify-between w-full">
						<span>{getTeamName(game.team1.players)}</span>
						<span>({game.team1.seed})</span>
					</div>
				{:else}
					<p class="italic">Team 1 not yet determined</p>
				{/if}

				{#if game.team2}
					<div class="flex justify-between w-full">
						<span>{getTeamName(game.team2.players)}</span>
						<span>({game.team2.seed})</span>
					</div>
				{:else}
					<p class="italic">Team 2 not yet determined</p>
				{/if}
			</Card>
		</button>
	{/each}
</div>
