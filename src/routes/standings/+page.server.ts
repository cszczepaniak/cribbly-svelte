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

    const completedGames = games.filter(g => g.loserScore !== null && g.winner !== null);

    return {
        teams: teams.map(t => ({
            ...t,
            wins: completedGames.filter(g => g.winner === t.id).length,
            losses: completedGames.filter(g => (g.team1ID === t.id || g.team2ID === t.id) && g.winner !== t.id).length,
            totalScore: completedGames.filter(g => g.team1ID === t.id || g.team2ID === t.id).reduce((score, g) => {
                if (g.winner === t.id) {
                    return score + 121
                }
                return score + (g.loserScore ?? 0)
            }, 0)
        })),
    };
};

export const actions: Actions = {}