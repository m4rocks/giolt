import { POLAR_ACCESS_TOKEN, VERCEL_ENV } from "astro:env/server";
import { Polar } from "@polar-sh/sdk";

export const polarServer =
	VERCEL_ENV === "production" ? "production" : "sandbox";

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: polarServer,
});
