import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/client";

export const load: PageServerLoad = async () => {
	let teams = await prisma.team.findMany({
		select: {
			id: true,
			divisionID: true,
			division: true,
			players: true,
		},
	});

	let playersWithoutTeams = await prisma.player.findMany({
		where: {
			teamID: null,
		},
	});

	let divisions = await prisma.division.findMany();

	return { teams, playersWithoutTeams, divisions };
};

export const actions: Actions = {
	newTeam: async () => {
		await prisma.team.create({
			data: {},
		});
	},
	removeTeam: async event => {
		const formData = await event.request.formData();

		let id = String(formData.get("id"));
		await prisma.team.delete({
			where: {
				id,
			},
		});
	},
	removePlayerFromTeam: async event => {
		const formData = await event.request.formData();

		let teamID = String(formData.get("teamID"));
		let playerID = String(formData.get("playerID"));

		await prisma.team.update({
			where: {
				id: teamID,
			},
			data: {
				players: {
					disconnect: {
						id: playerID,
					},
				},
			},
		});
	},
	removeTeamFromDivision: async event => {
		const formData = await event.request.formData();
		let id = String(formData.get("id"));

		await prisma.team.update({
			where: {
				id,
			},
			data: {
				division: {
					disconnect: true,
				},
			},
		});
	},
	addTeamToDivision: async event => {
		const formData = await event.request.formData();
		let teamID = String(formData.get("teamID"));
		let divisionID = String(formData.get("divisionID"));

		await prisma.team.update({
			where: { id: teamID },
			data: {
				division: {
					connect: {
						id: divisionID,
					},
				},
			},
		});
	},
	addPlayerToTeam: async event => {
		const formData = await event.request.formData();

		let teamID = String(formData.get("teamID"));
		let playerID = String(formData.get("playerID"));

		try {
			return await prisma.$transaction(async () => {
				const team = await prisma.team.findUnique({
					where: {
						id: teamID,
					},
					select: {
						players: true,
					},
				});

				if (team && team.players && team.players.length >= 2) {
					throw new Error("Cannot have a team with more than two players");
				}

				return await prisma.team.update({
					where: {
						id: teamID,
					},
					data: {
						players: {
							connect: {
								id: playerID,
							},
						},
					},
				});
			});
		} catch {}
	},
};
