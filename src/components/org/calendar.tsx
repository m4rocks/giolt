import { DayPicker } from "react-day-picker";
import { ics, type CalendarEvent } from "calendar-link";
import { getTenantUrl } from "@/lib/tenant";
import { CalendarIcon } from "lucide-react";

interface CalendarProps {
	title: string;
	location: string | null;
	orgName: string;
	orgEmail: string | null;
	orgSlug: string;
	description: string | null;
	startDate: Date;
	endDate: Date;
}

export function Calendar(props: CalendarProps) {
	const event: CalendarEvent = {
		title: props.title,
		allDay: true,
		organizer: {
			name: props.orgName,
			email: props.orgEmail ?? ""
		},
		busy: false,
		location: props.location ?? undefined,
		start: new Date(props.startDate).toDateString(),
		end: new Date(props.endDate).toDateString(),
		description: props.description ?? undefined,
		status: "CONFIRMED",
		url: `${getTenantUrl(props.orgSlug)}/app`
	}
	const calLink = ics(event)

	return (
		<div
			className="flex flex-col gap-2"
		>
			<a
				href={calLink}
				className="btn"
			>
				<CalendarIcon/>
				Add to calendar
			</a>
			<DayPicker
				className="react-day-picker"
				weekStartsOn={1}
				showOutsideDays
				disableNavigation
				hideNavigation
				mode="range"
				selected={{
					from: props.startDate,
					to: props.endDate,
				}}
				month={props.startDate}
				classNames={{
					range_middle: "text-base-content *:rounded-none!",
				}}
				// hidden={{
				// 	after: props.endDate,
				// 	before: props.startDate
				// }}
			/>
		</div>
	);
}
