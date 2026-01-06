import { getGuestById } from '$lib/db/repositories/guests.repository';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	if (!params.id) {
		return error(500, 'Some error');
	}
	try {
		const data = await getGuestById(+params.id);
		return json(data[0]);
	} catch (e) {
		console.log(e);
		return error(500, 'Some error');
	}
};
