import type { SelectOrganizations } from "@/db/schema";
import { GlobeIcon, SquareKanbanIcon, VoteIcon } from "lucide-react";

export interface HomeProps {
	org: SelectOrganizations;
}

export default function Home(props: HomeProps) {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
			<a
				className="stats shadow bg-base-300 hover:brightness-110"
				href="/dashboard#/projects">
				<div className="stat">
					<div className="stat-title">Total Projects</div>
					<div className="stat-value">0</div>
					<div className="stat-desc">See all projects</div>
				</div>
			</a>

			<div className="stats shadow bg-base-300">
				<div className="stat">
					<div className="stat-title">Unique volunteers</div>
					<div className="stat-value">0</div>
					<div className="stat-desc">Lots of people!</div>
				</div>
			</div>

			<a
				className="stats shadow bg-base-300 hover:brightness-110 col-span-2"
				href="/dashboard#/volunteer-code-of-conduct">
				<div className="stat">
					<div className="stat-title">Volunteer Code of Conduct</div>
					<div className="stat-value">Coming soon</div>
				</div>
			</a>

			<div className="flex col-span-2 lg:col-span-4 flex-col md:flex-row md:flex-wrap gap-2">
				<a
					className="btn btn-soft"
					href={`https://${props.org.slug}.giolt.org`}>
					<GlobeIcon />
					Visit organization page
				</a>
				<a className="btn btn-soft" href="/dashboard#/projects">
					<SquareKanbanIcon />
					See projects
				</a>
				<a className="btn btn-soft" href="/dashboard#/polls">
					<VoteIcon />
					See polls
				</a>
			</div>
		</div>
	);
}
