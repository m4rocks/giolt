import { POLAR_ACCESS_TOKEN } from "astro:env/server";
import { Polar } from "@polar-sh/sdk";

export const polarServer =
	import.meta.env.PROD ? "production" : "sandbox";

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: polarServer,
});
