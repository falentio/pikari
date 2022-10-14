import { ImageService } from "~/src/infrastructure/image/service.ts"
import { FileImageRepository } from "~/src/infrastructure/image/repository_file.ts"
import { ImgixImageTransformer } from "~/src/infrastructure/image_transformer/transformer_imgix.ts"

const imageRepository = new FileImageRepository(
	new URL("albums/cat.json", import.meta.url).href,
)
export const imageService = new ImageService(imageRepository)
export const imageTransformer = new ImgixImageTransformer(
	Deno.env.get("IMGIX_DOMAIN")!,
	Deno.env.get("IMGIX_SECRET")!,
)