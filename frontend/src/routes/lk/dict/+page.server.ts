import { getAllGuests } from '$lib/db/repositories/guests.repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const guests = await getAllGuests();
	return {
		guests
	};
};
