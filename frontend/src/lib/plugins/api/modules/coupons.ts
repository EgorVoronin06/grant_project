import type {
	CheckCouponDto,
	CouponsDto,
	CreateCouponDto,
	DeleteCouponDto,
	UpdateCouponDto
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class CouponsApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async getCoupons() {
		return await this.proxyFetch({
			url: `/coupons/getAll`
		});
	}

	public async createCoupon(dto: Partial<CreateCouponDto>): Promise<CouponsDto> {
		return await this.proxyFetch({
			body: dto,
			url: `/coupons/create`
		});
	}

	public async updateCoupon(dto: UpdateCouponDto): Promise<CouponsDto> {
		return await this.proxyFetch({
			body: dto,
			url: `/coupons/update`
		});
	}

	public async deleteCoupon(dto: DeleteCouponDto) {
		return await this.proxyFetch({
			body: dto,
			url: `/coupons/delete`
		});
	}

	public async checkCoupon(dto: CheckCouponDto): Promise<CouponsDto> {
		return await this.proxyFetch({
			body: dto,
			url: `/coupons/check`
		});
	}
}
