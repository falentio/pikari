import { HandlerContext } from "$fresh/server.ts";
import { imageService, imageTransformer } from "~/application.ts"
import { getOptionsFromURL } from "~/src/infrastructure/image_transformer/util.ts"

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
	let options: ImageTransformOptions | null = null
	try {
		options = getOptionsFromURL(req.url)
	} catch (e) {
		return new Response(e.message, { status: 400 })
	}

	const url = new URL(req.url)
	let seed = url.searchParams.get("seed") ?? crypto.randomUUID()
	const dseed = url.searchParams.get("seed_with")
	if (dseed) {
		seed = ""
		dseed.toLowerCase().split(",").slice(0, 5).forEach((i) => {
			if (i === "user-agent") {
				seed += req.headers.get("user-agent")
			}
			if (i === "referer") {
				seed += req.headers.get("referer")
			}
			if (i === "day") {
				seed += new Date().getDay().toString()
			}
			if (i === "date") {
				seed += new Date().getDate().toString()
			}
			if (i === "month") {
				seed += new Date().getMonth().toString()
			}
		})
	}
	const image = await imageService.getRandom(seed)
	console.log(seed, image)
	options.url = image.url
	return imageTransformer.transform(options)
};
