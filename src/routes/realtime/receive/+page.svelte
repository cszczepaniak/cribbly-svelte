<script lang="ts">
	import { subscribeToGameUpdates } from "$lib/realtime";
	import type { PageData } from "./$types";

	export let data: PageData;

	let events: any[] = [];

	subscribeToGameUpdates({
		eventFilter: "score-submitted",
		callback: (update) => {
			events = [...events, update];
		},
	});
</script>

<h1>Receive</h1>

{#each events as event}
	<pre>
        {JSON.stringify(event, null, 2)}
    </pre>
{/each}
