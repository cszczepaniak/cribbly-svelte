<script lang="ts">
	import { page } from "$app/stores";
	let name = $page.data.session?.user?.email ?? "no signed in user";
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
	<h2 class="text-3xl sm:text-4xl py-4 text-slate-800 text-center">
		2023 Szczepaniak Charity Cribbage Tournament
	</h2>
	<p>Session user: {name}</p>

	<pre>
		{JSON.stringify($page, null, 2)}
	</pre>
</div>
