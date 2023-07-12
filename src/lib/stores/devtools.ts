import { browser } from "$app/environment";
import { writable } from "svelte/store";

const initialValue = () => {
	if (!browser) {
		return false;
	}
	return localStorage.getItem("cribbly-svelte.devtools") === "true";
};

export const devTools = writable(initialValue());

devTools.subscribe(val => {
	if (!browser) {
		return;
	}
	localStorage.setItem("cribbly-svelte.devtools", val ? "true" : "false");
});
