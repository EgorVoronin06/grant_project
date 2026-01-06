import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		console.log(data);
		return json({ a: 1231 });
	} catch (e) {
		console.log(e);
		return error(400, 'Невалидный формат');
	}
};
