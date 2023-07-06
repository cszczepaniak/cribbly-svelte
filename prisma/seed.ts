import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({
	log: ["query"],
	datasources: {
		db: {
			url: process.env.DATABASE_URL,
		},
	},
});

async function seedPlayers() {
	for (let i = 0; i < 128; i++) {
		await prisma.player.create({
			data: {
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
			},
		});
	}
}

seedPlayers();
