<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import {
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { Delete, Edit, Minus, Plus } from "$lib/components/icons";
	import type { Player } from "@prisma/client";

	let showTeamModal = false;
	let showDivisionModal = false;

	export let data: PageData;

	let selectedTeam: (typeof data.teams)[number];

	let playerList: Player[] = [];
	$: {
		if (!selectedTeam) {
			playerList = [];
		} else {
			playerList = selectedTeam.players;
		}
	}

	let division = "";
	$: {
		if (selectedTeam?.division) {
			division = selectedTeam.division.name;
		} else {
			division = "";
		}
	}

	const getPlayers = (players: { firstName: string; lastName: string }[]) => {
		if (!players || players.length === 0) {
			return "No Players";
		}
		return players.map((p) => `${p.firstName} ${p.lastName}`).join(", ");
	};
</script>

<div class="flex">
	<h1 class="text-3xl mb-4 mr-4">Teams</h1>

	<form method="POST" action="?/newTeam" use:enhance>
		<button>
			<Plus />
		</button>
	</form>
</div>
<Table>
	<colgroup>
		<col span="1" style="width: 6%;" />
		<col span="1" style="width: 47%;" />
		<col span="1" style="width: 47%;" />
	</colgroup>

	<TableHead>
		<TableHeadCell />
		<TableHeadCell>Players</TableHeadCell>
		<TableHeadCell>Division</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.teams as team (team.id)}
			<TableBodyRow>
				<TableBodyCell>
					<form method="POST" use:enhance action="?/removeTeam">
						<input type="hidden" name="id" value={team.id} />
						<button>
							<Delete />
						</button>
					</form>
				</TableBodyCell>
				<TableBodyCell class="flex flex-row">
					<button
						class="mr-6"
						type="button"
						on:click={() => {
							showTeamModal = true;
							selectedTeam = team;
						}}
					>
						<Edit />
					</button>
					{#if team.players.length === 0}
						<p class="italic">No Players</p>
					{:else}
						<div class="flex flex-col">
							{#each team.players as player (player.id)}
								<p>{player.firstName} {player.lastName}</p>
							{/each}
						</div>
					{/if}
				</TableBodyCell>
				<TableBodyCell>
					<button
						class="mr-6"
						type="button"
						on:click={() => {
							showDivisionModal = true;
							selectedTeam = team;
						}}
					>
						<Edit />
					</button>
					<span>
						{team.division ? team.division.name : "No Division"}
					</span>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal bind:open={showDivisionModal} class="py-4">
	<div class="flex justify-between sticky top-0 bg-white dark:bg-gray-800 border-b-2 p-2 mt-4">
		<div>
			{division ? division : "No Division"}
		</div>
		{#if division}
			<form
				method="POST"
				action="?/removeTeamFromDivision"
				use:enhance={() => {
					selectedTeam.division = null;
					selectedTeam = selectedTeam;
					return async ({ update }) => {
						update();
					};
				}}
			>
				<input type="hidden" name="id" value={selectedTeam.id} />
				<button>
					<Minus />
				</button>
			</form>
		{/if}
	</div>

	<div class="p-2">
		{#each data.divisions as d (d.id)}
			<form
				method="POST"
				action="?/addTeamToDivision"
				class="flex justify-between"
				use:enhance={() => {
					selectedTeam.division = d;
					selectedTeam = selectedTeam;
					return async ({ update }) => {
						update();
					};
				}}
			>
				<span>{d.name}</span>
				<button>
					<Plus />
				</button>
				<input type="hidden" name="divisionID" value={d.id} />
				<input type="hidden" name="teamID" value={selectedTeam.id} />
			</form>
		{/each}
	</div>
</Modal>

<Modal bind:open={showTeamModal} class="py-4">
	<div class="max-h-96 overflow-scroll">
		<div class="sticky top-0 bg-white dark:bg-gray-800 border-b-2 p-2 mt-4">
			{#if playerList.length == 0}
				<p>No players!</p>
			{:else}
				{#each playerList as player (player.id)}
					<form
						method="POST"
						action="?/removePlayerFromTeam"
						class="flex justify-between"
						use:enhance={() => {
							selectedTeam.players = selectedTeam.players.filter((p) => p.id !== player.id);
							selectedTeam = selectedTeam;
							return async ({ update }) => {
								update();
							};
						}}
					>
						<p>{player?.firstName} {player?.lastName}</p>
						<button class="hover:text-gray-50 disabled:text-gray-600">
							<Minus />
						</button>
						<input type="hidden" name="playerID" value={player.id} />
						<input type="hidden" name="teamID" value={selectedTeam.id} />
					</form>
				{/each}
			{/if}
		</div>

		<div class="p-2">
			{#each data.playersWithoutTeams as player (player.id)}
				<form
					method="POST"
					action="?/addPlayerToTeam"
					class="flex justify-between"
					use:enhance={() => {
						selectedTeam.players.push(player);
						selectedTeam = selectedTeam;
						return async ({ update }) => {
							update();
						};
					}}
				>
					<span>{player.firstName} {player.lastName}</span>
					<button
						disabled={playerList.length === 2}
						class="hover:text-gray-50 disabled:text-gray-600"
					>
						<Plus />
					</button>
					<input type="hidden" name="playerID" value={player.id} />
					<input type="hidden" name="teamID" value={selectedTeam.id} />
				</form>
			{/each}
		</div>
	</div>
</Modal>
