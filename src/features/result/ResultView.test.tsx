import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { LetterAnalysis } from "@/lib/letter";
import { sampleAnalysis } from "./__fixtures__/analysis";
import { ResultView } from "./ResultView";

const addDeadlineProps = vi.fn();

vi.mock("@/features/deadlines/AddDeadlineActions", () => ({
  AddDeadlineActions: (props: { date: string }) => {
    addDeadlineProps(props);
    return <div data-testid="add-deadline">{props.date}</div>;
  },
}));

vi.mock("@/features/help/HelpPanel", () => ({
  HelpPanel: ({ topics }: { topics: string[] }) => <div data-testid="help">{topics.join(",")}</div>,
}));

function renderResult(analysis: LetterAnalysis = sampleAnalysis, onReset = vi.fn()) {
  render(
    <LanguageProvider>
      <ResultView analysis={analysis} onReset={onReset} />
    </LanguageProvider>,
  );
  return { onReset };
}

beforeEach(() => {
  localStorage.setItem("briefklar.language", "en");
  addDeadlineProps.mockClear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("ResultView", () => {
  it("shows urgency, title, summary and the AI disclosure", () => {
    renderResult();
    expect(screen.getByText("Act now")).toBeTruthy();
    expect(screen.getByText(sampleAnalysis.urgencyReason)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: sampleAnalysis.title })).toBeTruthy();
    for (const sentence of sampleAnalysis.summary) expect(screen.getByText(sentence)).toBeTruthy();
    expect(screen.getByText(/Created by AI \(Mistral AI\)/)).toBeTruthy();
  });

  it("hides the read-aloud button without speech synthesis", () => {
    renderResult();
    expect(screen.queryByRole("button", { name: "Read aloud" })).toBeNull();
  });

  it("shows key facts with show-in-letter buttons for found quotes", () => {
    renderResult();
    expect(screen.getByText("Thursday 5 November 2026", { exact: false, normalizer: (s) => s.replace(",", "") })).toBeTruthy();
    expect(screen.getByText("€120.50")).toBeTruthy();
    expect(screen.getAllByText("12345BG0012345").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Show in letter" })).toHaveLength(4);
  });

  it("highlights the quotes in the original letter", () => {
    const { container } = render(
      <LanguageProvider>
        <ResultView analysis={sampleAnalysis} onReset={vi.fn()} />
      </LanguageProvider>,
    );
    const marks = Array.from(container.querySelectorAll("mark")).map((mark) => mark.textContent);
    expect(marks).toEqual(["Jobcenter Musterstadt", "BG-Nummer: 12345BG0012345", "am 05.11.2026 um 10:00 Uhr", "120,50 €"]);
    const transcript = container.querySelector('[lang="de"][dir="ltr"].whitespace-pre-wrap');
    expect(transcript?.textContent).toBe(sampleAnalysis.transcript);
  });

  it("opens the original letter when a fact is shown in the letter", () => {
    const { container } = render(
      <LanguageProvider>
        <ResultView analysis={sampleAnalysis} onReset={vi.fn()} />
      </LanguageProvider>,
    );
    const details = container.querySelector("details")!;
    expect(details.open).toBe(false);
    fireEvent.click(screen.getAllByRole("button", { name: "Show in letter" })[0]);
    expect(details.open).toBe(true);
  });

  it("passes the confirmed (edited) date to AddDeadlineActions", () => {
    renderResult();
    expect(screen.getByTestId("add-deadline").textContent).toBe("2026-11-05");
    fireEvent.change(screen.getByLabelText("Deadline date"), { target: { value: "2026-11-12" } });
    expect(screen.getByTestId("add-deadline").textContent).toBe("2026-11-12");
    expect(addDeadlineProps).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: sampleAnalysis.title,
        sender: "Jobcenter Musterstadt",
        date: "2026-11-12",
        reference: "12345BG0012345",
        amount: expect.stringMatching(/^120,50\s€$/),
      }),
    );
  });

  it("offers a manual date when no deadline was found", () => {
    renderResult({ ...sampleAnalysis, deadline: null });
    expect(screen.getByText("No deadline found in this letter.")).toBeTruthy();
    expect(screen.queryByTestId("add-deadline")).toBeNull();
    fireEvent.change(screen.getByLabelText("Enter a date (optional)"), { target: { value: "2026-12-01" } });
    expect(screen.getByTestId("add-deadline").textContent).toBe("2026-12-01");
  });

  it("shows the scam warning with reasons, prominently when likely", () => {
    renderResult({ ...sampleAnalysis, scam: { level: "likely", reasons: ["Unknown bank account"] } });
    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("Warning: this letter is probably a scam")).toBeTruthy();
    expect(within(alert).getByText("Unknown bank account")).toBeTruthy();
  });

  it("hides the scam warning when there is no risk", () => {
    renderResult({ ...sampleAnalysis, scam: { level: "none", reasons: [] } });
    expect(screen.queryByText(/scam|fake letter/)).toBeNull();
  });

  it("renders steps, help topics and the reset button", () => {
    const { onReset } = renderResult();
    expect(screen.getByRole("heading", { name: "What can I do now?" })).toBeTruthy();
    for (const step of sampleAnalysis.steps) expect(screen.getByText(step)).toBeTruthy();
    expect(screen.getByTestId("help").textContent).toBe("sozialberatung");
    fireEvent.click(screen.getByRole("button", { name: "Scan another letter" }));
    expect(onReset).toHaveBeenCalled();
  });

  it("uses the selected language", () => {
    localStorage.setItem("briefklar.language", "ar");
    renderResult();
    expect(screen.getByText("تصرّف الآن")).toBeTruthy();
  });
});
