import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FrameData } from '$lib/interfaces/frame-data.interface';
import { createGuest, getAllGuests, removeGuestById } from '$lib/db/repositories/guests.repository';

export type GuestCreateDTO = {
	name: string;
	data: FrameData[];
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: GuestCreateDTO = await request.json();
		const guestRes = await createGuest(data);
		return json(guestRes);
	} catch (e) {
		console.log(e);
		return error(400, 'Невалидный формат');
	}
};

export const GET: RequestHandler = async () => {
	try {
		const data = await getAllGuests();
		return json(data);
	} catch (e) {
		console.log(e);
		return error(500, 'Some error');
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();
		const data = await removeGuestById(id);
		return json(data);
	} catch (e) {
		console.log(e);
		return error(500, 'Some error');
	}
};
