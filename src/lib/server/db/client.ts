import { env } from "$env/dynamic/private";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
	log: ["query"],
	datasources: {
		db: {
			url: env.DATABASE_URL,
		},
	},
});
