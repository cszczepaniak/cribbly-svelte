import { z } from "zod";
import { prisma } from "$lib/server/db/client";
import { publicProcedure, router } from "$lib/server/trpc/context";

export const teamRouter = router({
  "create-team": publicProcedure.mutation(async () => {
    return await prisma.team.create({
      data: {},
    });
  }),
  "add-player": publicProcedure.input(
    z.object({
      teamID: z.string().cuid(),
      playerID: z.string().cuid(),
    })
  ).mutation(async ({ input }) => {
    try {
      return await prisma.$transaction(async () => {
        const team = await prisma.team.findUnique({
          where: {
            id: input.teamID,
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
            id: input.teamID,
          },
          data: {
            players: {
              connect: {
                id: input.playerID,
              },
            },
          },
        });
      });
    } catch { }
  }),
  "remove-player": publicProcedure.input(
    z.object({
      teamID: z.string().cuid(),
      playerID: z.string().cuid(),
    })
  ).mutation(async ({ input }) => {
    return await prisma.team.update({
      where: {
        id: input.teamID,
      },
      data: {
        players: {
          disconnect: {
            id: input.playerID,
          },
        },
      },
    });
  }),
  "clear-all-teams": publicProcedure.mutation(async () => {
    return await prisma.player.updateMany({
      data: {
        teamID: "",
      },
    });
  }),
  "get-all-teams": publicProcedure.mutation(async () => {
    return await prisma.team.findMany({
      select: {
        id: true,
        divisionID: true,
        players: true,
      },
    })
  }),
  "get-full": publicProcedure.query(async () => {
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

    type Result = { playerID: string } & Omit<Player, "id"> &
      Omit<Team, "players">;

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
  })
});