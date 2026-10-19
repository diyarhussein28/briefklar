import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ConsentGate } from "./ConsentGate";
import { CONSENT_STORAGE_KEY } from "./consentStore";
import { WithdrawConsentButton } from "./WithdrawConsentButton";

function renderGate() {
  return render(
    <LanguageProvider>
      <ConsentGate>
        <p>App content</p>
      </ConsentGate>
    </LanguageProvider>,
  );
}

describe("ConsentGate", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("asks for the language, then for consent, then shows the app", () => {
    renderGate();

    expect(screen.queryByText("App content")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("heading", { level: 1, name: "Before you start" })).toBeTruthy();
    expect(screen.getByText(/Mistral AI, a company in the EU \(France\)/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Privacy policy (in German)" }).getAttribute("href")).toBe("/datenschutz");

    const continueButton = screen.getByRole("button", { name: "Continue" }) as HTMLButtonElement;
    expect(continueButton.disabled).toBe(true);

    fireEvent.click(screen.getByRole("checkbox", { name: /Art\. 9 \(2\)\(a\) GDPR/ }));
    expect(continueButton.disabled).toBe(false);

    fireEvent.click(continueButton);
    expect(screen.getByText("App content")).toBeTruthy();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).not.toBeNull();
  });

  it("skips both steps when language and consent are stored", () => {
    localStorage.setItem("briefklar.language", "ar");
    localStorage.setItem(CONSENT_STORAGE_KEY, "2026-10-19T10:00:00.000Z");
    renderGate();

    expect(screen.getByText("App content")).toBeTruthy();
  });

  it("lets the user change the language from the consent screen", () => {
    localStorage.setItem("briefklar.language", "en");
    renderGate();

    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    fireEvent.click(screen.getByRole("button", { name: "Türkçe" }));

    expect(screen.getByRole("heading", { level: 1, name: "Başlamadan önce" })).toBeTruthy();
    expect(document.documentElement.lang).toBe("tr");
  });

  it("renders a neutral loading state on the server", () => {
    const html = renderToString(
      <LanguageProvider>
        <ConsentGate>
          <p>App content</p>
        </ConsentGate>
      </LanguageProvider>,
    );

    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("App content");
  });
});

describe("WithdrawConsentButton", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("removes the stored consent", () => {
    localStorage.setItem("briefklar.language", "en");
    localStorage.setItem(CONSENT_STORAGE_KEY, "2026-10-19T10:00:00.000Z");
    render(
      <LanguageProvider>
        <WithdrawConsentButton />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Withdraw my consent" }));

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Your consent has been withdrawn.");
  });
});
