import { prisma } from "$lib/server/db/client";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { subscribeToGameUpdates } from "$lib/realtime";

export const load: PageServerLoad = async ({ params }) => {
	let game = await prisma.game.findUnique({
		where: {
			id: params.id,
		},
	});

	let teams = await prisma.team.findMany({
		where: {
			id: {
				in: [game?.team1ID ?? "", game?.team2ID ?? ""],
			},
		},
		select: {
			id: true,
			players: true,
		},
	});

	return {
		game: {
			...game,
			team1: teams.find(t => t.id === game?.team1ID),
			team2: teams.find(t => t.id === game?.team2ID),
			complete: !!game?.loserScore && !!game?.winner,
		},
	};
};

const scoreSchema = zfd.formData({
	gameID: zfd.text(z.string().cuid()),
	teamID: zfd.text(z.string().cuid()),
	loserScore: zfd.numeric(z.number().min(0).max(120)),
});

const client = subscribeToGameUpdates();

export const actions: Actions = {
	default: async event => {
		const formData = await event.request.formData();
		const schema = zfd.formData(scoreSchema);

		let result = schema.safeParse(formData);
		if (!result.success) {
			const errors = result.error.flatten();
			return fail(400, { formErrors: errors.fieldErrors });
		}

		let updateResult = await prisma.game.updateMany({
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
			})
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
