import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEY, addDeadline, listDeadlines, removeDeadline, setDone } from "./store";
import type { NewDeadline } from "./types";

const base: NewDeadline = {
  title: "Termin beim Jobcenter",
  sender: "Jobcenter Berlin",
  date: "2026-11-03",
  description: "Zum Termin gehen",
  reference: "123A456",
  amount: null,
};

afterEach(() => localStorage.clear());

describe("deadline store", () => {
  it("adds a deadline with id, createdAt and done=false and persists it", () => {
    const saved = addDeadline(base);
    expect(saved).toMatchObject({ ...base, done: false });
    expect(saved.id).toBeTruthy();
    expect(Number.isNaN(Date.parse(saved.createdAt))).toBe(false);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([saved]);
    expect(listDeadlines()).toEqual([saved]);
  });

  it("sorts by date ascending", () => {
    addDeadline({ ...base, title: "C", date: "2027-01-10" });
    addDeadline({ ...base, title: "A", date: "2026-10-20" });
    addDeadline({ ...base, title: "B", date: "2026-12-01" });
    expect(listDeadlines().map((d) => d.title)).toEqual(["A", "B", "C"]);
  });

  it("returns a stable reference until storage changes", () => {
    addDeadline(base);
    const first = listDeadlines();
    expect(listDeadlines()).toBe(first);
    addDeadline({ ...base, title: "Other" });
    expect(listDeadlines()).not.toBe(first);
  });

  it("marks done and undone", () => {
    const { id } = addDeadline(base);
    setDone(id, true);
    expect(listDeadlines()[0].done).toBe(true);
    setDone(id, false);
    expect(listDeadlines()[0].done).toBe(false);
  });

  it("removes a deadline", () => {
    const a = addDeadline({ ...base, title: "A" });
    const b = addDeadline({ ...base, title: "B" });
    removeDeadline(a.id);
    expect(listDeadlines()).toEqual([b]);
  });

  it("returns an empty list for missing or corrupt storage", () => {
    expect(listDeadlines()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(listDeadlines()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 1 }));
    expect(listDeadlines()).toEqual([]);
  });

  it("drops invalid entries but keeps valid ones", () => {
    const valid = addDeadline(base);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([valid, { id: "x", title: 5 }, null, { ...valid, date: "3.11.2026" }]));
    expect(listDeadlines()).toEqual([valid]);
  });

  it("recovers from corrupt storage on the next add", () => {
    localStorage.setItem(STORAGE_KEY, "garbage");
    const saved = addDeadline(base);
    expect(listDeadlines()).toEqual([saved]);
  });
});
