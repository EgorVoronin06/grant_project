import type { QueryParams } from '$lib/types/types';

export default function joinSearchParams(params: QueryParams): string {
	const searchParams = new URLSearchParams();

	const { userId, searchQuery, all, page, limit } = params;
	if (userId) {
		searchParams.set('userid', userId.toString());
	}
	if (searchQuery) {
		searchParams.set('search', searchQuery);
	}
	if (all) {
		searchParams.set('all', all.toString());
	}
	if (page) {
		searchParams.set('page', page.toString());
	}
	if (limit) {
		searchParams.set('limit', limit.toString());
	}

	return searchParams.toString();
}
