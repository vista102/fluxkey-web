import assert from "node:assert/strict";
import {
  createData,
  validateData,
  rows,
  keys,
  switchModels,
} from "../src/demo/model.ts";
assert.equal(keys.length, 61);
assert.equal(new Set(keys.map((k) => k.id)).size, 61);
assert.ok(rows.every((r) => r.reduce((n, k) => n + k.u, 0) === 15));
assert.equal(switchModels.length, 76);
const original = createData();
assert.ok(validateData(original));
assert.ok(validateData(JSON.parse(JSON.stringify(original))));
for (const damage of [
  (d) => {
    d.version = 87;
  },
  (d) => {
    delete d.profiles[0].keys.KEY_A;
  },
  (d) => {
    d.profiles[0].macros[0].events = [null];
  },
  (d) => {
    d.profiles[0].keys.KEY_A.performance.press = Infinity;
  },
  (d) => {
    d.profiles[0].keys.KEY_A.advanced = {};
  },
  (d) => {
    d.profiles[0].lights[0].color = "invalid";
  },
]) {
  const d = structuredClone(original);
  damage(d);
  assert.equal(validateData(d), false);
}
console.log(
  "PASS: 61 unique keys, 15U rows, 76 switches, valid JSON roundtrip and malformed-data rejection.",
);
