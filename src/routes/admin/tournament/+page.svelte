<script lang="ts">
	import { Button } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import { enhance } from "$app/forms";
	import { getTeamName } from "$lib/utils/teams";

	export let data: PageData;
</script>

<h1>Tournament</h1>

<form method="POST" use:enhance>
	<Button type="submit">Generate Tournament</Button>
</form>

{#each data.games as game (game.id)}
	<div>{getTeamName(game.team1.players)} VS {getTeamName(game.team2.players)}</div>
{/each}
