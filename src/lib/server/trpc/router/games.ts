import { prisma } from "$lib/server/db/client";
import { generatePrelimGames } from "$lib/server/games/games";
import { gameKindPrelim } from "$lib/server/utils/games";
import { publicProcedure, router } from "$lib/server/trpc/context";

export const gameRouter = router({
  "create-prelims": publicProcedure.mutation(async () => {
    const divs = await prisma.division.findMany({
      select: {
        id: true,
        name: true,
        teams: {
          select: {
            id: true,
          },
        },
      },
    });

    let invalid = divs.reduce((prev, div) => {
      if (div.teams.length !== 4 && div.teams.length !== 6) {
        return [...prev, div.name];
      }
      return prev;
    }, [] as string[]);
    if (invalid.length > 0) {
      throw new Error(
        `The following divisions are invalid: ${invalid.join(", ")}`
      );
    }

    const games = generatePrelimGames(divs);

    return await prisma.game.createMany({
      data: Array.from(games.entries()).flatMap(([divID, pairs]) =>
        pairs.map((pair) => ({
          kind: gameKindPrelim,
          team1ID: pair[0],
          team2ID: pair[1],
          divisionID: divID,
        }))
      ),
      skipDuplicates: true,
    });
  }),
  "get-prelims": publicProcedure.query(async () => {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        division: true,
        team1ID: true,
        team2ID: true,
        loserScore: true,
        winner: true,
      },
      where: {
        kind: gameKindPrelim,
      },
    });

    const teams = (
      await prisma.team.findMany({
        select: {
          id: true,
          players: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      })
    ).reduce(
      (prev, t) => {
        prev.set(t.id, t);
        return prev;
      },
      new Map<
        string,
        {
          id: string;
          players: { firstName: string; lastName: string }[];
        }
      >()
    );

    return games.map((g) => ({
      ...g,
      teams: [teams.get(g.team1ID), teams.get(g.team2ID)],
    }));
  })
});
