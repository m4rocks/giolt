import type { SelectOrganizations } from "@/db/schema";

export interface HomeProps {
	org: SelectOrganizations;
}

export default function Home(props: HomeProps) {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
			<a
				className="stats shadow bg-base-300 hover:brightness-110"
				href="/dashboard#/projects"
			>
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
				href="/dashboard#/volunteer-code-of-conduct"
			>
				<div className="stat">
					<div className="stat-title">Volunteer Code of Conduct</div>
					<div className="stat-value">
						Coming soon
					</div>
				</div>
			</a>
		</div>
	)
}
