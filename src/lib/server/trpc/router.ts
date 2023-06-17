import { mergeRouters } from '$lib/server/trpc/context';
import { adminRouter } from '$lib/server/trpc/router/admin';
import { divisionRouter } from '$lib/server/trpc/router/divisions';
import { gameRouter } from '$lib/server/trpc/router/games';
import { playerRouter } from '$lib/server/trpc/router/players';
import { teamRouter } from '$lib/server/trpc/router/teams';

export const router = mergeRouters(adminRouter, divisionRouter, gameRouter, playerRouter, teamRouter);
export type Router = typeof router;