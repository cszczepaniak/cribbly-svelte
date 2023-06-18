import { z } from "zod";
import { prisma } from "$lib/server/db/client";
import { playerSchema } from "$lib/server/schema";
import { publicProcedure, router } from "$lib/server/trpc/context";

export const playerRouter = router({
	"create-player": publicProcedure.input(playerSchema).mutation(async ({ input }) => {
		return await prisma.player.create({
			data: {
				firstName: input.firstName,
				lastName: input.lastName,
			},
		});
	}),
	"delete-player": publicProcedure
		.input(
			z.object({
				id: z.string().cuid(),
			}),
		)
		.mutation(async ({ input }) => {
			return await prisma.player.delete({
				where: {
					id: input.id,
				},
			});
		}),
	"create-many-players": publicProcedure
		.input(z.array(playerSchema))
		.mutation(async ({ input }) => {
			return await prisma.player.createMany({
				data: input,
			});
		}),
	"get-all-players": publicProcedure.query(async () => {
		return await prisma.player.findMany();
	}),
});
