import { prisma } from "$lib/server/db/client";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { subscribeToGameUpdates } from "$lib/realtime";

export const load: PageServerLoad = async ({ params }) => {
	let game = await prisma.prelimGame.findUnique({
		where: {
			id: params.id,
		},
	});

	if (!game) {
		throw new Error(`could not find game with id [${params.id}]`);
	}

	let teams = await prisma.team.findMany({
		where: {
			id: {
				in: [game.team1ID, game.team2ID],
			},
		},
		select: {
			id: true,
			players: true,
		},
	});

	let team1 = teams.find(t => t.id === game?.team1ID);
	let team2 = teams.find(t => t.id === game?.team2ID);

	if (!team1) {
		throw new Error(`could not find team with id [${game.team1ID}]`);
	}

	if (!team2) {
		throw new Error(`could not find team with id [${game.team2ID}]`);
	}

	return {
		game: {
			...game,
			team1,
			team2,
		},
	};
};

const scoreSchema = zfd.formData({
	gameID: zfd.text(z.string().cuid()),
	teamID: zfd.text(z.string().cuid()),
	loserScore: zfd.numeric(z.number().min(0).max(120)),
});

type flattenedErrors = z.inferFlattenedErrors<typeof scoreSchema>;

const client = subscribeToGameUpdates();

export const actions: Actions = {
	default: async event => {
		const formData = await event.request.formData();
		const schema = zfd.formData(scoreSchema);

		let result = schema.safeParse(formData);
		if (!result.success) {
			const errors = result.error.flatten() as flattenedErrors;
			return fail(400, { formErrors: errors.fieldErrors });
		}

		let updateResult = await prisma.prelimGame.updateMany({
			where: {
				id: result.data.gameID,
				winner: null,
				loserScore: null,
			},
			data: {
				winner: result.data.teamID,
				loserScore: result.data.loserScore,
			},
		});

		if (updateResult.count === 0) {
			return fail(400, {
				updateError: true,
			});
		}

		client.notifyGameUpdate({
			gameID: result.data.gameID,
			winnerID: result.data.teamID,
			loserScore: result.data.loserScore,
		});

		let redirectTo = event.url.searchParams.get("fromDivision");
		if (redirectTo) {
			throw redirect(303, `/division/${redirectTo}`);
		}
	},
};
