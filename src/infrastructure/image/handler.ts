import { Image, ImageRepository } from "~/src/domain/image/image.ts";
import { Handler, HandlerFn } from "~/src/interface/handler.ts";
import { ImageService } from "./service.ts"

export class ImageHandler implements Handler {
	handlers: [string, HandlerFn][]
	constructor(
		private imageService: ImageService,
	) {
		this.handlers = [
			["/image-list", (req) => this.getImages(req)],
		]
	}

	getImages(req: Request): Response {
		const s = new URL(req.url).searchParams
		const page = s.get("page") ?? "1"
		const perPage = s.get("per_page") ?? "20"
		const images = this.imageService.getImages(
			parseInt(perPage),
			parseInt(page),
		)
	}
}