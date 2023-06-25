<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import { getTeamName } from "$lib/utils/teams";
	import Modal from "$lib/components/modal.svelte";
	import "iconify-icon";

	let showModal = false;

	export let data: PageData;

	let modalTeam: (typeof data.teams)[number];
</script>

<h1 class="text-3xl mb-4">Teams</h1>
<form method="POST" action="?/newTeam" use:enhance>
	<button class="button max-w-sm">Add</button>
</form>
{#each data.teams as team}
	<form
		method="POST"
		use:enhance
		action="?/removeTeam"
		class="text-lg flex justify-between my-2 max-w-2xl"
	>
		{getTeamName(team.players)}
		<input type="hidden" name="id" value={team.id} />
		<div class="flex max-w-lg justify-between space-x-4">
			<button
				type="button"
				class="button"
				on:click={() => {
					showModal = true;
					modalTeam = team;
				}}>edit</button
			>
			<button class="bg-red-100 px-2 rounded border border-red-600">Delete</button>
		</div>
	</form>
{/each}

<Modal bind:showModal>
	{#if !modalTeam}
		<p>no team selected</p>
	{:else}
		<div class="min-w-[400px] min-h-[300px] max-h-[300px] overflow-scroll">
			<div class="sticky top-0 bg-white border-b-2 p-2">
				{#if modalTeam.players.length == 0}
					<p>No players!</p>
				{:else}
					{#each modalTeam?.players as player}
						<form
							method="POST"
							action="?/removePlayerFromTeam"
							class="flex justify-between"
							use:enhance
							on:submit={() => {
								modalTeam.players = modalTeam.players.filter((p) => p.id !== player.id);
								modalTeam = modalTeam;
							}}
						>
							<p>{player?.firstName} {player?.lastName}</p>
							<button>Remove</button>
							<input type="hidden" name="playerID" value={player.id} />
							<input type="hidden" name="teamID" value={modalTeam.id} />
						</form>
					{/each}
				{/if}
			</div>

			<div class="p-2">
				{#each data.playersWithoutTeams as player}
					<form
						method="POST"
						action="?/addPlayerToTeam"
						class="flex justify-between"
						use:enhance
						on:submit={() => {
							modalTeam.players.push(player);
							modalTeam = modalTeam;
						}}
					>
						<span>{player.firstName} {player.lastName}</span>
						<button>Add to Team</button>
						<input type="hidden" name="playerID" value={player.id} />
						<input type="hidden" name="teamID" value={modalTeam.id} />
					</form>
				{/each}
			</div>
		</div>
	{/if}
</Modal>
