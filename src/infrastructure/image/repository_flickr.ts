import { Image, ImageRepository } from "~/src/domain/image/image.ts";

const BASE_URL = "https://api.flickr.com/services/rest";

export interface FlickrImageRepositoryOptions {
	apikey: string;
}

export class FlickrImageRepository implements ImageRepository {
	#apikey: string;
	#keyword: string;
	constructor(apikey: string, keyword: string) {
		this.#apikey = apikey;
		this.#keyword = keyword
	}

	async fetch<T extends Record<string, unknown>>(
		searchParams: Record<string, string> = {},
		init: RequestInit = {},
	): T {
		const url = new URL(BASE_URL);
		for (const [key, value] of Object.entries(searchParams)) {
			url.searchParams.set(key, value);
		}
		url.searchParams.set("api_key", this.#apikey);
		url.searchParams.set("format", "json");
		url.searchParams.set("nojsoncallback", "1");
		const res = await fetch(url, init);
		if (!res.ok) {
			await res.arrayBuffer();
			throw new Error(
				"non 2xx response status code received from flickr, received: " + res.status,
			);
		}

		const body = await res.json() as T;
		if ("code" in body) {
			throw new Error(body.message);
		}

		return body;
	}

	async getAll() {
		return this.getImages(500);
	}

	async getImages(perPage: number, page = 1) {
		if (perPage > 500) {
			throw new Error("Flickr only support at most 500 image per pages, received: " + perPage)
		}
		const result: Image[] = [];
		const body = await this.fetch({
			text: this.#keyword,
			page,
			per_page: perPage.toString(),
			extras: [
				"url_o",
				"url_f",
				"url_k",
				"url_h",
				"url_b",
				"owner_name",
			].join(),
			media: "photos",
			sort: "interestingness-desc",
			privacy_filter: "1",
			method: "flickr.photos.search",
		});
		for (const photo of body.photos.photo) {
			const url = photo.url_h || photo.url_k || photo.url_f || photo.url_o || photo.url_b;
			if (!url || !photo.id) {
				continue;
			}
			const image = new Image(
				photo.id,
				photo.ownername || photo.owner || "unknown",
				url,
				flickrShortener(photo.id),
			)
			result.push(image);
		}
		return result;
	}

	async getById(id: string) {
		throw new Error("unimplemented")
		return new Image("", "", "", "")
	}
}

function flickrShortener(id: string) {
	const chars = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
	let n = parseInt(id);
	let result = "";
	while (n > 0) {
		const remainder = n % 58;
		result = chars[remainder] + result;
		n = n / 58 | 0;
	}
	return "https://flic.kr/p/" + result;
}
