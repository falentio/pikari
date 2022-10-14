import { parse } from "std/flags/mod.ts";

import { ImageRepository, Image } from "~/src/domain/image/image.ts";
import { FlickrImageRepository } from "~/src/infrastructure/image/repository_flickr.ts";

const {
	generator = "flickr",
	count = "10",
	keyword = "cat,michi,gatitos",
} = parse(Deno.args);

const generators: Record<string, () => ImageRepository> = {};
generators.flickr = () => {
	const apikey = mustGetEnv("FLICKR_APIKEY");
	return new FlickrImageRepository(apikey, keyword);
};

console.error("Generating images with");
console.error(JSON.stringify(
	{
		generator,
		keyword,
		count,
	},
	null,
	"\t",
));
const images: Image[] = []
let page = 1
while (images.length < count) {
	const imgs = await generators[generator]().getImages(100, page);
	images.push(...imgs)
	page++
}
console.log(JSON.stringify(images, null, "\t"));

function mustGetEnv(name: string): string {
	const v = Deno.env.get(name);
	if (!v) {
		console.error(`Missing ${name} environment variable`);
		Deno.exit(1);
	}
	return v;
}
