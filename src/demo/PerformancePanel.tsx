import { useState } from "react";
import { useDemo } from "./useDemo";
import { switchModels, keys } from "./model";
import { usePerformance, PerfRange, Toggle } from "./Controls";
import { TrackingChart } from "./TrackingChart";
export function PerformancePanel({
  travelEnabled,
  setTravelEnabled,
  travel,
  samples,
  clearSamples,
}: {
  travelEnabled: boolean;
  setTravelEnabled: (b: boolean) => void;
  travel: number;
  samples: number[];
  clearSamples: () => void;
}) {
  const s = useDemo();
  const { first, mixed, update, empty } = usePerformance();
  const [tab, setTab] = useState("트리거");
  const [brand, setBrand] = useState("GATERON");
  return (
    <section className="settings-panel">
      <div className="tabs">
        {["트리거", "데드존", "스위치", "캘리브레이션", "이동거리 테스트"].map(
          (t) => (
            <button
              className={tab === t ? "active" : ""}
              key={t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ),
        )}
      </div>
      {tab === "트리거" ? (
        <TrackingChart
          samples={samples}
          running={travelEnabled}
          onToggle={() => setTravelEnabled(!travelEnabled)}
          onClear={clearSamples}
        />
      ) : tab === "데드존" ? (
        <div className="card">
          <div className="two-col">
            <PerfRange field="top" label="상단 데드존" />
            <PerfRange field="bottom" label="하단 데드존" />
          </div>
          <Toggle
            label="자기 표시 최적화"
            value={first.optimize}
            mixed={mixed("optimize")}
            disabled={empty}
            onChange={(optimize) => update({ optimize })}
          />
        </div>
      ) : tab === "스위치" ? (
        <div className="card">
          <div className="tabs">
            {["GATERON", "TTC", "other", "Jiang Wan"].map((b) => (
              <button
                key={b}
                className={brand === b ? "active" : ""}
                onClick={() => setBrand(b)}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="switch-grid">
            {switchModels
              .filter((m) => m.brand === brand)
              .map((m) => (
                <button
                  className={
                    first.switchId === m.id && !mixed("switchId")
                      ? "active"
                      : ""
                  }
                  disabled={empty}
                  key={m.id}
                  onClick={() => update({ switchId: m.id })}
                >
                  <b>{m.name}</b>
                  <small>{m.travel} mm</small>
                </button>
              ))}
          </div>
          <p className="hint">
            이동거리를 확인한 모델만 제공합니다. 하드웨어 보정계수는 포함하지
            않습니다.
          </p>
        </div>
      ) : tab === "캘리브레이션" ? (
        <div className="card">
          <h3>키보드 교정</h3>
          <p>교정 상태를 데모로 변경합니다. 실제 센서에는 접근하지 않습니다.</p>
          <div className="button-row">
            <button
              disabled={empty}
              onClick={() => {
                update({ calibrated: true });
                s.notify("선택 키 모의 교정을 완료했습니다.");
              }}
            >
              선택 키 모의 교정
            </button>
            <button
              onClick={() => {
                s.edit((p) =>
                  keys.forEach(
                    (k) => (p.keys[k.id].performance.calibrated = true),
                  ),
                );
                s.notify("전체 61키 모의 교정을 완료했습니다.");
              }}
            >
              전체 키 모의 교정
            </button>
          </div>
          <p className="hint">
            {mixed("calibrated")
              ? "혼합"
              : first.calibrated
                ? "교정 완료 (데모)"
                : "교정 전"}
          </p>
        </div>
      ) : (
        <div className="card travel-test">
          <div>
            <h3>SWITCH TEST</h3>
            <p>가상 이동거리입니다. 키보드 센서 측정이 아닙니다.</p>
            <Toggle
              label="이동거리 표시"
              value={travelEnabled}
              onChange={setTravelEnabled}
            />
          </div>
          <strong>
            {travelEnabled ? travel.toFixed(2) : "—"}
            <small> mm</small>
          </strong>
        </div>
      )}
    </section>
  );
}
