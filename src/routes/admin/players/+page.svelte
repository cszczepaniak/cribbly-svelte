<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { enhance } from "$app/forms";
	import {
		Button,
		Helper,
		Input,
		Label,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";

	export let data: PageData;
	export let form: ActionData;
</script>

<h1 class="text-3xl mb-4">Players</h1>
<form
	class="grid gap-6 mb-6 md:grid-cols-2 sticky top-0 left-0 z-50 bg-white dark:bg-gray-800"
	method="POST"
	use:enhance
	action="?/addPlayer"
>
	<h3 class="text-xl col-span-2">Add Player</h3>
	<div class="w-full">
		<Label for="firstName" class="block mb-2">First Name</Label>
		<Input id="firstName" name="firstName" placeholder="John" size="lg" />
		{#if form?.errors?.firstName}
			<Helper class="mt-2">
				{form?.errors?.firstName}
			</Helper>
		{/if}
	</div>

	<div class="w-full">
		<Label for="lastName" class="block mb-2">Last Name</Label>
		<Input id="lastName" name="lastName" placeholder="Doe" size="lg" />
		{#if form?.errors?.lastName}
			<Helper class="mt-2">
				{form?.errors?.lastName}
			</Helper>
		{/if}
	</div>
	<Button type="submit" class="w-fit">Add</Button>
</form>

<Table>
	<TableHead>
		<TableHeadCell>Player Name</TableHeadCell>
	</TableHead>
	<TableBody class="divide-y">
		{#each data.players as player}
			<TableBodyRow>
				<TableBodyCell class="flex items-center">
					<form method="POST" use:enhance action="?/removePlayer" class="mr-6">
						<input type="hidden" name="id" value={player.id} />
						<button>
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"
								/>
							</svg>
						</button>
					</form>
					<span>
						{player.firstName}
						{player.lastName}
					</span>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
