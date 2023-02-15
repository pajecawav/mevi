import { FastifyPluginCallback } from "fastify";
import { getMediaFiles } from "./media";

export const apiRouter: FastifyPluginCallback = (api, opts, next) => {
	api.get("/ping", (req, reply) => {
		reply.send("pong");
	});

	api.get("/files", async () => {
		const files = await getMediaFiles();
		return files;
	});

	next();
};
