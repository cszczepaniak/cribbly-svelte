<script lang="ts">
	import { subscribeToGameUpdates } from "$lib/realtime";
	import type { PageData } from "./$types";

	export let data: PageData;

	let client = subscribeToGameUpdates();
</script>

<h1>Send</h1>
<button
	on:click={() =>
		client.notifyGameUpdate({
			gameID: "123",
			winnerID: "456",
			loserScore: 111,
		})}
>
	Send!
</button>
