<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import { Hamburger } from "svelte-hamburgers";
	import { signIn, signOut } from "@auth/sveltekit/client";
	let open = false;
</script>

<div class="bg-blue-700">
	<Hamburger bind:open --color="white" />
</div>

{#if open}
	<nav class="bg-blue-700">
		<ul class="flex flex-col items-center space-y-6 text-white text-xl py-2 px-4">
			<li><a href="/">Home</a></li>
			<li><a href="/games">Games</a></li>
			<li><a href="/standings">Standings</a></li>
			{#if $page.data.isAdmin}
				<li><a href="/admin">Admin</a></li>
			{/if}
			{#if !$page.data.session?.user}
				<li><button on:click={signIn}>Sign In</button></li>
			{:else}
				<li><button on:click={signOut}>Sign Out</button></li>
			{/if}
		</ul>
	</nav>
{/if}

<slot />
