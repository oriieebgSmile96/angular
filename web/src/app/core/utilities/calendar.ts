import { ConsultationBooking } from "@bq/core/models/consultation.model";

const CONSULTATION_MINUTES = 60;

/** The wording written into the invite, already resolved to the client's language. */
export interface InviteCopy {
	readonly location: string;
	readonly formatLabel: string;
	readonly projectTypeLabel: string;
}

/**
 * Builds an iCalendar file for a confirmed consultation and triggers a download.
 *
 * Generated in the browser so "Add to calendar" works with no backend. The
 * caller resolves the copy, because an `.ics` file is a snapshot: it keeps
 * whichever language the client was reading when they saved it.
 */
export function downloadConsultationInvite(booking: ConsultationBooking, copy: InviteCopy): void {
	const start = booking.scheduledAt;
	const end = new Date(start.getTime() + CONSULTATION_MINUTES * 60_000);

	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Bareeq Al-Aeeq//Consultation//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"BEGIN:VEVENT",
		`UID:${booking.reference}@bareeqalaeeq.ae`,
		`DTSTAMP:${toIcsDate(new Date())}`,
		`DTSTART:${toIcsDate(start)}`,
		`DTEND:${toIcsDate(end)}`,
		escapeLine(`SUMMARY:Bareeq Al-Aeeq consultation (${copy.formatLabel})`),
		escapeLine(`LOCATION:${copy.location}`),
		escapeLine(
			`DESCRIPTION:Reference ${booking.reference}. Project: ${copy.projectTypeLabel}. Contact: ${booking.email}`,
		),
		"END:VEVENT",
		"END:VCALENDAR",
	];

	const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");

	anchor.href = url;
	anchor.download = `${booking.reference}.ics`;
	anchor.click();

	URL.revokeObjectURL(url);
}

function toIcsDate(date: Date): string {
	return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function escapeLine(line: string): string {
	return line.replace(/([,;])/g, "\\$1");
}
