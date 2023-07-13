import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const fakeGames = async () => {
	return new Array(8).fill(0).map((_, i) => ({
		team1: {
			players: [
				{ firstName: "t1".repeat(20), lastName: "p1" },
				{ firstName: "t1", lastName: "p2" },
			],
			seed: i + 1,
		},
		team2: {
			players: [
				{ firstName: "t2", lastName: "p1" },
				{ firstName: "t2", lastName: "p2" },
			],
			seed: 16 - i,
		},
	}));
};

export const load: PageServerLoad = async () => {
	const games = await fakeGames();
	console.log(games);
	return {
		rounds: [
			games,
			games.slice(0, 4).map(g => ({ ...g, team1: undefined, team2: undefined })),
			games.slice(0, 2).map(g => ({ ...g, team1: undefined, team2: undefined })),
			games.slice(0, 1).map(g => ({ ...g, team1: undefined, team2: undefined })),
		],
	};
};

export const actions: Actions = {};
