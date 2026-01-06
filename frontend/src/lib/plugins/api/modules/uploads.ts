import type { ImageResponse } from '@ddsgt_mono/lib';
import { BaseApi, type Fetch } from '.';

export class UploadsApi extends BaseApi {
	constructor(svelteFetch: Fetch) {
		super(svelteFetch);
	}

	public async uploadImage(data: FormData): Promise<ImageResponse> {
		return await this.proxyFetch({
			body: data,
			contentType: 'formData',
			url: `/uploads`
		});
	}
}
