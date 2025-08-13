import type { SelectOrganizations } from "@/db/schema";
import { actions } from "astro:actions";
import { useState } from "react";
import { toast } from "sonner";

export interface DetailsProps {
	org: SelectOrganizations
}

export default function Details(props: DetailsProps) {
	const [loading, setLoading] = useState(false);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const about = formData.get("about") as string;
		const mission = formData.get("mission") as string;
		const location = formData.get("location") as string;

		setLoading(true);

		await actions.orgs.updateDetails({
			orgId: props.org.id,
			about,
			mission,
			location
		})
			.then(() => {
				toast.success("Organization details updated")
			})
			.catch(() => {
				toast.error("Failed to update organization details")
			})
			.finally(() => {
				setLoading(false)
			})

		setLoading(false);
	}

	return (
		<>
			<h1
				className="font-bold"
			>
				Details
			</h1>
			<form
				onSubmit={handleSubmit}
			>
				<fieldset className="fieldset">
					<label className="label">About</label>
					<textarea
						className="textarea"
						name="about"
						placeholder="About your NGO"
						disabled={loading}
						defaultValue={props.org.about || undefined}
					/>

					<label className="label">Mission</label>
					<textarea
						className="textarea"
						name="mission"
						placeholder="Write about the mission of your NGO"
						disabled={loading}
						defaultValue={props.org.mission || undefined}
					/>

					<label className="label">Location</label>
					<input
						className="input"
						name="location"
						placeholder="Location of your NGO"
						disabled={loading}
						defaultValue={props.org.location || undefined}
					/>

					<button
						className="btn btn-primary w-[clamp(3rem,20rem,100%)]"
						type="submit"
						disabled={loading}
					>
						Update
					</button>
				</fieldset>
			</form>
		</>
	)
}
