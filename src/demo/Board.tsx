import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useDemo } from "./useDemo";
import { rows, keys } from "./model";
export function Board({ section }: { section: string }) {
  const s = useDemo();
  const profile = s.data.profiles[s.slot];
  const drag = useRef({
    active: false,
    visited: new Set<string>(),
    remove: false,
  });
  const anchor = useRef("KEY_W");
  useEffect(() => {
    const stop = () => {
      drag.current.active = false;
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);
  function choose(id: string, shift = false) {
    const selected = useDemo.getState().selected;
    if (shift) {
      const a = keys.findIndex((k) => k.id === anchor.current),
        b = keys.findIndex((k) => k.id === id);
      s.select([
        ...new Set([
          ...selected,
          ...keys.slice(Math.min(a, b), Math.max(a, b) + 1).map((k) => k.id),
        ]),
      ]);
      return;
    }
    anchor.current = id;
    s.select(
      selected.includes(id)
        ? selected.filter((k) => k !== id)
        : [...selected, id],
    );
  }
  return (
    <section className="board-section" aria-label="60% 키보드">
      <div className="selection-toolbar">
        <span>
          <b>{s.selected.length}</b>개 키 선택{" "}
          <span className="selection-hint">
            · 클릭 / 드래그 / Shift 범위 추가
          </span>
        </span>
        <div className="button-row">
          <button
            onClick={() => s.select(["KEY_W", "KEY_A", "KEY_S", "KEY_D"])}
          >
            WASD
          </button>
          <button onClick={() => s.select(keys.map((k) => k.id))}>전체</button>
          <button
            onClick={() =>
              s.select(
                keys.filter((k) => !s.selected.includes(k.id)).map((k) => k.id),
              )
            }
          >
            반전
          </button>
          <button onClick={() => s.select([])}>해제</button>
        </div>
      </div>
      <div className="keyboard-board">
        {rows.map((row, i) => (
          <div className="key-row" key={i}>
            {row.map((k) => (
              <button
                className={`key ${s.selected.includes(k.id) ? "selected" : ""}`}
                key={k.id}
                data-physical-key={k.id}
                aria-label={`${k.label} 키`}
                aria-pressed={s.selected.includes(k.id)}
                title={`${k.label} · ${profile.keys[k.id].mappings[s.layer]}`}
                style={
                  {
                    "--u": k.u,
                    "--key-light":
                      section === "rgb" && profile.lights[0].top
                        ? profile.keys[k.id].color || profile.lights[0].color
                        : "transparent",
                  } as CSSProperties
                }
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  e.currentTarget.focus();
                  drag.current = {
                    active: !e.shiftKey,
                    visited: new Set([k.id]),
                    remove: s.selected.includes(k.id),
                  };
                  choose(k.id, e.shiftKey);
                }}
                onPointerEnter={(e) => {
                  if (
                    !drag.current.active ||
                    !(e.buttons & 1) ||
                    drag.current.visited.has(k.id)
                  )
                    return;
                  drag.current.visited.add(k.id);
                  const current = useDemo.getState().selected;
                  s.select(
                    drag.current.remove
                      ? current.filter((id) => id !== k.id)
                      : [...new Set([...current, k.id])],
                  );
                }}
                onClick={(e) => {
                  if (e.detail === 0) choose(k.id, e.shiftKey);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const action = e.dataTransfer.getData("text/fluxkey-action");
                  if (action)
                    s.edit((p) => {
                      p.keys[k.id].mappings[s.layer] =
                        action === "기본값 복원" ? k.label : action;
                    });
                }}
              >
                <span>
                  {section === "keymap"
                    ? profile.keys[k.id].mappings[s.layer]
                    : k.label}
                </span>
                {section === "actuation" && (
                  <span
                    className="key-settings"
                    aria-label={
                      profile.keys[k.id].performance.rt
                        ? `RT 누름 ${profile.keys[k.id].performance.rtPress} mm, 뗌 ${profile.keys[k.id].performance.rtRelease} mm`
                        : `입력 ${profile.keys[k.id].performance.press} mm`
                    }
                  >
                    {profile.keys[k.id].performance.rt ? (
                      <>
                        <small>
                          {Number(
                            profile.keys[k.id].performance.rtPress.toFixed(3),
                          )}
                        </small>
                        <small>
                          {Number(
                            profile.keys[k.id].performance.rtRelease.toFixed(3),
                          )}
                        </small>
                      </>
                    ) : (
                      <small>
                        {Number(
                          profile.keys[k.id].performance.press.toFixed(3),
                        )}{" "}
                        mm
                      </small>
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="board-caption">
        <div>
          FLUXKEY 60HE<small>60% HALL-EFFECT KEYBOARD · 61 KEYS</small>
        </div>
        <span>
          {section === "actuation"
            ? "RT 누름 · 뗌 설정값 (mm)"
            : "MAGNETIC PRECISION"}
          <br />
          {section === "actuation"
            ? "설정값 · 실시간 이동거리 아님"
            : "FOR A FASTER YOU"}
        </span>
      </div>
    </section>
  );
}
