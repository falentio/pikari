import { ImageTransformer, ImageTransformOptions } from "~/src/interface/image_transformer.ts"
import ImgixClient from "imgix"

export class ImgixImageTransformer implements ImageTransformer {
	private imgixClient: ImgixClient
	constructor(domain: string, secret: string) {
		this.imgixClient = new ImgixClient({
			domain,
			secureURLToken: secret,
		})
	}

	transform(opts: ImageTransformOptions) {
		const params = {
			crop: "faces,entropy",
			fit: "crop",
		} as Record<string, string>;

		params.w = Math.min(opts.width, 2160).toString()
		params.h = Math.min(opts.height, 1080).toString()
		params.fm = opts.extension || "png"

		if (opts.blur) {
			params.blur = Math.min(opts.blur, 10) * 200
		}

		if (opts.grayscale) {
			params.monochrome = "929292";
		}

		const url = this.imgixClient.buildURL(opts.url, params)
		return Response.redirect(url)
	}
}
