<script lang="ts">
	import { Button } from "flowbite-svelte";
</script>

<head>
	<title>Cribbly</title>
</head>

<div class="flex flex-col items-center p-4">
	<h1 class="text-8xl sm:text-9xl py-8 font-bold">
		Crib<span class="text-blue-700">b</span><span class="text-red-600">l</span><span
			class="text-green-600">y</span
		>
	</h1>
	<h2 class="text-3xl sm:text-4xl py-4 text-center">
		2023 Szczepaniak Charity Cribbage Tournament
	</h2>
	<div class="flex flex-col space-y-4">
		<a href="/divisions">
			<Button class="text-xl w-full">Report a Prelim Score</Button>
		</a>
		<a href="/standings">
			<Button class="text-xl w-full">View Prelim Standings</Button>
		</a>
	</div>
</div>
