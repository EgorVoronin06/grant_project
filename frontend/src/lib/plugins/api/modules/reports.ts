import type { ReportDataDto, ReportDto } from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class ReportsApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getReport(dto: Partial<ReportDto>): Promise<ReportDataDto> {
		return await this.proxyFetch({
			url: '/reports',
			body: dto
		});
	}
}
