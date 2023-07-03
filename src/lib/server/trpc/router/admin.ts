import { z } from "zod";
import { prisma } from "$lib/server/db/client";
import { authedProcedure, publicProcedure, router } from "$lib/server/trpc/context";

export const adminRouter = router({
	"add-admin": authedProcedure
		.input(
			z.object({
				email: z.string().email(),
			}),
		)
		.mutation(async ({ input }) => {
			return await prisma.admin.create({
				data: {
					email: input.email,
				},
			});
		}),
	"get-is-admin": publicProcedure
		.input(
			z.object({
				isLocal: z.boolean(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (input.isLocal) {
				return { isAdmin: true };
			}
			if (!ctx.session?.user?.email) {
				return { isAdmin: false };
			}
			const admin = await prisma.admin.findFirst({
				where: {
					email: ctx.session.user.email,
				},
				select: {
					email: true,
				},
			});

			if (!admin) {
				return { isAdmin: false };
			}
			return { isAdmin: true };
		}),
});
