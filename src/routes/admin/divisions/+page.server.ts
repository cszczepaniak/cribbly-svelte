import { prisma } from "$lib/server/db/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const divisions = await prisma.division.findMany();

	return {
		divisions,
	};
};

export const actions: Actions = {
	newDivision: async () => {
		await prisma.division.create({
			data: {
				name: "Unnamed Division",
			},
		});
	},
	renameDivision: async event => {
		const formData = await event.request.formData();
		let id = String(formData.get("id"));
		let name = String(formData.get("name"));

		await prisma.division.update({
			where: {
				id,
			},
			data: {
				name,
			},
		});
	},
	removeDivision: async event => {
		const formData = await event.request.formData();
		let id = String(formData.get("id"));

		await prisma.division.delete({
			where: {
				id,
			},
		});
	},
};
