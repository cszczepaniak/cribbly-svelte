<script lang="ts">
	import { page } from "$app/stores";
	import { signIn } from "@auth/sveltekit/client";
	import { Button } from "flowbite-svelte";

	const user = $page.data.session?.user;
</script>

<div class="flex flex-col items-center p-4">
	<h1 class="text-5xl font-semibold pt-8 pb-4 text-center">Cribbly Admin</h1>

	{#if !$page.data.session?.user}
		You aren't signed in.
		<button class="button" on:click={() => signIn()}>Sign In</button>
	{:else if !$page.data.isAdmin}
		Ope... You aren't an admin!
		<a href="/">
			<button class="button">Home</button>
		</a>
	{:else}
		<h3>Welcome, {user?.name}</h3>
		<div class="max-w-lg flex flex-col space-y-4 mt-6">
			<a href="/admin/players">
				<Button class="button">Player Management</Button>
			</a>
			<a href="/admin/teams">
				<Button class="button">Team Management</Button>
			</a>
			<a href="/admin/divisions">
				<Button class="button">Division Management</Button>
			</a>
			<a href="/admin/games">
				<Button class="button">Game Management</Button>
			</a>
			<a href="/admin/tournament">
				<Button class="button">Tournament Management</Button>
			</a>
		</div>
	{/if}
</div>
