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

	let division = "No Division";
	$: {
		if (selectedTeam?.divisionID) {
			division = selectedTeam.divisionID;
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
	<TableBody class="divide-y">
		{#each data.teams as team}
			<TableBodyRow>
				<TableBodyCell class="flex items-center space-x-6">
					<form method="POST" use:enhance action="?/removeTeam">
						<input type="hidden" name="id" value={team.id} />
						<button>
							<Delete />
						</button>
					</form>
				</TableBodyCell>
				<TableBodyCell>
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
					<span>
						{getPlayers(team.players)}
					</span>
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
						{team.divisionID ? team.divisionID : "No Division"}
					</span>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal bind:open={showDivisionModal} class="py-4">
	<div class="sticky top-0 bg-white dark:bg-gray-800 border-b-2 p-2 mt-4">
		{division}
	</div>

	<div class="p-2">
		{#each data.divisions as division}
			<form method="POST" action="?/addTeamToDivision" class="flex justify-between" use:enhance>
				<span>{division.name}</span>
				<button>
					<Plus />
				</button>
				<input type="hidden" name="playerID" value={division.id} />
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
				{#each playerList as player}
					<form
						method="POST"
						action="?/removePlayerFromTeam"
						class="flex justify-between"
						use:enhance
						on:submit={() => {
							selectedTeam.players = selectedTeam.players.filter((p) => p.id !== player.id);
							selectedTeam = selectedTeam;
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
			{#each data.playersWithoutTeams as player}
				<form
					method="POST"
					action="?/addPlayerToTeam"
					class="flex justify-between"
					use:enhance
					on:submit={() => {
						selectedTeam.players.push(player);
						selectedTeam = selectedTeam;
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
