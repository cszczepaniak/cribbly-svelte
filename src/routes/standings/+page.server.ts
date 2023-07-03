import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { gameKindPrelim } from "$lib/server/utils/games";

export const load: PageServerLoad = async () => {
    const teams = await prisma.team.findMany({
        select: {
            id: true,
            division: true,
            players: true,
        }
    });

    const games = await prisma.game.findMany({
        where: {
            kind: gameKindPrelim,
        },
    })

    return {
        teams,
        games,
    };
};

export const actions: Actions = {}