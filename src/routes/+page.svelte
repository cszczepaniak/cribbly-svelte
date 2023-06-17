<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	let name = $page.data.session?.user?.name ?? 'no signed in user';
</script>

<head>
	<title>Cribbly</title>
</head>

<div class="flex flex-col items-center p-4">
	<h1 class="text-8xl sm:text-9xl py-8 font-bold">
		Crib<span class="text-blue-700">b</span>
		<span class="text-red-600">l</span>
		<span class="text-green-600">y</span>
	</h1>
	<h2 class="text-3xl sm:text-4xl py-4 text-slate-800 text-center">
		2022 Szczepaniak Charity Cribbage Tournament
	</h2>
	<p>Session user: {name}</p>
	<div class="flex flex-col space-y-4 items-center p-6 w-full max-w-lg">
		<a href="/games">
			<button class="button">View Games</button>
		</a>
		<a href="/results/prelim">
			<button class="button">View Prelim Standings</button>
		</a>
	</div>
	<div class="flex flex-row space-x-2 w-max">
		<button class="button" on:click={() => signIn()}>Sign In</button>
		<button class="button" on:click={() => signOut()}>Sign Out</button>
		<a href="/admin">
			<button class="button">Admin Page</button>
		</a>
	</div>
</div>
