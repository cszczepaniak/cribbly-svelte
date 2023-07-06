<script lang="ts">
	import { getTeamName } from "$lib/utils/teams";
	import { Button, Helper, Input, Label, Select } from "flowbite-svelte";
	import type { ActionData, PageData } from "./$types";
	import type { SelectOptionType } from "flowbite-svelte/dist/types";
	import { enhance } from "$app/forms";
	import { subscribeToGameUpdates } from "$lib/realtime";

	export let form: ActionData;
	export let data: PageData;

	let selectOptions: SelectOptionType[] = [];
	$: {
		selectOptions = [data.game?.team1, data.game?.team2].map(t => ({
			value: t.id,
			name: getTeamName(t.players),
		}));
	}

	let teamID = data.game.winner;
	let loserScore = data.game.loserScore;

	let alreadyComplete = false;
	$: {
		alreadyComplete = data.game.complete || !!form?.updateError;
	}

	subscribeToGameUpdates({
		eventFilter: "score-submitted",
		callback: update => {
			if (update.gameID !== data.game.id) {
				return;
			}
			alreadyComplete = true;
			teamID = update.winnerID;
			loserScore = update.loserScore;
		},
	});

	let canSubmit = false;
	$: {
		canSubmit = !!teamID && !!loserScore;
	}
</script>

<h1 class="text-3xl my-4">Report Prelim Score</h1>

<form method="POST" class="space-y-4" use:enhance>
	<input type="hidden" value={data?.game?.id} name="gameID" />
	<Label class="text-xl">
		Who won?
		<Select
			disabled={alreadyComplete}
			class="mt-2"
			items={selectOptions}
			placeholder="Select winning team..."
			name="teamID"
			bind:value={teamID}
		/>
	</Label>
	{#if form?.formErrors?.teamID}
		<Helper>
			<span class="text-red-500 text-lg">
				{form?.formErrors?.teamID}
			</span>
		</Helper>
	{/if}
	<Label class="text-xl">
		Loser's Score
		<Input
			name="loserScore"
			class="mt-2"
			type="tel"
			bind:value={loserScore}
			disabled={alreadyComplete}
		/>
	</Label>
	{#if form?.formErrors?.loserScore}
		<Helper>
			<span class="text-red-500 text-lg">
				{form?.formErrors?.loserScore}
			</span>
		</Helper>
	{/if}
	{#if form?.updateError}
		<span class="text-red-500 text-lg"
			>Game already finished. Another person may have already reported the result of this game.</span
		>
	{/if}
	{#if !alreadyComplete}
		<Button class="text-xl" type="submit" disabled={!canSubmit}>Submit Result</Button>
	{/if}
</form>
