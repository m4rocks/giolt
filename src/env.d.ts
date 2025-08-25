type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {
		db: ReturnType<typeof import("./lib/db").getDb>;
	}
}
