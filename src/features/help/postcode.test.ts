import { describe, expect, it } from "vitest";
import { bundeslandForPostcode, isValidPostcode } from "./postcode";

describe("isValidPostcode", () => {
  it("accepts five-digit German postcodes", () => {
    for (const plz of ["01001", "10115", "80331", "99998"]) expect(isValidPostcode(plz)).toBe(true);
  });

  it("rejects everything else", () => {
    for (const plz of ["", "1011", "101155", "00000", "01000", "99999", "1011a", " 10115", "10 115"]) {
      expect(isValidPostcode(plz)).toBe(false);
    }
  });
});

describe("bundeslandForPostcode", () => {
  it.each([
    ["10115", "BE"],
    ["80331", "BY"],
    ["50667", "NW"],
    ["20095", "HH"],
    ["01067", "SN"],
    ["70173", "BW"],
    ["28195", "HB"],
    ["99084", "TH"],
    ["14467", "BB"],
    ["14195", "BE"],
    ["39104", "ST"],
    ["19053", "MV"],
    ["24103", "SH"],
    ["30159", "NI"],
    ["60311", "HE"],
    ["55116", "RP"],
    ["66111", "SL"],
    ["27568", "HB"],
    ["22844", "SH"],
    ["21073", "HH"],
    ["63739", "BY"],
    ["89231", "BY"],
    ["89073", "BW"],
    ["68519", "HE"],
    ["01968", "BB"],
    ["04600", "TH"],
  ])("%s → %s", (plz, state) => {
    expect(bundeslandForPostcode(plz)).toBe(state);
  });

  it("returns null for invalid or unassigned postcodes", () => {
    expect(bundeslandForPostcode("abc")).toBeNull();
    expect(bundeslandForPostcode("05000")).toBeNull();
  });
});
