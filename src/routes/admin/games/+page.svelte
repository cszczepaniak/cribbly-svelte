<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import type { PageData } from "./$types";

	export let data: PageData;

	let invalidDivisions: { name: string; nTeams: number }[] = [];
	$: {
		invalidDivisions = $page.form?.create;
	}
</script>

<h1>Games</h1>
<form method="POST" action="?/createPrelims" use:enhance>
	<button>Create Prelims</button>
</form>

{#if invalidDivisions?.length > 0}
	<p>The following divisions were invalid:</p>
	<ul>
		{#each invalidDivisions as division}
			<li>{`${division.name} (${division.nTeams} teams)`}</li>
		{/each}
	</ul>
{/if}

{#each data.games as game}
	<div>
		{game.teams
			.map((team) => team?.players.map((p) => `${p.firstName} ${p.lastName}`).join(", "))
			.join(" VS ")}
	</div>
{/each}
