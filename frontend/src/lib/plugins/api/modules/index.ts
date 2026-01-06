import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
// import type { ProxyData } from '$lib/types/types';
import { ApiError } from '..';
// import { env } from '$env/dynamic/public';

export type ProxyData = {
	url: string;
	body?: object;
	contentType?: 'json' | 'formData';
};

export interface Fetch {
	(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}
export abstract class BaseApi {
	protected readonly customFetch: Fetch;

	constructor(fetchFunc: Fetch) {
		if (!fetchFunc && !browser) {
			throw new Error('You can`t use node fetch on server');
		}

		if (fetchFunc === fetch && !browser) {
			throw new Error('Fetch is not svelte fetch');
		}

		if (fetchFunc) {
			this.customFetch = fetchFunc;
		} else {
			this.customFetch = fetch;
		}
	}

	protected async proxyFetch(payload: ProxyData) {
		let res;
		if (payload.contentType === 'formData') {
			if (!(payload.body instanceof FormData)) {
				throw new Error('Invalid payload body for formData content type');
			}
			res = await this.customFetch(`${env.PUBLIC_FRONT_URL}/api/uploads`, {
				method: 'POST',
				body: payload?.body
			});
		} else {
			res = await this.customFetch(`${env.PUBLIC_FRONT_URL}/api`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		// const res = await this.customFetch(`${env.PUBLIC_FRONT_URL}/api`, {

		if (!res.ok) {
			throw new ApiError(res.status, await res.json());
		}
		return await res.json();
	}
}
