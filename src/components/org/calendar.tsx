import { DayPicker } from "react-day-picker";

interface CalendarProps {
	startDate: Date;
	endDate: Date;
}

export function Calendar(props: CalendarProps) {
	return (
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
	);
}
