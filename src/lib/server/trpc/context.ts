import { isLocal } from "$lib/env";
import type { Session } from "@auth/core/types";
import type { RequestEvent } from "@sveltejs/kit";
import { initTRPC, type inferAsyncReturnType, TRPCError } from "@trpc/server";

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	let session: Session | null;
	if (isLocal) {
		session = {
			expires: "never",
			user: { email: "testuser@test.com" },
		};
	} else {
		session = await event.locals.getSession();
	}
	return {
		session,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

const authedMiddleware = middleware(async ({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx,
	});
});

export const authedProcedure = publicProcedure.use(authedMiddleware);
