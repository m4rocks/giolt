import { actions } from "astro:actions";
import type { SelectOrganizations } from "@/db/schema";
import { THEMES } from "@/lib/data";
import { useState } from "react";
import { toast } from "sonner";

export interface DetailsProps {
	org: SelectOrganizations;
}

export default function Details(props: DetailsProps) {
	const [loading, setLoading] = useState(false);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const about = formData.get("about") as string;
		const mission = formData.get("mission") as string;
		const location = formData.get("location") as string;
		const theme = formData.get("theme") as (typeof THEMES)[number];
		const teamSectionEnabled = formData.get("teamSectionEnabled") === "on";
		const hideGioltBranding = formData.get("hideGioltBranding") === "on";

		setLoading(true);

		await actions.currentOrg
			.update({
				about,
				mission,
				location,
				theme,
				teamSectionEnabled,
				hideGioltBranding
			})
			.then((res) => {
				if (res.error) {
					return toast.error("Failed to update organization details");
				}
				toast.success("Organization details updated");
			})
			.finally(() => {
				setLoading(false);
			});

		setLoading(false);
	};

	return (
		<>
			<h1 className="font-bold">Details</h1>
			<form onSubmit={handleSubmit}>
				<fieldset className="fieldset max-w-128">
					<label htmlFor="" className="label">
						Name and Logo
					</label>
					<a className="btn" href="/dashboard#/organization-general">
						Go to General
					</a>
					<label htmlFor="" className="label mb-4">
						You can edit organization name and logo in General tab
					</label>

					<label htmlFor="about" className="label">
						About
					</label>
					<textarea
						className="textarea w-full"
						name="about"
						placeholder="About your NGO"
						disabled={loading}
						defaultValue={props.org.about || undefined}
					/>

					<label htmlFor="mission" className="label">
						Mission
					</label>
					<textarea
						className="textarea w-full"
						name="mission"
						placeholder="Write about the mission of your NGO"
						disabled={loading}
						defaultValue={props.org.mission || undefined}
					/>

					<label htmlFor="location" className="label">
						Location
					</label>
					<input
						className="input w-full"
						name="location"
						placeholder="Location of your NGO"
						disabled={loading}
						defaultValue={props.org.location || undefined}
					/>

					<label htmlFor="theme" className="label">
						Theme
					</label>
					<select
						name="theme"
						defaultValue={props.org.theme}
						className="select w-full"
						disabled={loading}>
						{THEMES.map((t) => (
							<option key={t}>{t}</option>
						))}
					</select>

					<label htmlFor="teamSectionEnabled" className="label">
						<input
							className="toggle"
							name="teamSectionEnabled"
							type="checkbox"
							disabled={loading}
							defaultChecked={props.org.teamSectionEnabled}
						/>
						Team Section enabled
					</label>

					<label htmlFor="hideGioltBranding" className="label">
						<input
							className="toggle"
							name="hideGioltBranding"
							type="checkbox"
							disabled={loading}
							defaultChecked={props.org.hideGioltBranding}
						/>
						Hide Giolt branding
					</label>

					<button
						className="btn btn-primary w-max"
						type="submit"
						disabled={loading}>
						Update
					</button>
				</fieldset>
			</form>
		</>
	);
}
