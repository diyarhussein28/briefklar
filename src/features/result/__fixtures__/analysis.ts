import type { LetterAnalysis } from "@/lib/letter";

/** A realistic Jobcenter letter, used by tests. */
export const sampleAnalysis: LetterAnalysis = {
  isLetter: true,
  transcript: [
    "Jobcenter Musterstadt",
    "Musterstraße 1, 12345 Musterstadt",
    "",
    "Musterstadt, 20.10.2026",
    "BG-Nummer: 12345BG0012345",
    "",
    "Einladung",
    "",
    "Sehr geehrte Frau Beispiel,",
    "bitte kommen Sie am 05.11.2026 um 10:00 Uhr in das Jobcenter.",
    "Bitte zahlen Sie außerdem den offenen Betrag von 120,50 € zurück.",
    "",
    "Mit freundlichen Grüßen",
  ].join("\n"),
  sender: "Jobcenter Musterstadt",
  senderType: "jobcenter",
  letterDate: "2026-10-20",
  title: "Invitation to an appointment at the Jobcenter",
  urgency: "red",
  urgencyReason: "If you miss the appointment, your benefits can be cut.",
  summary: [
    "The Jobcenter invites you to an appointment.",
    "You must go there in person.",
    "The appointment is on 5 November 2026 at 10:00.",
  ],
  deadline: {
    date: "2026-11-05",
    isEstimated: false,
    description: "Go to the appointment at the Jobcenter",
    quote: "am 05.11.2026 um 10:00 Uhr",
  },
  amount: {
    value: 120.5,
    currency: "EUR",
    description: "Money you have to pay back",
    quote: "120,50 €",
  },
  reference: {
    value: "12345BG0012345",
    label: "BG-Nummer",
    quote: "BG-Nummer: 12345BG0012345",
  },
  steps: ["Write the date in your calendar.", "Bring your ID and this letter."],
  scam: { level: "possible", reasons: ["The bank account is not a Jobcenter account."] },
  helpTopics: ["sozialberatung"],
};
