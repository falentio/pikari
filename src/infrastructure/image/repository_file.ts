import { Image, ImageRepository } from "~/src/domain/image/image.ts";

export class FileImageRepository implements ImageRepository {
	#filepath: string;
	#images: Image[];
	constructor(filepath: string) {
		this.#filepath = filepath;
		this.#images = []
	}

	async #getImages() {
		if (this.#images.length) {
			return this.#images
		}

		const res = await fetch(this.#filepath)
		if (res.status !== 200) {
			throw new Error("FileImageRepository: non 200 status code received")
		}

		const json = await res.json()
		for (const { id, owner, url, shareUrl } of json) {
			if (!(id && owner && url)) {
				throw new Error("FileImageRepository: invalid image object received, all field must be provided")
			}
			const image = new Image(id, owner, url, shareUrl)
			this.#images.push(image)
		}

		return this.#images
	}

	getAll() {
		return this.#getImages()
	}

	async getImages(perPage: number, page = 1) {
		const images = await this.#getImages()
		const start = perPage * (page - 1) 
		const end = perPage * (page) 
		return images.slice(start, end)
	}

	async getById(id: string) {
		const images = await this.#getImages()
		return images.find(i => i.id === id) || null
	}
}
