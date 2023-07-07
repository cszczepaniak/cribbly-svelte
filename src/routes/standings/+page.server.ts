import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const teams = await prisma.team.findMany({
		select: {
			id: true,
			division: true,
			players: true,
		},
	});

	const games = await prisma.prelimGame.findMany();

	return {
		teams,
		games,
	};
};

export const actions: Actions = {};
