import { ClerkProvider, OrganizationProfile } from "@clerk/clerk-react";
import { AlignLeftIcon, ArrowLeftRightIcon, HeartHandshakeIcon, HomeIcon, SquareKanbanIcon, VoteIcon } from "lucide-react";
import Details from "./details";
import type { SelectOrganizations } from "@/db/schema";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "astro:env/client";
import { clerkTheme } from "@/lib/clerk";
import Home from "./home";
import ComingSoon from "./coming-soon";

export interface DashboardWrapperProps {
	org: SelectOrganizations;
}

export default function DashboardWrapper(props: DashboardWrapperProps) {
	return (
		<ClerkProvider
			publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
			appearance={clerkTheme}
		>
			<OrganizationProfile
				afterLeaveOrganizationUrl="/select"
				routing="hash"
			>
				<OrganizationProfile.Page
					label="Home"
					url="/"
					labelIcon={<HomeIcon className="size-4"/>}
				>
					<Home
						org={props.org}
					/>
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Projects"
					url="/projects"
					labelIcon={<SquareKanbanIcon className="size-4"/>}
				>
					<ComingSoon />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Polls"
					url="/polls"
					labelIcon={<VoteIcon className="size-4"/>}
				>
					<ComingSoon />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Details"
					url="/details"
					labelIcon={<AlignLeftIcon className="size-4"/>}
				>
					<Details
						org={props.org}
					/>
				</OrganizationProfile.Page>
				<OrganizationProfile.Page
					label="Volunteer Code of Conduct"
					url="/volunteer-code-of-conduct"
					labelIcon={<HeartHandshakeIcon className="size-4"/>}
				>
					<ComingSoon />
				</OrganizationProfile.Page>
				<OrganizationProfile.Page label="general" />
				<OrganizationProfile.Page label="members" />
				<OrganizationProfile.Link
					label="Switch organization"
					url="/select"
					labelIcon={<ArrowLeftRightIcon className="size-4" />}
				>
				</OrganizationProfile.Link>
			</OrganizationProfile>
		</ClerkProvider>
	)
}
