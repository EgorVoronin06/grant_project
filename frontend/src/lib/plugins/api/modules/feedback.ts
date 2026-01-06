import type { CreateFeedbackDto, FeedbackDto, UpdateFeedbackDto } from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class FeedbackApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getFeedback(): Promise<FeedbackDto[]> {
		return await this.proxyFetch({
			url: `/feedback/getAll`
		});
	}

	public async createFeedback(dto: CreateFeedbackDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/feedback/create`
		});
	}

	public async updateFeedback(dto: UpdateFeedbackDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/feedback/update`
		});
	}
}
