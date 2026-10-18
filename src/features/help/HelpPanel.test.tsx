import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { HelpTopic } from "@/lib/letter";
import { HelpPanel } from "./HelpPanel";

function renderPanel(topics: HelpTopic[]) {
  return render(
    <LanguageProvider>
      <HelpPanel topics={topics} />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("briefklar.language", "en");
});

afterEach(cleanup);

describe("HelpPanel", () => {
  it("renders one card per topic with a general finder link and the disclaimer", () => {
    renderPanel(["mieterverein", "schuldnerberatung"]);
    expect(screen.getByRole("heading", { name: "Mieterverein (Deutscher Mieterbund)" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Schuldnerberatung" })).toBeTruthy();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("https://mieterbund.de/mieterverein-vor-ort/");
    expect(links[0].getAttribute("target")).toBe("_blank");
    expect(links[0].getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByText("BriefKlar does not give legal advice. These offices can check your case.")).toBeTruthy();
  });

  it("falls back to Sozialberatung and Verbraucherzentrale when there are no topics", () => {
    renderPanel([]);
    expect(screen.getByRole("heading", { name: "Allgemeine Sozialberatung (Caritas)" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Verbraucherzentrale" })).toBeTruthy();
  });

  it("uses a valid postcode in the links and remembers it", () => {
    renderPanel(["schuldnerberatung", "verbraucherzentrale"]);
    fireEvent.change(screen.getByLabelText("Your postcode (PLZ)"), { target: { value: "80331" } });
    const [schulden, verbraucher] = screen.getAllByRole("link");
    expect(schulden.getAttribute("href")).toBe("https://www.meine-schulden.de/hilfe-finden/stellensuche?plz=80331");
    expect(verbraucher.getAttribute("href")).toBe("https://www.verbraucherzentrale.bayern/beratung");
    expect(localStorage.getItem("briefklar.plz")).toBe("80331");
  });

  it("restores the remembered postcode", () => {
    localStorage.setItem("briefklar.plz", "10115");
    renderPanel(["mieterverein"]);
    expect((screen.getByLabelText("Your postcode (PLZ)") as HTMLInputElement).value).toBe("10115");
    expect(screen.getByRole("link").getAttribute("href")).toBe("https://mieterbund.de/mieterverein-vor-ort/?search=10115");
  });

  it("shows an error for an invalid postcode and keeps the general links", () => {
    renderPanel(["mieterverein"]);
    const input = screen.getByLabelText("Your postcode (PLZ)");
    fireEvent.change(input, { target: { value: "123" } });
    expect(screen.queryByText("Please enter 5 digits, for example 10115.")).toBeNull();
    fireEvent.blur(input);
    expect(screen.getByText("Please enter 5 digits, for example 10115.")).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("href")).toBe("https://mieterbund.de/mieterverein-vor-ort/");
    expect(localStorage.getItem("briefklar.plz")).toBeNull();
  });
});
