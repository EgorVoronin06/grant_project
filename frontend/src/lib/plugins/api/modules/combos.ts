import type {
	ComboDto,
	CreateComboDto,
	DeepPartialObject,
	DeleteComboDto,
	UpdateComboDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class CombosApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getCombos(): Promise<ComboDto[]> {
		return await this.proxyFetch({
			url: `/combos/getAll`,
			body: {}
		});
	}

	public async createCombo(dto: DeepPartialObject<CreateComboDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/combos/create`
		});
	}

	public async updateCombo(dto: DeepPartialObject<UpdateComboDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/combos/update`
		});
	}

	public async deleteCombo(dto: DeleteComboDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/combos/delete`
		});
	}
}
