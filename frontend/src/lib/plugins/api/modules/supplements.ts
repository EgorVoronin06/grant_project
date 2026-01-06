// import type { Interest, UpdateInterestDto } from '$lib/types/types';
import type {
	CreateSupplementDto,
	DeleteSupplementDto,
	UpdateSupplementDto,
	SupplementsWithImage
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class SupplementsApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getSupplements(): Promise<SupplementsWithImage[]> {
		return await this.proxyFetch({
			url: `/supplements/getall`
		});
	}

	public async createSupplement(dto: Partial<CreateSupplementDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/supplements/create`
		});
	}

	public async updateSupplement(dto: UpdateSupplementDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/supplements/update`
		});
	}

	public async deleteSupplement(dto: DeleteSupplementDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/supplements/delete`
		});
	}
}
