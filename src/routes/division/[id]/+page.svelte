<script lang="ts">
	import { Button, Card } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";
	import { page } from "$app/stores";
	import { devTools } from "$lib/stores/devtools";
	import type { Player, PrelimGame } from "@prisma/client";
	import { enhance } from "$app/forms";

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

	const teamName = (team: { id: string; players: Player[] } | undefined, game: PrelimGame) => {
		let name = getTeamName(team?.players);
		if (game.winner === team?.id) {
			return name + " 🏆";
		}
		return name;
	};
</script>

{#if data?.games}
	<div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.games as game (game.id)}
			{#if game.winner}
				<Card size="lg">
					<div>{teamName(game?.team1, game)}</div>
					<span>VS</span>
					<div>{teamName(game?.team2, game)}</div>
				</Card>
			{:else}
				<a href={`/game/${game.id}?fromDivision=${$page.params.id}`} class="hover:cursor-auto">
					<Card size="lg" class="hover:cursor-pointer hover:dark:bg-gray-700">
						<div>{teamName(game?.team1, game)}</div>
						<span>VS</span>
						<div>{teamName(game?.team2, game)}</div>
					</Card>
				</a>
			{/if}
		{/each}
	</div>
	{#if $devTools && $page.data.isAdmin}
		<form method="POST" action="?/completeAll" use:enhance>
			<input type="hidden" name="divisionID" value={$page.params.id} />
			<Button type="submit">Complete All</Button>
		</form>
	{/if}
{:else}
	No Games!
{/if}
