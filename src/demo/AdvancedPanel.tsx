import { useState } from "react";
import { useDemo } from "./useDemo";
import { basicActions, defaultAdvanced } from "./model";
import type { AdvancedType, Advanced } from "./model";
import { Range } from "./Controls";
const names: Record<AdvancedType, string> = {
  SOCD: "우선 설정",
  DKS: "동적 키",
  MPT: "다중 트리거",
  MT: "탭 / 홀드",
  TGL: "클릭 유지",
  END: "해제 트리거",
  RS: "순결",
};
export function AdvancedPanel() {
  const s = useDemo();
  const selected = s.selected[0];
  const existing = selected
    ? s.data.profiles[s.slot].keys[selected].advanced
    : null;
  const [type, setType] = useState<AdvancedType>(existing?.type || "SOCD");
  const [draft, setDraft] = useState<Advanced>(
    existing ? structuredClone(existing) : defaultAdvanced("SOCD"),
  );
  const [test, setTest] = useState("");
  const action = (i: number, label: string) => (
    <label className="stack" key={i}>
      {label}
      <select
        aria-label={label}
        value={draft.actions[i]}
        onChange={(e) =>
          setDraft({
            ...draft,
            actions: draft.actions.map((a, j) =>
              j === i ? e.target.value : a,
            ),
          })
        }
      >
        <option value="">미지정</option>
        {basicActions.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>
    </label>
  );
  const delay = (
    <Range
      label={type === "MT" ? "탭 / 홀드 경계" : "지연 시간"}
      unit="ms"
      min={0}
      max={5000}
      step={1}
      value={draft.delay}
      onChange={(delay) => setDraft({ ...draft, delay })}
    />
  );
  return (
    <section className="settings-panel advanced-panel">
      <div className="tabs advanced-tabs">
        {(Object.keys(names) as AdvancedType[]).map((t) => (
          <button
            className={type === t ? "active" : ""}
            key={t}
            onClick={() => {
              setType(t);
              setDraft(
                existing?.type === t
                  ? structuredClone(existing)
                  : defaultAdvanced(t),
              );
              setTest("");
            }}
          >
            {t}
            <small>{names[t]}</small>
          </button>
        ))}
      </div>
      <div className="card">
        <div className="section-heading">
          <h3>
            {names[type]} · {type}
          </h3>
          <div className="button-row">
            <button
              disabled={!s.selected.length}
              onClick={() => {
                s.edit((p) =>
                  s.selected.forEach(
                    (id) => (p.keys[id].advanced = structuredClone(draft)),
                  ),
                );
                s.notify(
                  `${s.selected.length}개 키에 ${type} 설정을 적용했어요.`,
                );
              }}
            >
              선택 키에 적용
            </button>
            <button
              disabled={!s.selected.length}
              onClick={() =>
                s.edit((p) =>
                  s.selected.forEach((id) => (p.keys[id].advanced = null)),
                )
              }
            >
              삭제
            </button>
          </div>
        </div>
        <div className="advanced-fields" data-mode={type}>
          {type === "SOCD" || type === "RS" ? (
            <>
              <div className="two-col">
                {action(0, "키 A")}
                {action(1, "키 B")}
              </div>
              {type === "SOCD" && (
                <div className="tabs">
                  {["후입력 우선", "A 우선", "B 우선", "상쇄"].map((m) => (
                    <button
                      key={m}
                      className={draft.mode === m ? "active" : ""}
                      onClick={() => setDraft({ ...draft, mode: m })}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
              {delay}
            </>
          ) : type === "DKS" ? (
            <>
              <p>누름 2구간 / 뗌 2구간별로 실행할 키를 지정합니다.</p>
              <div className="dks-thresholds">
                {["누름 1", "누름 2", "뗌 1", "뗌 2"].map((l, i) => (
                  <Range
                    key={l}
                    label={l}
                    value={draft.thresholds[i]}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        thresholds: draft.thresholds.map((t, j) =>
                          j === i ? v : t,
                        ),
                      })
                    }
                  />
                ))}
              </div>
              <div className="dks-matrix">
                <span>출력 키</span>
                {["누름 1", "누름 2", "뗌 1", "뗌 2"].map((l) => (
                  <b key={l}>{l}</b>
                ))}
                {draft.actions.map((_, i) => (
                  <div className="matrix-row" key={i}>
                    {action(i, `출력 ${i + 1}`)}
                    {draft.matrix[i].map((v, j) => (
                      <input
                        key={j}
                        type="checkbox"
                        aria-label={`출력 ${i + 1} 구간 ${j + 1}`}
                        checked={v}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            matrix: draft.matrix.map((r, ri) =>
                              ri === i
                                ? r.map((b, ci) =>
                                    ci === j ? e.target.checked : b,
                                  )
                                : r,
                            ),
                          })
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : type === "MPT" ? (
            <div className="three-col">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  {action(i, `출력 ${i + 1}`)}
                  <Range
                    label={`트리거 ${i + 1}`}
                    value={draft.thresholds[i]}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        thresholds: draft.thresholds.map((t, j) =>
                          j === i ? v : t,
                        ),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="two-col">
                {action(
                  0,
                  type === "MT"
                    ? "짧게 누름"
                    : type === "END"
                      ? "누름 출력"
                      : "유지 출력",
                )}
                {type !== "TGL" &&
                  action(1, type === "MT" ? "길게 누름" : "뗌 출력")}
              </div>
              {type !== "TGL" && delay}
            </>
          )}
        </div>
        <details className="advanced-test">
          <summary>
            키 이벤트 테스트 <small>필요할 때 펼치기 · 실제 키 출력 없음</small>
          </summary>
          <div className="test-area">
            <label>
              키 테스트 영역
              <input
                placeholder="포커스 후 키를 눌러 이벤트 확인"
                onKeyDown={(e) => {
                  e.preventDefault();
                  setTest(`${e.code} · 누름 이벤트 수신 (데모)`);
                }}
                onKeyUp={(e) => {
                  e.preventDefault();
                  setTest(`${e.code} · 뗌 이벤트 수신 (데모)`);
                }}
                readOnly
                value=""
              />
            </label>
            <output>
              {test || "OS 키 출력 및 센서 임계점 실행은 하지 않습니다."}
            </output>
          </div>
        </details>
      </div>
    </section>
  );
}
