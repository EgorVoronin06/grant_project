import { BaseApi, type Fetch } from '.';
import type { ITokens, RefreshResponse } from '@ddsgt_mono/lib';
import { ApiError } from '..';
import { env } from '$env/dynamic/public';

async function logout(token: string) {
	const res = await fetch(`${env.PUBLIC_API_URL}/auth/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ token })
	});
	if (!res.ok) {
		throw new ApiError(res.status, (await res.json()).message || res.statusText);
	}
	return await res.json();
}

async function refresh(refreshToken: string): Promise<RefreshResponse> {
	const response = await fetch(`${env.PUBLIC_API_URL}/auth/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			token: refreshToken
		})
	});
	if (!response.ok) {
		throw new ApiError(response.status, (await response.json()).message || response.statusText);
	}
	return await response.json();
}

export class AuthApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async sendCode(phone: string) {
		return await this.proxyFetch({
			url: '/auth/send-code',
			body: { phone }
		});
	}

	public async signIn(phone: string, code: string): Promise<ITokens> {
		const res = await fetch(`${env.PUBLIC_API_URL}/auth/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone, code })
		})
		if (!res.ok) {
			throw new ApiError(res.status, await res.json());
		}
		return await res.json();
	}
}

export const authApi = {
	refresh,
	logout,
};