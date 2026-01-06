// import type { Interest, UpdateInterestDto } from '$lib/types/types';
import type {
	Category,
	CreateCategoryDto,
	DeleteCategoryDto,
	UpdateCategoryDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class CategoriesApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getCategories(): Promise<Category[]> {
		return await this.proxyFetch({
			url: `/categories/getall`
		});
	}

	// public async getCategorysBySearch(searchQuery: string) {
	// 	return await this.proxyFetch({
	// 		method: 'GET',
	// 		url: `/categories`
	// 	});
	// }

	public async createCategory(dto: Partial<CreateCategoryDto>) {
		return await this.proxyFetch({
			body: dto,
			url: `/categories/create`
		});
	}

	public async updateCategory(dto: UpdateCategoryDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/categories/update`
		});
	}

	public async deleteCategory(dto: DeleteCategoryDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/categories/delete`
		});
	}
}
