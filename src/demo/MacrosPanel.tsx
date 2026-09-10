import { useRef, useState } from "react";
import { useDemo } from "./useDemo";
import type { MacroEvent } from "./model";
import { Toggle } from "./Controls";
const modes = [
  "클릭 · 지정 횟수 실행 / 재클릭 무시",
  "클릭 · 지정 횟수 실행 / 재클릭 재시작",
  "클릭 · 지정 횟수 실행 / 재클릭 즉시 정지",
  "클릭 · 지정 횟수 실행 / 현재 회차 후 정지",
  "누르는 동안 반복 / 떼면 즉시 정지",
  "누르는 동안 반복 / 떼면 현재 회차 후 정지",
];
export function MacrosPanel() {
  const s = useDemo();
  const [slot, setSlot] = useState(0);
  const [recording, setRecording] = useState(false);
  const [eventKey, setEventKey] = useState("KeyA");
  const recordRef = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const held = useRef(new Set<string>());
  const macro = s.data.profiles[s.slot].macros[slot];
  const edit = (patch: Partial<typeof macro>) =>
    s.edit((p) => Object.assign(p.macros[slot], patch));
  function record(type: "down" | "up", code: string, repeat: boolean) {
    if (!recording || repeat) return;
    if (type === "up" && !held.current.has(code)) return;
    if (type === "down") held.current.add(code);
    else held.current.delete(code);
    const now = performance.now();
    const events: MacroEvent[] = [];
    if (last.current)
      events.push({
        type: "delay",
        key: "",
        ms: macro.useDelay
          ? macro.defaultDelay
          : Math.min(60000, Math.round(now - last.current)),
      });
    events.push({ type, key: code, ms: 0 });
    last.current = now;
    edit({ events: [...macro.events, ...events].slice(0, 2000) });
  }
  function stop() {
    if (held.current.size)
      edit({
        events: [
          ...macro.events,
          ...[...held.current].map((key) => ({
            type: "up" as const,
            key,
            ms: 0,
          })),
        ].slice(0, 2000),
      });
    held.current.clear();
    setRecording(false);
  }
  return (
    <section className="settings-panel">
      <div className="macro-slots">
        {Array.from({ length: 16 }, (_, i) => (
          <button
            disabled={recording}
            className={slot === i ? "active" : ""}
            key={i}
            onClick={() => setSlot(i)}
          >
            M{i}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="section-heading">
          <h3>MACRO {slot}</h3>
          <span>{macro.events.length} events</span>
        </div>
        <label className="stack">
          반복 / 정지 방식
          <select
            value={macro.mode}
            onChange={(e) => edit({ mode: Number(e.target.value) })}
          >
            {modes.map((m, i) => (
              <option value={i} key={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <div className="three-col">
          <label className="stack">
            반복 횟수
            <input
              type="number"
              min={1}
              max={999}
              disabled={macro.mode >= 4}
              value={macro.repeats}
              onChange={(e) =>
                edit({
                  repeats: Math.max(1, Math.min(999, Number(e.target.value))),
                })
              }
            />
          </label>
          <Toggle
            label="기본 지연시간"
            value={macro.useDelay}
            onChange={(useDelay) => edit({ useDelay })}
          />
          <label className="stack">
            지연 (ms)
            <input
              type="number"
              min={0}
              max={5000}
              disabled={!macro.useDelay}
              value={macro.defaultDelay}
              onChange={(e) =>
                edit({
                  defaultDelay: Math.min(
                    5000,
                    Math.max(0, Number(e.target.value)),
                  ),
                })
              }
            />
          </label>
        </div>
        <div
          className="record-area"
          ref={recordRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!recording) return;
            e.preventDefault();
            if (e.code === "Escape") {
              stop();
              return;
            }
            record("down", e.code, e.repeat);
          }}
          onKeyUp={(e) => {
            if (recording) {
              e.preventDefault();
              record("up", e.code, false);
            }
          }}
          onBlur={() => {
            if (recording) stop();
          }}
        >
          <b>{recording ? "● 기록 중 · 종료는 Esc" : "키보드 이벤트 기록"}</b>
          <p>
            이 영역에 포커스가 있을 때만 기록합니다. 비밀번호 등 민감한 정보는
            입력하지 마세요.
          </p>
        </div>
        <div className="button-row">
          <button
            onClick={() => {
              if (recording) stop();
              else {
                held.current.clear();
                last.current = 0;
                setRecording(true);
                recordRef.current?.focus();
              }
            }}
          >
            {recording ? "기록 종료" : "기록 시작"}
          </button>
          <input
            aria-label="추가할 키 코드"
            value={eventKey}
            onChange={(e) => setEventKey(e.target.value)}
          />
          <button
            disabled={recording || !eventKey || macro.events.length > 1997}
            onClick={() =>
              edit({
                events: [
                  ...macro.events,
                  { type: "down", key: eventKey, ms: 0 },
                  { type: "delay", key: "", ms: macro.defaultDelay },
                  { type: "up", key: eventKey, ms: 0 },
                ],
              })
            }
          >
            키 이벤트 추가
          </button>
          <button disabled={recording} onClick={() => edit({ events: [] })}>
            모두 지우기
          </button>
        </div>
        <div className="event-list">
          {macro.events.length ? (
            macro.events.map((e, i) => (
              <div key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>
                  {e.type === "delay"
                    ? "대기"
                    : e.type === "down"
                      ? "누름"
                      : "뗌"}
                </b>
                {e.type === "delay" ? (
                  <input
                    aria-label={`이벤트 ${i + 1} 지연`}
                    type="number"
                    min={0}
                    max={60000}
                    value={e.ms}
                    onChange={(ev) =>
                      edit({
                        events: macro.events.map((item, j) =>
                          j === i
                            ? {
                                ...item,
                                ms: Math.max(
                                  0,
                                  Math.min(60000, Number(ev.target.value)),
                                ),
                              }
                            : item,
                        ),
                      })
                    }
                  />
                ) : (
                  <span>{e.key}</span>
                )}
                <button
                  aria-label={`이벤트 ${i + 1} 삭제`}
                  disabled={recording}
                  onClick={() =>
                    edit({ events: macro.events.filter((_, j) => i !== j) })
                  }
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="empty">기록하거나 키 이벤트를 추가하세요.</p>
          )}
        </div>
        <p className="hint">
          매핑 → 매크로에서 M{slot}을 키에 할당할 수 있습니다. 실제 자동 입력은
          실행하지 않습니다.
        </p>
      </div>
    </section>
  );
}
