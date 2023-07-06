import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { gameKindPrelim, gameKindTournament } from "$lib/utils/games";
import { computeStatsForTeams, generateTournamentGames } from "$lib/games";

export const load: PageServerLoad = async () => {
	const games = await prisma.game.findMany({
		where: {
			kind: gameKindTournament,
		},
	});

	const teamIDs = games.reduce(
		(prev, curr) => [...prev, curr.team1ID, curr.team2ID],
		[] as string[],
	);

	const teams = await prisma.team.findMany({
		where: {
			id: {
				in: teamIDs,
			},
		},
		include: {
			players: true,
		},
	});

	return {
		games: games.map(g => ({
			...g,
			team1: teams.find(t => t.id === g.team1ID),
			team2: teams.find(t => t.id === g.team2ID),
		})),
	};
};

export const actions: Actions = {
	default: async () => {
		const teams = await prisma.team.findMany({
			select: {
				id: true,
				division: true,
				players: true,
			},
		});

		const games = await prisma.game.findMany({
			where: {
				kind: gameKindPrelim,
			},
		});

		const teamsWithStats = computeStatsForTeams(teams, games);
		const tournamentGames = generateTournamentGames(teamsWithStats);

		await prisma.game.createMany({
			data: tournamentGames,
		});
	},
};
