<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	let invalidDivisions: { name: string; nTeams: number }[] = [];
	$: {
		invalidDivisions = $page.form?.create;
	}
</script>

<h1 class="text-3xl mb-4">Games</h1>
<form method="POST" action="?/createPrelims" use:enhance class="my-4">
	<Button>Create Prelims</Button>
</form>

{#if invalidDivisions?.length > 0}
	<p>The following divisions were invalid:</p>
	<ul>
		{#each invalidDivisions as division}
			<li>{`${division.name} (${division.nTeams} teams)`}</li>
		{/each}
	</ul>
{/if}

<Table>
	<TableHead>
		<TableHeadCell>Team 1</TableHeadCell>
		<TableHeadCell>Team 2</TableHeadCell>
		<TableHeadCell>Division</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.games as game (game.id)}
			<TableBodyRow>
				<TableBodyCell>
					{game.teams[0]?.players.map((p) => `${p.firstName} ${p.lastName}`).join(", ")}
				</TableBodyCell>
				<TableBodyCell>
					{game.teams[1]?.players.map((p) => `${p.firstName} ${p.lastName}`).join(", ")}
				</TableBodyCell>
				<TableBodyCell>
					{game.division.name}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
