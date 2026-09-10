import { useEffect, useRef, useState } from "react";
import { useDemo } from "./useDemo";
import { createProfile } from "./model";
export function ProfilesPanel() {
  const s = useDemo();
  const file = useRef<HTMLInputElement>(null);
  const exportData = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(s.data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "fluxkey-60-demo.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="settings-panel">
      <div className="profile-grid">
        {s.data.profiles.map((p, i) => (
          <div
            className={`card ${s.slot === i ? "current-profile" : ""}`}
            key={i}
          >
            <h3>
              ONBOARD SLOT {i + 1} <small>DEMO</small>
            </h3>
            <input
              aria-label={`프로필 ${i + 1} 이름`}
              value={p.name}
              maxLength={60}
              onChange={(e) => {
                const previous = s.slot;
                s.setSlot(i);
                s.edit((target) => {
                  target.name = e.target.value;
                });
                s.setSlot(previous);
              }}
            />
            <p>
              {s.slot === i ? "현재 편집 중" : "별도 키 설정 · 매크로 · 조명"}
            </p>
            <button className="primary" onClick={() => s.setSlot(i)}>
              {s.slot === i ? "사용 중" : "이 프로필 사용"}
            </button>
            <button
              onClick={() =>
                s.notify(
                  "클라우드 동기화는 데모에서 제공하지 않습니다. JSON 내보내기를 사용하세요.",
                )
              }
            >
              클라우드 동기화 안내
            </button>
          </div>
        ))}
      </div>
      <div className="card">
        <h3>LOCAL BACKUP</h3>
        <p>
          네 프로필을 버전이 포함된 JSON으로 백업합니다. XSYD의 실제 설정 파일과
          호환되지 않습니다.
        </p>
        <div className="button-row">
          <button onClick={exportData}>JSON 내보내기</button>
          <button onClick={() => file.current?.click()}>JSON 가져오기</button>
        </div>
        <input
          ref={file}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              if (f.size > 2000000) throw new Error();
              s.importData(JSON.parse(await f.text()));
            } catch {
              s.notify("파일을 읽지 못했습니다. 현재 설정은 유지됩니다.");
            }
            e.target.value = "";
          }}
        />
      </div>
    </section>
  );
}
export function DevicePanel() {
  const s = useDemo();
  const p = s.data.profiles[s.slot];
  const [source, setSource] = useState("online");
  const [filename, setFilename] = useState("");
  const [confirm, setConfirm] = useState<"reset" | "update" | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  useEffect(() => {
    if (progress === null || progress >= 100) return;
    const t = window.setTimeout(
      () => setProgress(Math.min(100, progress + 10)),
      180,
    );
    return () => clearTimeout(t);
  }, [progress]);
  return (
    <section className="settings-panel device-settings">
      <div className="card">
        <h3>DEVICE INFORMATION</h3>
        <dl>
          <div>
            <dt>모델</dt>
            <dd>FluxKey 60 HE · ANSI 61</dd>
          </div>
          <div>
            <dt>참조 장치</dt>
            <dd>AE61 Pro / XSYD</dd>
          </div>
          <div>
            <dt>참조 펌웨어</dt>
            <dd>v0.0.6.0 (원본에서 확인)</dd>
          </div>
          <div>
            <dt>연결</dt>
            <dd>로컬 데모 · WebHID 미사용</dd>
          </div>
        </dl>
        <div className="two-col">
          <label className="stack">
            폴링레이트
            <select
              value={p.polling}
              onChange={(e) =>
                s.edit((p) => {
                  p.polling = Number(e.target.value);
                })
              }
            >
              {[125, 250, 500, 1000, 2000, 4000, 8000].map((v) => (
                <option value={v} key={v}>
                  {v >= 1000 ? `${v / 1000}K` : v} Hz
                </option>
              ))}
            </select>
          </label>
          <label className="stack">
            절전 시간
            <select
              value={p.sleep}
              onChange={(e) =>
                s.edit((p) => {
                  p.sleep = Number(e.target.value);
                })
              }
            >
              {[0, 1, 5, 10, 30, 60].map((v) => (
                <option value={v} key={v}>
                  {v ? `${v}분` : "사용 안 함"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="card">
        <h3>
          FIRMWARE / RECOVERY <small>SIMULATION ONLY</small>
        </h3>
        <p>
          선택 → 확인 → 진행률 흐름만 체험합니다. 펌웨어를 다운로드하거나 기기에
          쓰지 않습니다.
        </p>
        <div className="tabs">
          <button
            className={source === "online" ? "active" : ""}
            onClick={() => setSource("online")}
          >
            온라인 목록 (데모)
          </button>
          <button
            className={source === "local" ? "active" : ""}
            onClick={() => setSource("local")}
          >
            로컬 파일
          </button>
        </div>
        {source === "online" ? (
          <select aria-label="펌웨어 선택">
            <option>AE61 Pro_v0.0.6.0 (참조)</option>
          </select>
        ) : (
          <label className="stack">
            펌웨어 파일 · 내용은 전송하지 않음
            <input
              type="file"
              accept=".bin"
              onChange={(e) => setFilename(e.target.files?.[0]?.name || "")}
            />
          </label>
        )}
        <div className="button-row">
          <button
            disabled={
              (progress !== null && progress < 100) ||
              (source === "local" && !filename)
            }
            onClick={() => setConfirm("update")}
          >
            업데이트 흐름 체험
          </button>
          <button onClick={() => setConfirm("reset")}>
            현재 데모 프로필 초기화
          </button>
        </div>
        {progress !== null && (
          <div>
            <progress max={100} value={progress} />
            <p>
              {progress}% ·{" "}
              {progress === 100
                ? "모의 완료 — 실제 펌웨어는 변경되지 않았습니다."
                : "모의 진행 중"}
            </p>
          </div>
        )}
        <p className="source-note">
          과거 펌웨어 목록과 업데이트 내역은 확인되지 않아 임의로 만들지
          않았습니다.
        </p>
      </div>
      {confirm && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="modal"
          >
            <h2 id="confirm-title">
              {confirm === "reset"
                ? "데모 프로필을 초기화할까요?"
                : "업데이트 화면을 체험할까요?"}
            </h2>
            <p>
              {confirm === "reset"
                ? "현재 프로필의 데모 편집값만 초기화합니다. 저장 전에는 되돌릴 수 있습니다."
                : "파일 전송, 부트로더 진입, 실제 장치 쓰기는 수행하지 않습니다."}
            </p>
            <div className="button-row">
              <button autoFocus onClick={() => setConfirm(null)}>
                취소
              </button>
              <button
                className="primary"
                onClick={() => {
                  if (confirm === "reset")
                    s.edit((p) => Object.assign(p, createProfile(s.slot)));
                  else setProgress(0);
                  setConfirm(null);
                }}
              >
                데모로 진행
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
