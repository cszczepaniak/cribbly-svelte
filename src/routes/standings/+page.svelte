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
		{#each data.teams as team}
			<TableBodyRow>
				<TableBodyCell>{getTeamName(team.players)}</TableBodyCell>
				<TableBodyCell>{team.division?.name ?? "No Division"}</TableBodyCell>
				<TableBodyCell>0</TableBodyCell>
				<TableBodyCell>0</TableBodyCell>
				<TableBodyCell>0</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
