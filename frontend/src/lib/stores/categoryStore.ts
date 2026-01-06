import type { Category } from '@ddsgt_mono/lib';
import { writable, type Writable } from 'svelte/store';

export const categoriesStore: Writable<Category[]> = writable();
