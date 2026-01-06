import type {
	AddressSuggestionResponse,
	CreateOrderDTO,
	OrderCreateResponse,
	getOrdersDTO,
	OrderDTO,
	UpdateOrderStatusDTO
} from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class OrdersApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}
	public async getSuggestions(query: string): Promise<AddressSuggestionResponse> {
		return await this.proxyFetch({
			url: `/orders/get-suggestions`,
			body: {
				query
			}
		});
	}

	public async countDeliveryPrice(point: [number, number], orderSum: number) {
		return await this.proxyFetch({
			url: '/orders/count-delivery',
			body: {
				point,
				orderSum
			}
		});
	}

	public async checkDeliveryStatus(): Promise<boolean> {
		return await this.proxyFetch({
			url: '/orders/check-delivery-status'
		});
	}

	public async createOrder(order: Partial<CreateOrderDTO>): Promise<OrderCreateResponse> {
		return await this.proxyFetch({
			url: '/orders/create',
			body: order
		});
	}

	public async getOrderByUuid(uuid: string): Promise<OrderDTO | undefined> {
		return await this.proxyFetch({
			url: `/orders/${uuid}`
		});
	}

	public async getOrders(dto?: getOrdersDTO) {
		return await this.proxyFetch({
			url: `/orders/get`,
			body: dto
		});
	}

	public async updateOrderStatus(dto: UpdateOrderStatusDTO) {
		return await this.proxyFetch({
			url: `/orders/update-status`,
			body: dto
		});
	}
}
