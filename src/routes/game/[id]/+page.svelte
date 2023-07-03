<script lang="ts">
	import { getTeamName } from "$lib/utils/teams";
	import { Button, Helper, Input, Label, Select } from "flowbite-svelte";
	import type { ActionData, PageData } from "./$types";
	import type { SelectOptionType } from "flowbite-svelte/dist/types";
	import { enhance } from "$app/forms";

	export let form: ActionData;
	export let data: PageData;

	let selectOptions: SelectOptionType[] = [];
	$: {
		selectOptions = [data.game?.team1, data.game?.team2].map((t) => ({
			value: t.id,
			name: getTeamName(t.players),
		}));
	}

	let teamID = data.game.winner;
	let loserScore = data.game.loserScore;
	const alreadyComplete = data.game.complete;

	let canSubmit = false;
	$: {
		canSubmit = !!teamID && !!loserScore;
	}
</script>

<h1 class="text-3xl mb-4">Report Prelim Score</h1>

<form
	method="POST"
	class="space-y-4"
	use:enhance={() => {
		console.log("submitting form...");
		return async ({ update }) => {
			console.log("running update...");
			update();
			console.log("running update...done!");
		};
	}}
>
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
	{#if form?.errors?.fieldErrors?.teamID}
		<Helper>
			<span class="text-red-500 text-lg">
				{form?.errors?.fieldErrors?.teamID}
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
	{#if form?.errors?.fieldErrors?.loserScore}
		<Helper>
			<span class="text-red-500 text-lg">
				{form?.errors?.fieldErrors?.loserScore}
			</span>
		</Helper>
	{/if}
	{#if !alreadyComplete}
		<Button class="text-xl" type="submit" disabled={!canSubmit}>Submit Result</Button>
	{/if}
</form>
