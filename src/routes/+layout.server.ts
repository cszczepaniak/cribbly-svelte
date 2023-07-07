import { prisma } from "$lib/server/db/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	const isDev = url.searchParams.has("dev") && url.searchParams.get("dev") === "true";
	let mergeSession = (isAdmin: boolean) => ({ session, isAdmin, isDev });

	if (!session?.user?.email) {
		return mergeSession(false);
	}
	const admin = await prisma.admin.findUnique({
		where: {
			email: session.user.email,
		},
		select: {
			email: true,
		},
	});

	const isAdmin = !!admin;

	return mergeSession(isAdmin);
};
