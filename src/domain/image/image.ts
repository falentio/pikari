export class Image {
	constructor(
		public id: string, 
		public owner: string, 
		public url: string, 
		public shareUrl: string = url,
	) {}
}

export interface ImageRepository {
	getAll(): Promise<Image[]>
	getImages(perPage: number, page?: number): Promise<Image[]>
	getById(id: string): Promise<Image>
}
