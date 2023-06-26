<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import {
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { Check, Delete, Edit, Plus } from "$lib/components/icons";

	export let data: PageData;

	let editingID = "";
</script>

<div class="flex">
	<h1 class="text-3xl mb-4 mr-4">Division</h1>

	<form method="POST" action="?/newDivision" use:enhance>
		<button>
			<Plus />
		</button>
	</form>
</div>

<Table>
	<colgroup>
		<col span="1" style="width: 6%;" />
		<col span="1" style="width: 94%;" />
	</colgroup>

	<TableHead>
		<TableHeadCell />
		<TableHeadCell>Name</TableHeadCell>
	</TableHead>
	<TableBody class="divide-y">
		{#each data.divisions as division}
			<TableBodyRow>
				<TableBodyCell class="flex items-center space-x-6">
					<form method="POST" use:enhance action="?/removeDivision">
						<input type="hidden" name="id" value={division.id} />
						<button>
							<Delete />
						</button>
					</form>
				</TableBodyCell>
				<TableBodyCell>
					{#if division.id === editingID}
						<form
							method="POST"
							use:enhance={() => {
								editingID = "";
								return async ({ update }) => {
									update();
								};
							}}
							action="?/renameDivision"
							class="flex"
						>
							<button class="mr-6" type="submit">
								<Check />
							</button>
							<Input name="name" placeholder={division.name} />
							<input name="id" value={division.id} hidden />
						</form>
					{:else}
						<button class="mr-6" type="button" on:click={() => (editingID = division.id)}>
							<Edit />
						</button>
						<span>
							{division.name ? division.name : "Unnamed Division"}
						</span>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
