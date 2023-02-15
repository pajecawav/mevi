import fs from "fs/promises";
import path from "path";
import { config } from "./config";

export const IMAGE_EXTENSIONS = new Set(["jpeg", "jpg", "png", "bmp", "avif", "webp", "gif"]);

function isMedia(file: string) {
	const ext = path.extname(file).slice(1);
	return IMAGE_EXTENSIONS.has(ext);
}

export async function getMediaFiles() {
	const allFiles = await fs.readdir(config.root);
	const files = allFiles.filter(isMedia);
	return files;
}
