import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/client";
import { generatePrelimGames } from "$lib/server/games/games";
import { gameKindPrelim } from "$lib/server/utils/games";

const getPrelimGames = async () => {
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
		>(),
	);

	return games.map(g => ({
		...g,
		teams: [teams.get(g.team1ID), teams.get(g.team2ID)],
	}));
};

export const load: PageServerLoad = async () => {
	let games = await getPrelimGames();
	return { games };
};

export const actions: Actions = {
	createPrelims: async () => {
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

		let invalid = divs.filter(d => d.teams.length !== 4 && d.teams.length !== 6);

		if (invalid.length > 0) {
			return fail(400, {
				create: invalid.map(d => ({ name: d.name, nTeams: d.teams.length })),
			});
		}

		const games = generatePrelimGames(divs);

		await prisma.game.createMany({
			data: Array.from(games.entries()).flatMap(([divID, pairs]) =>
				pairs.map(pair => ({
					kind: gameKindPrelim,
					team1ID: pair[0],
					team2ID: pair[1],
					divisionID: divID,
				})),
			),
			skipDuplicates: true,
		});
	},
	deleteAllGames: async () => {
		await prisma.game.deleteMany({
			where: {
				kind: gameKindPrelim,
			},
		});
	},
};
