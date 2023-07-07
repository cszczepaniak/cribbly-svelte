import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	let division = await prisma.division.findUnique({
		where: {
			id: params.id,
		},
		select: {
			games: true,
		},
	});

	let teamIDs = division?.games.reduce((prev, g) => {
		prev.add(g.team1ID);
		prev.add(g.team2ID);
		return prev;
	}, new Set<string>());

	let ts = await prisma.team.findMany({
		where: {
			id: {
				in: Array.from(teamIDs ?? new Set<string>()),
			},
		},
		select: {
			id: true,
			players: true,
		},
	});

	let games = division?.games.map(g => {
		let team1 = ts.find(t => t.id === g.team1ID);
		let team2 = ts.find(t => t.id === g.team2ID);

		return {
			...g,
			team1,
			team2,
		};
	});

	return {
		games,
	};
};

export const actions: Actions = {
	completeAll: async event => {
		const formData = await event.request.formData();
		const divisionID = String(formData.get("divisionID"));

		const gamesToComplete = await prisma.prelimGame.findMany({
			where: {
				divisionID,
				loserScore: null,
				winner: null,
			},
		});

		for (let g of gamesToComplete) {
			await prisma.prelimGame.update({
				where: {
					id: g.id,
				},
				data: {
					winner: g.team1ID,
					loserScore: 113,
				},
			});
		}
	},
};
