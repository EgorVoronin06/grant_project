import type {
	CreateIngredientDto,
	DeleteIngredientDto,
	IngredientsDto,
	UpdateIngredientDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class IngredientsApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getIngredients(): Promise<IngredientsDto[]> {
		return await this.proxyFetch({
			url: `/ingredients/getAll`
		});
	}

	// public async getIngredientsBySearch(searchQuery: string) {
	// 	return await this.proxyFetch({
	// 		url: `/ingredients`
	// 	});
	// }

	public async createIngredient(dto: Partial<CreateIngredientDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/ingredients/create`
		});
	}

	public async updateIngredient(dto: UpdateIngredientDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/ingredients/update`
		});
	}

	public async deleteIngredient(dto: DeleteIngredientDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/ingredients/delete`
		});
	}
}
