import { browser } from '$app/environment';
import { redirect, type Load } from '@sveltejs/kit';
import { user } from '../../../lib/stores/authStore';

export const load: Load = () => {
	if (browser) {
		user.set(undefined);
	}
	throw redirect(303, '/');
};
