import type {
	AttributesDto,
	CreateAttributeDto,
	DeleteAttributeDto,
	UpdateAttributeDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class AttributesApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getAttributes(): Promise<AttributesDto[]> {
		return await this.proxyFetch({
			url: `/attributes/getAll`
		});
	}

	// public async getAttributeBySearch(searchQuery: string) {
	// 	return await this.proxyFetch({
	// 		url: `/attributes`
	// 	});
	// }

	public async createAttribute(dto: Partial<CreateAttributeDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/attributes/create`
		});
	}

	public async updateAttribute(dto: UpdateAttributeDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/attributes/update`
		});
	}

	public async deleteAttribute(dto: DeleteAttributeDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/attributes/delete`
		});
	}
}
