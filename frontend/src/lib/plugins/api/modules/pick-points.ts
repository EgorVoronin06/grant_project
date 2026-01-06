// import type { Interest, UpdateInterestDto } from '$lib/types/types';
import type {
	CreatePickPointDto,
	DeletePickPointDto,
	PickPointDto,
	UpdatePickPointDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class PickPointsApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getPickPoints(): Promise<PickPointDto[]> {
		return await this.proxyFetch({
			url: `/pick-points/getall`
		});
	}

	public async createPickPoint(dto: Partial<CreatePickPointDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/pick-points/create`
		});
	}

	public async updatePickPoint(dto: UpdatePickPointDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/pick-points/update`
		});
	}

	public async deletePickPoint(dto: DeletePickPointDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/pick-points/delete`
		});
	}
}
