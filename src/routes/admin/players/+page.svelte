<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { enhance } from "$app/forms";
	import ErrorSpan from "$lib/components/errorspan.svelte";

	export let data: PageData;
	export let form: ActionData;
</script>

<main class="p-4">
	<h1 class="text-3xl mb-4">Players</h1>
	<div class="grid grid-cols-5 gap-4">
		<div class="col-span-2">
			{#each data.players as player}
				<form
					method="POST"
					use:enhance
					action="?/removePlayer"
					class="text-lg flex justify-between my-2"
				>
					{player.firstName}
					{player.lastName}
					<input type="hidden" name="id" value={player.id} />
					<button class="bg-red-100 px-2 rounded border border-red-600">Delete</button>
				</form>
			{/each}
		</div>
		<form class="flex flex-col col-span-3 space-y-2" method="POST" use:enhance action="?/addPlayer">
			<h3 class="text-xl">Add Player</h3>
			<input type="text" name="firstName" placeholder="First Name" class="input" />
			<ErrorSpan zodError={form?.errors?.firstName} />
			<input type="text" name="lastName" placeholder="Last Name" class="input" />
			<ErrorSpan zodError={form?.errors?.lastName} />
			<button class="button">Add</button>
		</form>
	</div>
</main>
