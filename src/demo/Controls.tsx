import type { CSSProperties } from "react";
import { useDemo } from "./useDemo";
import type { Performance } from "./model";
export function Range({
  label,
  value,
  onChange,
  min = 0.001,
  max = 4,
  step = 0.001,
  unit = "mm",
  disabled = false,
  mixed = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  mixed?: boolean;
}) {
  return (
    <label className={`range-field ${disabled ? "is-disabled" : ""}`}>
      <span className="field-heading">
        <span>{label}</span>
        <span className="range-value">
          {mixed ? (
            "혼합"
          ) : (
            <>
              <input
                aria-label={`${label} 값`}
                type="number"
                min={min}
                max={max}
                step={step}
                value={Number(value.toFixed(3))}
                disabled={disabled}
                onChange={(e) => {
                  if (e.target.value !== "")
                    onChange(
                      Math.min(max, Math.max(min, Number(e.target.value))),
                    );
                }}
              />{" "}
              {unit}
            </>
          )}
        </span>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        style={
          {
            "--progress": `${((value - min) / (max - min)) * 100}%`,
          } as CSSProperties
        }
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
export function Toggle({
  label,
  value,
  onChange,
  disabled = false,
  mixed = false,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  mixed?: boolean;
}) {
  return (
    <div className="toggle-field">
      <span>
        {label}
        {mixed && <small> · 혼합</small>}
      </span>
      <button
        type="button"
        className="switch"
        role="switch"
        aria-label={label}
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange(!value)}
      >
        <span />
      </button>
    </div>
  );
}
// Shared local hook; this module deliberately also exports its related controls.
// oxlint-disable-next-line react/only-export-components
export function usePerformance() {
  const s = useDemo();
  const p = s.data.profiles[s.slot];
  const values = s.selected.map((id) => p.keys[id].performance);
  const first = values[0] || p.keys.KEY_W.performance;
  const mixed = (field: keyof Performance) =>
    values.some((v) => v[field] !== first[field]);
  const update = (patch: Partial<Performance>) =>
    s.edit((p) =>
      s.selected.forEach((id) => Object.assign(p.keys[id].performance, patch)),
    );
  return { first, mixed, update, empty: !values.length };
}
export function PerfRange({
  field,
  label,
  disabled = false,
}: {
  field: "press" | "first" | "rtPress" | "rtRelease" | "top" | "bottom";
  label: string;
  disabled?: boolean;
}) {
  const { first, mixed, update, empty } = usePerformance();
  return (
    <Range
      label={label}
      value={first[field]}
      mixed={mixed(field)}
      disabled={empty || disabled}
      onChange={(v) => update({ [field]: v })}
    />
  );
}
export function Trigger({ full = false }: { full?: boolean }) {
  const { first, mixed, update, empty } = usePerformance();
  return (
    <>
      <Toggle
        label="래피드 트리거"
        value={first.rt}
        mixed={mixed("rt")}
        disabled={empty}
        onChange={(rt) => update({ rt })}
      />
      {full && (
        <PerfRange
          field="first"
          label="최초 입력"
          disabled={!first.rt || mixed("rt")}
        />
      )}
      <div className="two-col">
        <PerfRange
          field="rtPress"
          label="누름 감도"
          disabled={!first.rt || mixed("rt")}
        />
        <PerfRange
          field="rtRelease"
          label="뗌 감도"
          disabled={!first.rt || mixed("rt")}
        />
      </div>
    </>
  );
}
