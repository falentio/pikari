import { Handler } from "~/src/interface/handler.ts"
import { Image, ImageRepository } from "~/src/domain/image/image.ts";

export class ImageService {
	constructor(
		private repo: ImagesRepository,
	) {}

	getImages(perPage: number, page: number) {
		return this.repo.getImages(perPage, page)
	}

	async getRandom(seed: string) {
		const random = createRng(seed);
		const images = await this.repo.getAll();
		return images[random(images.length)];
	}
}

function createRng(seed: string) {
	let state = (seed.length + 1) ** 4
	for (const c of seed) {
		state += c.charCodeAt(0)
		state = xorshift32(state)
	}

	return (max: number) => {
		state = xorshift32(state)
		return (state >>> 0) % max
	}
}

function xorshift32(n: number) {
	n ^= n << 13
	n ^= n >>> 17
	n ^= n << 5
	return n
}