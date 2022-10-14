import { ImageTransformOptions } from "~/src/interface/image_transformer.ts"

const DIGIT_ONLY = /^[0-9].*$/

export function getOptionsFromURL(url: string): ImageTransformOptions {
	const s = new URL(url).searchParams
	const width = s.get("width")
	if (!width) {
		throw new Error("invalid width query")
	}
	const height = s.get("height") ?? width
	if (!DIGIT_ONLY.test(height) || !DIGIT_ONLY.test(width)) {
		throw new Error("width and height query receive only digit number")
	}

	const blur = s.get("blur")
	if (blur && !DIGIT_ONLY.test(blur)) {
		throw new Error("blur query receive only digit number")
	}

	const grayscale = s.get("grayscale") !== null

	return {
		url: "",
		width: parseInt(width),
		height: parseInt(height),
		grayscale,
		...(blur && { blur: parseInt(blur) }),
	}
}