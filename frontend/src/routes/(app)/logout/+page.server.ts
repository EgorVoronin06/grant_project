import { type ServerLoad } from '@sveltejs/kit';
import { authApi } from '$lib/plugins/api/modules/auth';
export const load: ServerLoad = async ({ cookies }) => {
	const token = cookies.get('refresh');
	try {
		await authApi.logout(token || '');
	} catch (error) {
		console.log(error);
	}
	cookies.delete('access', { path: '/' });
	cookies.delete('refresh', { path: '/' });
	return {};
};
