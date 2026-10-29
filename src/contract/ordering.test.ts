import { describe, expect, it } from "vitest";

import { placeAt } from "./ordering";

const list = ["a", "b", "c", "d"];

describe("placeAt", () => {
  it("moves something earlier or later in the list", () => {
    expect(placeAt({ list, item: "d", index: 1 })).toEqual(["a", "d", "b", "c"]);
    expect(placeAt({ list, item: "a", index: 2 })).toEqual(["b", "c", "a", "d"]);
  });

  it("adds what the list does not hold yet", () => {
    expect(placeAt({ list, item: "x", index: 1 })).toEqual(["a", "x", "b", "c", "d"]);
  });

  it("clamps the index to the list", () => {
    expect(placeAt({ list, item: "a", index: 99 })).toEqual(["b", "c", "d", "a"]);
    expect(placeAt({ list, item: "d", index: -3 })).toEqual(["d", "a", "b", "c"]);
  });

  it("leaves the list it was given alone", () => {
    placeAt({ list, item: "d", index: 0 });

    expect(list).toEqual(["a", "b", "c", "d"]);
  });
});
