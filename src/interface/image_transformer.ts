export interface ImageTransformOptions {
	url: string
	width: number
	height: number
	blur?: number
	grayscale?: boolean
	extension?: "jpg" | "png" | "webp" | "avif"
}

export interface ImageTransformer {
	transform(options: ImageTransformOptions): Promise<Response>
}