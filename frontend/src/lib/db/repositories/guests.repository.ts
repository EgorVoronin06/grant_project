import { eq } from 'drizzle-orm';
import type { GuestCreateDTO } from '../../../routes/api/guests/+server';
import { db } from '../connection.provider';
import { guests } from '../entities/guest.entity';

export async function createGuest(dto: GuestCreateDTO) {
	const res = await db
		.insert(guests)
		.values({ name: dto.name, data: JSON.stringify(dto.data) })
		.returning();

	return res[0];
}

export async function getAllGuests() {
	return await db.select({ id: guests.id, name: guests.name }).from(guests);
}
export async function getGuestById(id: number) {
	return await db.select().from(guests).where(eq(guests.id, id));
}
export async function getGuestByName(name: string) {
	return await db.select().from(guests).where(eq(guests.name, name));
}

export async function removeGuestById(id: number) {
	return await db.delete(guests).where(eq(guests.id, id)).returning({ id: guests.id });
}
