import { prisma } from "$lib/server/db/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	let mergeSession = (isAdmin: boolean) => ({ session, isAdmin })


	if (!session?.user?.email) {
		return mergeSession(false)
	}
	const admin = await prisma.admin.findUnique({
		where: {
			email: session.user.email,
		},
		select: {
			email: true,
		},
	});

	return mergeSession(!!admin)
};
