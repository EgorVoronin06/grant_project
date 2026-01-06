import type { DeleteUserDto, getUsersDto, UpdateUserDto } from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class UsersApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	async updateUser(user: UpdateUserDto) {
		return await this.proxyFetch({
			url: `/users/update`,
			body: user
		});
	}

	async getUsers(dto: getUsersDto) {
		return await this.proxyFetch({
			url: `/users/get`,
			body: dto
		});
	}

	async deleteUser(dto: DeleteUserDto) {
		return await this.proxyFetch({
			url: `/users/delete`,
			body: dto
		});
	}
}
