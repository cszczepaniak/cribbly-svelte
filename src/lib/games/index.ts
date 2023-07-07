import { gameKindTournament, type gameKind } from "$lib/utils/games";
import type { Division, Player } from "@prisma/client";

type Team = {
	id: string;
	division: Division | null;
	players: Player[];
};

type CompletedGame = {
	team1ID: string;
	team2ID: string;
	winner: string | null;
	loserScore: number | null;
};

type TeamWithStats = Team & {
	wins: number;
	losses: number;
	totalScore: number;
};

export function computeStatsForTeams(
	teams: Team[],
	completedGames: CompletedGame[],
): TeamWithStats[] {
	return teams
		.map(t => ({
			...t,
			wins: completedGames.filter(g => g.winner === t.id).length,
			losses: completedGames.filter(
				g => (g.team1ID === t.id || g.team2ID === t.id) && g.winner !== t.id,
			).length,
			totalScore: completedGames
				.filter(g => g.team1ID === t.id || g.team2ID === t.id)
				.reduce((score, g) => {
					if (g.winner === t.id) {
						return score + 121;
					}
					return score + (g.loserScore ?? 0);
				}, 0),
		}))
		.sort(teamIsLess);
}

export function generateTournamentGames(teams: TeamWithStats[]) {
	// Double-check that they're sorted, then take the top 32 teams.
	teams = teams.sort(teamIsLess).slice(0, 32);

	let upperSeeds = teams.slice(0, 16);
	let lowerSeeds = teams.slice(16).reverse();

	let games: { kind: gameKind; team1ID: string; team2ID: string }[] = [];
	for (let i = 0; i < 16; i++) {
		let t1 = upperSeeds[i];
		let t2 = lowerSeeds[i];
		games.push({
			kind: gameKindTournament,
			team1ID: t1.id,
			team2ID: t2.id,
		});
	}

	return games;
}

const hasNoGames = (t: TeamWithStats) => t.losses + t.wins + t.totalScore === 0;

function teamIsLess(a: TeamWithStats, b: TeamWithStats) {
	// Put teams with no recorded games at the bottom.
	if (hasNoGames(a) && !hasNoGames(b)) {
		return 1;
	} else if (!hasNoGames(a) && hasNoGames(b)) {
		return -1;
	}

	// Put teams with the highest number of wins furthest at the top.
	if (a.wins > b.wins) {
		// More wins towards the top.
		return -1;
	} else if (a.wins < b.wins) {
		return 1;
	}

	// Put teams with fewer losses next.
	if (a.losses < b.losses) {
		return -1;
	} else if (a.losses > b.losses) {
		return 1;
	}

	// Then sort by total score.
	if (a.totalScore > b.totalScore) {
		return -1;
	} else if (a.totalScore < b.totalScore) {
		return 1;
	}

	return 0;
}
