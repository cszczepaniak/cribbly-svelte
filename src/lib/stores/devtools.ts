import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const devTools = writable(
	browser && localStorage.getItem("cribbly-svelte.devtools") === "true" ? true : false,
);

devTools.subscribe(val => {
	if (!browser) {
		return;
	}
	localStorage.setItem("cribbly-svelte.devtools", val ? "true" : "false");
});
