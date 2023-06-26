import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db/client';

export const load: PageServerLoad = async () => {
    let teams = await prisma.team.findMany({
        select: {
            id: true,
            divisionID: true,
            players: true,
        },
    });

    let playersWithoutTeams = await prisma.player.findMany({
        where: {
            teamID: null,
        }
    })


    let divisions = await prisma.division.findMany();

    return { teams, playersWithoutTeams, divisions, };
}


export const actions: Actions = {
    newTeam: async () => {
        await prisma.team.create({
            data: {},
        })
    },
    removeTeam: async (event) => {
        const formData = await event.request.formData();

        let id = String(formData.get("id"));
        await prisma.team.delete({
            where: {
                id,
            }
        })
    },
    removePlayerFromTeam: async (event) => {
        const formData = await event.request.formData();

        let teamID = String(formData.get("teamID"));
        let playerID = String(formData.get("playerID"));

        await prisma.team.update({
            where: {
                id: teamID,
            },
            data: {
                players: {
                    disconnect: {
                        id: playerID,
                    },
                },
            },
        });
    },
    addPlayerToTeam: async (event) => {
        const formData = await event.request.formData();

        let teamID = String(formData.get("teamID"));
        let playerID = String(formData.get("playerID"));

        try {
            return await prisma.$transaction(async () => {
                const team = await prisma.team.findUnique({
                    where: {
                        id: teamID,
                    },
                    select: {
                        players: true,
                    },
                });

                if (team && team.players && team.players.length >= 2) {
                    throw new Error("Cannot have a team with more than two players");
                }

                return await prisma.team.update({
                    where: {
                        id: teamID,
                    },
                    data: {
                        players: {
                            connect: {
                                id: playerID,
                            },
                        },
                    },
                });
            });
        } catch { }
    }
}

async function getFullTeams() {
    type Player = {
        id: string;
        teamID: string;
        firstName: string;
        lastName: string;
    };

    type Team = {
        id: string;
        divisionID: string | null;
        players: Player[];
    };

    type Result = { playerID: string } & Omit<Player, "id"> & Omit<Team, "players">;

    const resToPlayer = (r: Result) => ({
        id: r.playerID,
        teamID: r.teamID,
        firstName: r.firstName,
        lastName: r.lastName,
    });

    const result = await prisma.$queryRaw<Result[]>`
  SELECT t.id, t.divisionID, p.id AS playerID, p.firstName, p.lastName FROM Team t INNER JOIN Player p ON t.id = p.teamID
    WHERE (SELECT COUNT(*) FROM Player WHERE teamID = t.id) = 2;
  `;

    const teams = result.reduce((prev, r) => {
        let t = prev.get(r.id);
        if (!t) {
            t = { id: r.id, divisionID: r.divisionID, players: [] };
        }

        t.players = [...t.players, resToPlayer(r)];

        prev.set(t.id, t);
        return prev;
    }, new Map<string, Team>());

    return Array.from(teams.values());
}