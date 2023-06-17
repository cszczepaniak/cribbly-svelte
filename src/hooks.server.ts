import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google"
import type { Provider } from '@auth/core/providers';
import type { Profile } from '@auth/core/types';
import { sequence } from '@sveltejs/kit/hooks';

const trpcHandle: Handle = createTRPCHandle({ router, createContext });
const authHandle = SvelteKitAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }) as Provider<Profile>,
    ],
});

export const handle = sequence(authHandle, trpcHandle);
