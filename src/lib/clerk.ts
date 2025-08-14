import type { Appearance } from "@clerk/types";

export const clerkTheme = {
	variables: {
		colorPrimary: "var(--color-primary)",
		colorPrimaryForeground: "var(--color-primary-content)",
		colorTextSecondary: "var(--color-secondary)",
		colorNeutral: "var(--color-secondary)",
		fontFamily: "var(--font-sans)",
		colorBackground: "var(--color-base-100)",
		colorForeground: "var(--color-base-content)",
		colorInputBackground: "var(--color-base-200)",
		colorInputForeground: "var(--color-base-content)",
	},
} satisfies Appearance;
