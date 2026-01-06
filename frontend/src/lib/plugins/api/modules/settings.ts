import type { DeepPartialObject, DeliveryEnabledDto, DeliveryScheduleDto, DeliveryZone, SettingsDto, SiteEnabledDto } from "@ddsgt_mono/lib";
import { BaseApi, type Fetch } from ".";
export type SettingsResponse = { id: number, siteEnabled: boolean, deliveryZones: DeliveryZone[] }
export class SettingsApi extends BaseApi {
  constructor(svelteFetch: Fetch) {
    super(svelteFetch)
  }

  public async getAll(): Promise<SettingsDto> {
    return await this.proxyFetch({
      url: '/settings/get-all'
    })
  }

  public async updateZones(dto: DeepPartialObject<DeliveryZone[]>): Promise<SettingsDto> {
    return await this.proxyFetch({
      url: '/settings/update-zones',
      body: dto
    })
  }

  public async updateSchedule(dto: DeliveryScheduleDto): Promise<{ deliverySchedule: DeliveryScheduleDto }> {
    return await this.proxyFetch({
      url: '/settings/update-delivery-schedule',
      body: dto
    })
  }

  public async updateSiteStatus(dto: SiteEnabledDto): Promise<SiteEnabledDto> {
    return await this.proxyFetch({
      url: '/settings/update-site-status',
      body: dto
    })
  }

  public async updateDeliveryStatus(dto: DeliveryEnabledDto): Promise<DeliveryEnabledDto> {
    return await this.proxyFetch({
      url: '/settings/update-delivery-status',
      body: dto
    })
  }


}