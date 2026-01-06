import { writable, type Writable } from 'svelte/store';

// Локальный тип для атрибутов
export interface AttributesDto {
	id?: number;
	name?: string;
	value?: string;
	[key: string]: any;
}

export const attributesStore: Writable<AttributesDto[]> = writable();
