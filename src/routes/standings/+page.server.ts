import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const teams = await prisma.team.findMany({
        select: {
            division: true,
            players: true,
        }
    });
    return { teams };
};

export const actions: Actions = {}