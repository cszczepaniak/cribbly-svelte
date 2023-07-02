<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";

	export let data: PageData;

	const hasNoGames = (t: (typeof data.teams)[number]) => t.losses + t.wins + t.totalScore === 0;

	let teams: typeof data.teams = [];
	$: {
		teams = data.teams.sort((a, b) => {
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
		});
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
		{#each teams as team}
			<TableBodyRow>
				<TableBodyCell>{getTeamName(team.players)}</TableBodyCell>
				<TableBodyCell>{team.division?.name ?? "No Division"}</TableBodyCell>
				<TableBodyCell>{team.wins}</TableBodyCell>
				<TableBodyCell>{team.losses}</TableBodyCell>
				<TableBodyCell>{team.totalScore}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
