<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableHead, TableHeadCell } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";
	import { subscribeToGameUpdates } from "$lib/realtime";
	import { flip } from "svelte/animate";

	export let data: PageData;

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
		callback: (game) => {
			console.log("received game update", game);
			const gameIdx = games.findIndex((g) => g.id === game.gameID);
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
		completedGames = games.filter((g) => g.loserScore !== null && g.winner !== null);
	}

	let teamsWithStats: ((typeof data.teams)[number] & {
		wins: number;
		losses: number;
		totalScore: number;
	})[] = [];
	$: {
		teamsWithStats = teams.map((t, i) => ({
			...t,
			wins: completedGames.filter((g) => g.winner === t.id).length,
			losses: completedGames.filter(
				(g) => (g.team1ID === t.id || g.team2ID === t.id) && g.winner !== t.id,
			).length,
			totalScore: completedGames
				.filter((g) => g.team1ID === t.id || g.team2ID === t.id)
				.reduce((score, g) => {
					if (g.winner === t.id) {
						return score + 121;
					}
					return score + (g.loserScore ?? 0);
				}, 0),
		}));
	}

	const tournamentCutoff = 2;
	let sortedTeams: typeof teamsWithStats = [];
	$: {
		sortedTeams = teamsWithStats
			.sort((a, b) => {
				// Put teams with no recorded games at the bottom.
				if (hasNoGames(a) && !hasNoGames(b)) {
					return 1;
				} else if (!hasNoGames(a) && hasNoGames(b)) {
					return -1;
				}

				// Put teams with the highest number of wins furthest at the top.
				if (a.wins > b.wins) {
					// More wins towards the top.
					return -1;
				} else if (a.wins < b.wins) {
					return 1;
				}

				// Put teams with fewer losses next.
				if (a.losses < b.losses) {
					return -1;
				} else if (a.losses > b.losses) {
					return 1;
				}

				// Then sort by total score.
				if (a.totalScore > b.totalScore) {
					return -1;
				} else if (a.totalScore < b.totalScore) {
					return 1;
				}

				return 0;
			})
			.map((t, i) => ({ ...t, inTournament: i < tournamentCutoff }));
	}
</script>

<h1 class="text-3xl mb-4">Prelim Standings</h1>

<Table>
	<TableHead>
		<TableHeadCell>Team</TableHeadCell>
		<TableHeadCell>Division</TableHeadCell>
		<TableHeadCell>Wins</TableHeadCell>
		<TableHeadCell>Losses</TableHeadCell>
		<TableHeadCell>Total Score</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each sortedTeams as team (team.id)}
			<!-- We're using tr directly here with the styles copied from flowbite -- this is the only way to use animate:flip -->
			<tr
				class={`border-b last:border-b-0 ${
					team.inTournament ? "bg-green-700" : "bg-white dark:bg-gray-800"
				} dark:border-gray-700`}
				animate:flip
			>
				<TableBodyCell>{getTeamName(team.players)}</TableBodyCell>
				<TableBodyCell>{team.division?.name ?? "No Division"}</TableBodyCell>
				<TableBodyCell>{team.wins}</TableBodyCell>
				<TableBodyCell>{team.losses}</TableBodyCell>
				<TableBodyCell>{team.totalScore}</TableBodyCell>
			</tr>
		{/each}
	</TableBody>
</Table>
