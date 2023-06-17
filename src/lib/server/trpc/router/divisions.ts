import { z } from "zod";
import { prisma } from "$lib/server/db/client";
import { divisionNameSchema } from "$lib/server/schema";
import { publicProcedure, router } from "$lib/server/trpc/context";

export const divisionRouter = router({
  create: publicProcedure.input(
    z.object({
      name: divisionNameSchema,
    })
  ).mutation(async ({ input }) => {
    return await prisma.division.create({
      data: {
        name: input.name,
      },
    });
  }),
  delete: publicProcedure.input(
    z.object({ id: z.string().cuid() })
  ).mutation(async ({ input }) => {
    return await prisma.$transaction([
      prisma.division.update({
        where: {
          id: input.id,
        },
        data: {
          teams: {
            set: [],
          },
        },
      }),
      prisma.division.delete({
        where: {
          id: input.id,
        },
      }),
    ]);
  }),
  "add-team": publicProcedure.input(
    z.object({
      teamID: z.string().cuid(),
      divisionID: z.string().cuid(),
    })
  ).mutation(async ({ input }) => {
    return await prisma.division.update({
      data: {
        teams: {
          connect: {
            id: input.teamID,
          },
        },
      },
      where: {
        id: input.divisionID,
      },
    });
  }),
  "remove-team": publicProcedure.input(
    z.object({
      teamID: z.string().cuid(),
      divisionID: z.string().cuid(),
    })
  ).mutation(async ({ input }) => {
    return await prisma.division.update({
      where: {
        id: input.divisionID,
      },
      data: {
        teams: {
          disconnect: {
            id: input.teamID,
          },
        },
      },
    });
  }),
  "clear-all": publicProcedure.mutation(async () => {
    return await prisma.team.updateMany({
      data: {
        divisionID: "",
      },
    });
  }),
  "set-name": publicProcedure.input(
    z.object({
      id: z.string().cuid(),
      name: divisionNameSchema,
    })
  ).mutation(async ({ input }) => {
    return await prisma.division.update({
      data: {
        name: input.name,
      },
      where: {
        id: input.id,
      },
    });
  }),
  "get-all": publicProcedure.query(async () => {
    return await prisma.division.findMany({
      select: {
        id: true,
        name: true,
        teams: {
          select: {
            id: true,
            divisionID: true,
            players: true,
          },
        },
      },
    });
  }),
});