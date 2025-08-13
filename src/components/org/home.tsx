import type { SelectOrganizations } from "@/db/schema";

interface Props {
	organization: SelectOrganizations
}

export default function Home({ organization }: Props) {
	return (
		<div>
			<img
				src={organization.logoUrl || ""}
				alt={organization.name}
			/>
		</div>
	)
}
