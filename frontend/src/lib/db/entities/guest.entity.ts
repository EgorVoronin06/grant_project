import type { FrameData } from '$lib/interfaces/frame-data.interface';
import { jsonb, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const guests = pgTable('guests', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	data: jsonb('data').$type<FrameData>().notNull()
});
