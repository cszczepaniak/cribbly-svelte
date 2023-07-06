<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableHead, TableHeadCell } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";
	import { subscribeToGameUpdates } from "$lib/realtime";
	import { flip } from "svelte/animate";
	import { computeStatsForTeams } from "$lib/games";

	export let data: PageData;

	let width = 0;
	let smallLayout = false;
	$: {
		smallLayout = width < 1024;
	}

	const hasNoGames = (t: (typeof teamsWithStats)[number]) => t.losses + t.wins + t.totalScore === 0;

	let teams = data.teams;
	$: {
		teams = data.teams;
	}

	let games = data.games;
	$: {
		games = data.games;
	}

	subscribeToGameUpdates({
		eventFilter: "score-submitted",
		callback: game => {
			const gameIdx = games.findIndex(g => g.id === game.gameID);
			if (gameIdx < 0 || gameIdx >= games.length) {
				return;
			}

			games[gameIdx].winner = game.winnerID;
			games[gameIdx].loserScore = game.loserScore;
			games = games;
		},
	});

	let completedGames: typeof data.games = [];
	$: {
		completedGames = games.filter(g => g.loserScore !== null && g.winner !== null);
	}

	let teamsWithStats: ReturnType<typeof computeStatsForTeams> = [];
	$: {
		teamsWithStats = computeStatsForTeams(teams, completedGames);
	}

	const tournamentCutoff = 32;
	let teamsWithCutoff: ((typeof teamsWithStats)[number] & { inTournament: boolean })[] = [];
	$: {
		teamsWithCutoff = teamsWithStats.map((t, i) => ({
			...t,
			inTournament: i < tournamentCutoff && !hasNoGames(t),
		}));
	}
</script>

<svelte:window bind:innerWidth={width} />

<h1 class="text-3xl mb-4 p-4">Prelim Standings</h1>

<div>
	<Table>
		<TableHead>
			<TableHeadCell>Rank</TableHeadCell>
			<TableHeadCell>Team</TableHeadCell>
			{#if !smallLayout}
				<TableHeadCell>Division</TableHeadCell>
				<TableHeadCell>Wins</TableHeadCell>
				<TableHeadCell>Losses</TableHeadCell>
				<TableHeadCell>Total Score</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody>
			{#each teamsWithCutoff as team, i (team.id)}
				<!-- We're using tr directly here with the styles copied from flowbite -- this is the only way to use animate:flip -->
				<tr
					class={`border-b last:border-b-0 ${
						team.inTournament ? "bg-green-700" : "bg-white dark:bg-gray-800"
					} dark:border-gray-700`}
					animate:flip
				>
					<TableBodyCell>{i + 1}</TableBodyCell>
					<TableBodyCell>{getTeamName(team.players)}</TableBodyCell>
					{#if !smallLayout}
						<TableBodyCell>{team.division?.name ?? "No Division"}</TableBodyCell>
						<TableBodyCell>{team.wins}</TableBodyCell>
						<TableBodyCell>{team.losses}</TableBodyCell>
						<TableBodyCell>{team.totalScore}</TableBodyCell>
					{/if}
				</tr>
			{/each}
		</TableBody>
	</Table>
</div>
