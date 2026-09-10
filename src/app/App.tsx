import { useEffect, useState } from "react";
import {
  Keyboard,
  Gauge,
  Sun,
  Layers,
  ListMusic,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Save,
  X,
  MousePointer2,
} from "lucide-react";
import { useDemo } from "../demo/useDemo";
import { keys } from "../demo/model";
import { Board } from "../demo/Board";
import { Keymap } from "../demo/Keymap";
import { PerformancePanel } from "../demo/PerformancePanel";
import { LightingPanel } from "../demo/LightingPanel";
import { AdvancedPanel } from "../demo/AdvancedPanel";
import { MacrosPanel } from "../demo/MacrosPanel";
import { ProfilesPanel, DevicePanel } from "../demo/DevicePanels";
import { PerfRange, Trigger, usePerformance } from "../demo/Controls";
const navigation = [
  { id: "keymap", label: "KEYMAP", sub: "키 매핑", icon: Keyboard },
  { id: "actuation", label: "ACTUATION", sub: "입력 지점", icon: Gauge },
  { id: "rgb", label: "RGB", sub: "조명", icon: Sun },
  { id: "advanced", label: "ADVANCED", sub: "고급 키", icon: Layers },
  { id: "macros", label: "MACROS", sub: "매크로", icon: ListMusic },
  { id: "profiles", label: "PROFILES", sub: "내 구성", icon: Layers },
  {
    id: "device",
    label: "DEVICE",
    sub: "장치 · 업데이트",
    icon: SlidersHorizontal,
  },
];
function Inspector({ travel }: { travel: number | null }) {
  const s = useDemo();
  const { first, mixed, empty } = usePerformance();
  const field = first.rt ? "first" : "press";
  const label =
    s.selected.length > 1
      ? `${s.selected.length} KEYS`
      : keys.find((k) => k.id === s.selected[0])?.label;
  return (
    <aside className="inspector">
      <div className="inspector-title">
        SELECTED KEY <SlidersHorizontal size={16} />
      </div>
      {empty ? (
        <div className="empty inspector-empty">
          <MousePointer2 />
          <h3>키를 선택하세요</h3>
          <p>키보드에서 하나 이상의 키를 선택하면 설정이 표시됩니다.</p>
        </div>
      ) : (
        <>
          <section>
            <div className="selected-letter">{label}</div>
            <p className="field-heading">
              <span>KEY SETTINGS</span>
              <span>
                {s.selected.length === 1
                  ? s.data.profiles[s.slot].keys[s.selected[0]].mappings[
                      s.layer
                    ]
                  : "일괄 편집"}
              </span>
            </p>
          </section>
          <section>
            <h3>ACTUATION</h3>
            <p>
              {first.rt
                ? "최초 입력 지점 · RT 모드"
                : "키가 활성화되는 이동거리"}
            </p>
            <div className="big-value">
              {mixed(field) ? "혼합" : first[field].toFixed(2)}
              <small> mm</small>
            </div>
            <PerfRange
              field={field}
              label={first.rt ? "최초 입력 지점" : "입력 지점"}
            />
          </section>
          <section>
            <h3>RAPID TRIGGER</h3>
            <p>키를 되돌리는 순간 빠르게 재입력합니다.</p>
            <Trigger />
          </section>
          <section>
            <h3>TRAVEL PREVIEW</h3>
            <p>
              {travel === null
                ? "설정 지점 미리보기 · 실측 아님"
                : "가상 이동거리 · 센서 실측 아님"}
            </p>
            <svg
              className="travel-chart"
              viewBox="0 0 260 115"
              role="img"
              aria-label="이동거리 설정 미리보기"
            >
              <path
                d="M12 10V95H248 M12 55H248 M70 10V95 M130 10V95 M190 10V95 M248 10V95"
                fill="none"
                stroke="#e2e4dc"
              />
              <path
                d="M12 95L248 16"
                fill="none"
                stroke="#92c917"
                strokeWidth="2"
              />
              <circle
                cx={12 + ((travel ?? first[field]) / 4) * 236}
                cy={95 - ((travel ?? first[field]) / 4) * 79}
                r="4"
                fill="#20251a"
              />
              <text x="12" y="112">
                0
              </text>
              <text x="224" y="112">
                4 mm
              </text>
            </svg>
            <p className="hint">
              {s.selected.every(
                (id) => s.data.profiles[s.slot].keys[id].performance.calibrated,
              )
                ? "✓ 모의 교정 완료"
                : "교정 전 · 데모 데이터"}
            </p>
          </section>
        </>
      )}
    </aside>
  );
}
export default function App() {
  const s = useDemo();
  const [section, setSection] = useState("keymap");
  const [travelEnabled, setTravelEnabled] = useState(false);
  const [samples, setSamples] = useState<number[]>([]);
  const travel = samples.at(-1) ?? 0;
  const current = navigation.find((n) => n.id === section) ?? navigation[1];
  const hasBoard = !["macros", "profiles", "device"].includes(section);
  useEffect(() => {
    if (!travelEnabled) return;
    const t = window.setInterval(
      () =>
        setSamples((previous) => [
          ...previous.slice(-74),
          (Math.sin(Date.now() / 600) + 1) * 1.9,
        ]),
      80,
    );
    return () => clearInterval(t);
  }, [travelEnabled]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (useDemo.getState().dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  return (
    <div
      className={`app-shell ${hasBoard ? "" : "global-view"}`}
      data-section={section}
    >
      <header className="header">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setSection("keymap");
          }}
        >
          FLUXKEY
        </a>
        <span className="tagline">PRECISION INPUT. HIGHER POTENTIAL.</span>
        <div className="device-summary">
          <Keyboard size={30} />
          <div>
            <b className="device-name">FluxKey 60 HE</b>
            <small>
              <i className="status-dot" /> Demo mode · 장치 미연결
            </small>
          </div>
        </div>
        <button
          className="icon-button"
          aria-label="장치 설정"
          onClick={() => setSection("device")}
        >
          <SlidersHorizontal size={18} />
        </button>
      </header>
      <aside className="sidebar">
        <nav>
          {navigation.map((n) => (
            <button
              key={n.id}
              className={section === n.id ? "nav-item active" : "nav-item"}
              onClick={() => setSection(n.id)}
            >
              <n.icon size={20} />
              <span>
                {n.label}
                <small>{n.sub}</small>
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <b>LOCAL DEMO</b>
          <p>
            <i className="status-dot" /> WebHID 연결 없음
          </p>
          <small>설정은 이 브라우저에만 저장됩니다.</small>
        </div>
      </aside>
      <main className="workspace">
        <div className="workspace-heading">
          <div>
            <h1>{current.label}</h1>
            <p>
              {current.sub} ·{" "}
              {hasBoard
                ? "키를 선택하고 원하는 동작을 설정하세요."
                : "장치를 변경하지 않는 로컬 데모입니다."}
            </p>
          </div>
          {hasBoard && (
            <div className="tabs layers" aria-label="레이어">
              {["Main Layer", "Fn Layer", "Layer 2", "Layer 3"].map((l, i) => (
                <button
                  className={s.layer === i ? "active" : ""}
                  key={l}
                  onClick={() => s.setLayer(i)}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
        {hasBoard && <Board section={section} />}
        <div className="editor">
          {section === "keymap" ? (
            <Keymap />
          ) : section === "actuation" || section === "rapid" ? (
            <PerformancePanel
              travelEnabled={travelEnabled}
              setTravelEnabled={setTravelEnabled}
              travel={travel}
              samples={samples}
              clearSamples={() => setSamples([])}
            />
          ) : section === "rgb" ? (
            <LightingPanel />
          ) : section === "advanced" ? (
            <AdvancedPanel
              key={`${s.slot}-${s.selected.join(",")}-${JSON.stringify(s.data.profiles[s.slot].keys[s.selected[0]]?.advanced)}`}
            />
          ) : section === "macros" ? (
            <MacrosPanel key={s.slot} />
          ) : section === "profiles" ? (
            <ProfilesPanel />
          ) : (
            <DevicePanel />
          )}
        </div>
      </main>
      {hasBoard && <Inspector travel={travelEnabled ? travel : null} />}
      <footer className="bottom-bar">
        <label className="profile-selector">
          <Layers size={17} />
          <span>PROFILE</span>
          <select
            aria-label="프로필 선택"
            value={s.slot}
            onChange={(e) => s.setSlot(Number(e.target.value))}
          >
            {s.data.profiles.map((p, i) => (
              <option key={i} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <span className="footer-device">
          <i className="status-dot" /> FluxKey 60 HE{" "}
          <small>LOCAL CONFIGURATION</small>
        </span>
        <div className="save-actions">
          <span>{s.dirty ? "저장하지 않은 변경사항" : "로컬 설정 저장됨"}</span>
          <button disabled={!s.dirty} onClick={s.discard}>
            <RotateCcw size={14} /> 되돌리기
          </button>
          <button className="primary" onClick={s.save}>
            {s.dirty ? <Save size={15} /> : <Check size={15} />} 데모 저장
          </button>
        </div>
      </footer>
      {s.notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {s.notice}
          <button aria-label="알림 닫기" onClick={() => s.notify("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
