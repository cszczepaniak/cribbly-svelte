<script lang="ts">
	import { page } from "$app/stores";
	import { signIn } from "@auth/sveltekit/client";
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
		<h3>Welcome, {$page.data.session?.user?.name}</h3>
	{/if}
</div>
