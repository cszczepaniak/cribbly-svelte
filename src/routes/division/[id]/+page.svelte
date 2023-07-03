<script lang="ts">
	import { Card } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";
	import { page } from "$app/stores";
	import type { Game, Player, Team } from "@prisma/client";

	export let data: PageData;

	let games: typeof data.games = [];
	$: {
		games = data.games?.sort((a, b) => {
			if (a.winner && !b.winner) {
				// If A has a winner and B doesn't, A is "greater" than B (we want it to go later in the list)
				return 1;
			} else if (!a.winner && b.winner) {
				// If A does not have a winner and B does, A is "less" than B (we want it to go earlier in the list)
				return -1;
			}
			// Otherwise, consider them equal
			return 0;
		});
	}

	const teamName = (team: { id: string; players: Player[] } | undefined, game: Game) => {
		let name = getTeamName(team?.players);
		if (game.winner === team?.id) {
			return name + " 🏆";
		}
		return name;
	};
</script>

{#if data?.games}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.games as game (game.id)}
			{#if game.winner}
				<Card>
					<div>{teamName(game?.team1, game)}</div>
					<span>VS</span>
					<div>{teamName(game?.team2, game)}</div>
				</Card>
			{:else}
				<a href={`/game/${game.id}?fromDivision=${$page.params.id}`} class="hover:cursor-auto">
					<Card class="hover:cursor-pointer hover:dark:bg-gray-700">
						<div>{teamName(game?.team1, game)}</div>
						<span>VS</span>
						<div>{teamName(game?.team2, game)}</div>
					</Card>
				</a>
			{/if}
		{/each}
	</div>
{:else}
	No Games!
{/if}
