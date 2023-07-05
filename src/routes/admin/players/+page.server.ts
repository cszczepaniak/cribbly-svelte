import { prisma } from "$lib/server/db/client";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { zfd } from "zod-form-data";
import type { z } from "zod";

export const load: PageServerLoad = async () => {
	const players = await prisma.player.findMany();
	return { players };
};

const playerSchema = zfd.formData({
	firstName: zfd.text(),
	lastName: zfd.text(),
});

type Errors = z.inferFormattedError<typeof playerSchema>;

export const actions: Actions = {
	addPlayer: async event => {
		const formData = await event.request.formData();
		const schema = zfd.formData({
			firstName: zfd.text(),
			lastName: zfd.text(),
		});

		let result = schema.safeParse(formData);
		if (!result.success) {
			const errors: Errors = result.error.format();
			return fail(400, { errors });
		}

		await prisma.player.create({
			data: result.data,
		});
	},
	removePlayer: async event => {
		const formData = await event.request.formData();

		let id = String(formData.get("id"));
		await prisma.player.delete({
			where: {
				id,
			},
		});
	},
};
