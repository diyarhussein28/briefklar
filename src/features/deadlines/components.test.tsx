import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AddDeadlineActions } from "./AddDeadlineActions";
import { DeadlineList } from "./DeadlineList";
import { addDeadline, listDeadlines } from "./store";

const props = {
  title: "Miete nachzahlen",
  sender: "Hausverwaltung Müller",
  date: "2030-05-15",
  description: "Geld überweisen",
  reference: null,
  amount: "120,00 €",
};

beforeEach(() => localStorage.setItem("briefklar.language", "en"));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("AddDeadlineActions", () => {
  it("shows reminder dates and saves the deadline once", () => {
    render(
      <LanguageProvider>
        <AddDeadlineActions {...props} />
      </LanguageProvider>,
    );
    expect(screen.getByText(/Reminders on:/).textContent).toContain("8 May");

    fireEvent.click(screen.getByRole("button", { name: /Save reminder/ }));

    expect(listDeadlines()).toHaveLength(1);
    expect(listDeadlines()[0]).toMatchObject(props);
    expect(screen.getByRole("status").textContent).toContain("Saved on this phone only.");
    expect(screen.getByRole("link", { name: "Show my deadlines" }).getAttribute("href")).toBe("/deadlines");
    expect(screen.queryByRole("button", { name: /Save reminder/ })).toBeNull();
  });

  it("downloads an .ics file", () => {
    const createObjectURL = vi.fn(() => "blob:test");
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    render(
      <LanguageProvider>
        <AddDeadlineActions {...props} />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Add to my calendar/ }));
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("DeadlineList", () => {
  it("renders nothing in compact mode when empty, and an empty state otherwise", () => {
    const { container } = render(
      <LanguageProvider>
        <DeadlineList compact />
      </LanguageProvider>,
    );
    expect(container.innerHTML).toBe("");
    cleanup();
    render(
      <LanguageProvider>
        <DeadlineList />
      </LanguageProvider>,
    );
    expect(screen.getByText("No deadlines saved yet")).toBeTruthy();
  });

  it("shows at most 3 open deadlines in compact mode", () => {
    for (const date of ["2030-01-01", "2030-01-02", "2030-01-03", "2030-01-04"]) addDeadline({ ...props, title: date, date });
    render(
      <LanguageProvider>
        <DeadlineList compact />
      </LanguageProvider>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Show all deadlines" })).toBeTruthy();
  });

  it("marks done and deletes after confirmation", () => {
    addDeadline(props);
    render(
      <LanguageProvider>
        <DeadlineList />
      </LanguageProvider>,
    );
    act(() => fireEvent.click(screen.getByRole("button", { name: "✓ Done" })));
    expect(listDeadlines()[0].done).toBe(true);
    expect(screen.getByText("Done", { selector: "h2" })).toBeTruthy();

    vi.spyOn(window, "confirm").mockReturnValue(false);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(listDeadlines()).toHaveLength(1);

    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(listDeadlines()).toHaveLength(0);
    expect(screen.getByText("No deadlines saved yet")).toBeTruthy();
  });
});
