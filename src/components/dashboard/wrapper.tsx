import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "astro:env/client";
import type { SelectOrganizations } from "@/db/schema";
import { clerkTheme } from "@/lib/clerk";
import {
	ClerkLoaded,
	ClerkProvider,
	OrganizationProfile,
} from "@clerk/clerk-react";
import {
	ArrowLeftRightIcon,
	HeartHandshakeIcon,
	HomeIcon,
	SettingsIcon,
	SquareKanbanIcon,
	VoteIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import ComingSoon from "./coming-soon";
import Home from "./home";
import Settings from "./settings";

export interface DashboardWrapperProps {
	org: SelectOrganizations;
}

export default function DashboardWrapper(props: DashboardWrapperProps) {
	return (
		<ClerkProvider
			publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
			appearance={clerkTheme}>
			<OrgProfileComp {...props} />
		</ClerkProvider>
	);
}

const OrgProfileComp = (props: DashboardWrapperProps) => {
	// This hack is required only here as we are doing some heavy customization
	// of OrganizationProfile using @clerk/clerk-react instead of @clerk/astro/react
	// To prevent timing mismatch we are forcing the components to render only when the DOM
	// is explicitly ready to.
	const [domReady, setDomReady] = useState(false);
	useEffect(() => {
		// Avoid race: only mount after DOM is fully ready
		setDomReady(true);
	}, []);

	if (!domReady) return null;
	return (
		<ClerkLoaded>
			<OrganizationProfile
				afterLeaveOrganizationUrl="/select"
				routing="hash">
				<OrganizationProfile.Page
					label="Home"
					url="/"
					labelIcon={<HomeIcon className="size-4" />}>
					<Home org={props.org} />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Projects"
					url="/projects"
					labelIcon={<SquareKanbanIcon className="size-4" />}>
					<ComingSoon />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Polls"
					url="/polls"
					labelIcon={<VoteIcon className="size-4" />}>
					<ComingSoon />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Settings"
					url="/settings"
					labelIcon={<SettingsIcon className="size-4" />}>
					<Settings org={props.org} />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Volunteer Code of Conduct"
					url="/volunteer-code-of-conduct"
					labelIcon={<HeartHandshakeIcon className="size-4" />}>
					<ComingSoon />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page label="general" />
				<OrganizationProfile.Page label="members" />
				<OrganizationProfile.Link
					label="Switch organization"
					url="/select"
					labelIcon={<ArrowLeftRightIcon className="size-4" />}
				/>
			</OrganizationProfile>
		</ClerkLoaded>
	);
};
