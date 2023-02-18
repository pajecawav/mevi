#!/usr/bin/env node

import FastifyStatic from "@fastify/static";
import Fastify from "fastify";
import path from "path";
import { apiRouter } from "./api";
import { config } from "./config";

const fastify = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				messageFormat: "{msg} [id={reqId} {req.method} {req.url}] {res.statusCode}",
				ignore: "pid,hostname,reqId,responseTime,req,res",
			},
		},
	},
});

// api router
fastify.register(apiRouter, { prefix: "/api" });

// generated UI files
fastify.register(FastifyStatic, {
	root: path.join(__dirname, "dist"),
	prefix: "/",
});

// media files
fastify.register(FastifyStatic, {
	root: config.root,
	prefix: "/media/",
	maxAge: 60 * 60 * 1000,
	decorateReply: false,
});

async function main() {
	try {
		await fastify.listen({ port: config.port, host: config.host });
	} catch (e) {
		fastify.log.error(e);
		process.exit(1);
	}
}

async function close() {
	await fastify.close();
	process.exit(0);
}

process.on("SIGINT", close);
process.on("SIGTERM", close);

main();
