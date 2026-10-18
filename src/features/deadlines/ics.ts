import { createEvent, type Alarm, type DurationObject } from "ics";
import type { Language } from "@/i18n/languages";
import { deadlineMessages, type DeadlineMessageKey } from "./messages";
import { parseIsoDate } from "./reminders";
import type { SavedDeadline } from "./types";

export type IcsDeadline = Pick<SavedDeadline, "title" | "date" | "description" | "reference" | "sender">;

/**
 * Alarm offsets relative to the start of the all-day event (00:00 on the deadline day):
 * -P6DT15H = 09:00 seven days before, -P2DT15H = 09:00 three days before, -PT15H = 09:00 the day before.
 * (A plain "-P7D" would fire at midnight; ics also renders it as the invalid "-P7DT".)
 */
const ALARMS: { trigger: DurationObject; message: DeadlineMessageKey }[] = [
  { trigger: { days: 6, hours: 15, before: true }, message: "alarm7" },
  { trigger: { days: 2, hours: 15, before: true }, message: "alarm3" },
  { trigger: { hours: 15, before: true }, message: "alarm1" },
];

function nextDay([year, month, day]: [number, number, number]): [number, number, number] {
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}

/** iCalendar text for an all-day event on the deadline date, with display reminders 7, 3 and 1 day before. */
export function createDeadlineIcs(deadline: IcsDeadline, lang: Language): string {
  const m = deadlineMessages[lang];
  const fill = (text: string) => text.replace("{title}", deadline.title);
  const start = parseIsoDate(deadline.date);

  const alarms: Alarm[] = ALARMS.map(({ trigger, message }) => ({
    action: "display",
    description: fill(m[message]),
    trigger,
  }));

  const description = [
    deadline.description,
    deadline.sender && `${m.from}: ${deadline.sender}`,
    deadline.reference && `${m.reference}: ${deadline.reference}`,
    "BriefKlar",
  ]
    .filter(Boolean)
    .join("\n");

  const { error, value } = createEvent({
    productId: "BriefKlar",
    title: fill(m.eventTitle),
    description,
    start,
    end: nextDay(start), // all-day events end on the following day (exclusive)
    transp: "TRANSPARENT",
    alarms,
  });
  if (error || !value) {
    throw new Error(`Could not create calendar file: ${error?.message ?? "empty result"}`, { cause: error });
  }
  return value;
}

/** Lets the browser save/open the .ics file (on phones this opens the calendar import). Client only. */
export function downloadIcs(filename: string, content: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke later: some mobile browsers read the blob after click() returns.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Builds and downloads the .ics for a deadline. */
export function downloadDeadlineIcs(deadline: IcsDeadline, lang: Language): void {
  downloadIcs(`briefklar-${deadline.date}.ics`, createDeadlineIcs(deadline, lang));
}
