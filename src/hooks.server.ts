import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import type { Provider } from "@auth/core/providers";
import type { Profile } from "@auth/core/types";
import { env } from "$env/dynamic/private";

export const handle = SvelteKitAuth({
	providers: [
		Google({
			clientId: env.GOOGLE_ID,
			clientSecret: env.GOOGLE_SECRET,
		}) as Provider<Profile>,
	],
});
