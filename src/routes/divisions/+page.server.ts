import { prisma } from '$lib/server/db/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const divisions = await prisma.division.findMany();

    return {
        divisions
    };
};