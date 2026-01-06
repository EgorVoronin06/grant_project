import type {
	CreatePromosDto,
	DeletePromosDto,
	PromosWithImageDto,
	UpdatePromosDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class PromosApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getPromos(): Promise<PromosWithImageDto[]> {
		return await this.proxyFetch({
			url: '/promos/getall'
		});
	}

	public async createPromos(dto: Partial<CreatePromosDto>) {
		return await this.proxyFetch({
			url: '/promos/create',
			body: dto
		});
	}

	public async updatePromos(dto: UpdatePromosDto) {
		return await this.proxyFetch({
			url: '/promos/update',
			body: dto
		});
	}

	public async deletePromos(dto: DeletePromosDto) {
		return await this.proxyFetch({
			url: '/promos/delete',
			body: dto
		});
	}
}
