import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/server/db/client";

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) {
		return { isAdmin: false };
	}
	const admin = await prisma.admin.findFirst({
		where: {
			email: session.user.email,
		},
		select: {
			email: true,
		},
	});

	return { isAdmin: admin };
};
