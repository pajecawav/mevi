import path from "path";
import yargs from "yargs/yargs";

export interface Config {
	port: number;
	host: string;
	root: string;
}

export const config: Config = yargs(process.argv.slice(2))
	.options({
		port: { type: "number", default: 8000 },
		host: { type: "string", default: "localhost" },
	})
	.positional("root", {
		type: "string",
		default: process.env.MEVI_ROOT ?? process.cwd(),
		coerce: value => path.resolve(value),
	})
	.parseSync();
