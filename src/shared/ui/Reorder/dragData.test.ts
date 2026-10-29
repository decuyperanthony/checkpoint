import { describe, expect, it } from "vitest";

import { toMove } from "./dragData";

const station = (id: string, containerId: string, index = 0) => ({
  id,
  data: { current: { kind: "station", containerId, label: id, sortable: { index } } },
});
const line = (id: string, index = 0) => ({
  id,
  data: { current: { kind: "line", containerId: "lines", label: id, sortable: { index } } },
});
const end = (containerId: string, count: number) => ({
  id: `end-${containerId}`,
  data: { current: { kind: "end", containerId, count } },
});

describe("toMove", () => {
  it("moves a station onto another station of its list", () => {
    expect(toMove({ active: station("milk", "A"), over: station("bread", "A", 2) })).toEqual({
      id: "milk",
      kind: "station",
      containerId: "A",
      index: 2,
    });
  });

  it("moves a station onto a station of another list", () => {
    expect(toMove({ active: station("milk", "A"), over: station("report", "B", 1) })).toEqual({
      id: "milk",
      kind: "station",
      containerId: "B",
      index: 1,
    });
  });

  it("moves a station to the end of a list, empty or not", () => {
    expect(toMove({ active: station("milk", "A"), over: end("B", 3) })).toEqual({
      id: "milk",
      kind: "station",
      containerId: "B",
      index: 3,
    });
  });

  it("moves a line among the lines", () => {
    expect(toMove({ active: line("backlog"), over: line("sprint", 1) })).toEqual({
      id: "backlog",
      kind: "line",
      containerId: "lines",
      index: 1,
    });
  });

  it("asks for nothing when dropped nowhere or on itself", () => {
    expect(toMove({ active: station("milk", "A"), over: null })).toBeUndefined();
    expect(toMove({ active: station("milk", "A"), over: station("milk", "A") })).toBeUndefined();
  });

  it("never puts a line among stations, nor a station among lines", () => {
    expect(toMove({ active: line("backlog"), over: station("milk", "A") })).toBeUndefined();
    expect(toMove({ active: line("backlog"), over: end("A", 1) })).toBeUndefined();
    expect(toMove({ active: station("milk", "A"), over: line("backlog") })).toBeUndefined();
  });
});
