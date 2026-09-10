import { useState } from "react";
import { useDemo } from "./useDemo";
import { createProfile, keys } from "./model";
import { Range, Toggle } from "./Controls";
export function LightingPanel() {
  const s = useDemo();
  const [zone, setZone] = useState(0);
  const l = s.data.profiles[s.slot].lights[zone];
  const edit = (patch: Partial<typeof l>) =>
    s.edit((p) => Object.assign(p.lights[zone], patch));
  return (
    <section className="settings-panel">
      <div className="tabs zone-tabs">
        {["메인 키보드", "장식 LED 1"].map((t, i) => (
          <button
            className={zone === i ? "active" : ""}
            key={t}
            onClick={() => setZone(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="lighting-grid">
        <div className="card">
          <h3>조명 효과</h3>
          <div className="effects">
            {Array.from({ length: 20 }, (_, i) => (
              <button
                key={i}
                aria-pressed={l.effect === i + 1}
                onClick={() => edit({ effect: i + 1 })}
              >
                <span
                  style={{
                    background: `linear-gradient(${i * 18}deg, ${l.color}, transparent)`,
                  }}
                />
                L{i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>사용자 정의 색상</h3>
          <label className="color-picker">
            <input
              aria-label="조명 색상"
              type="color"
              value={l.color}
              onChange={(e) => edit({ color: e.target.value })}
            />
            <span>색상 선택</span>
          </label>
          <div className="rgb-inputs">
            {["R", "G", "B"].map((c, i) => (
              <label key={c}>
                {c}
                <input
                  aria-label={c}
                  type="number"
                  min={0}
                  max={255}
                  value={parseInt(l.color.slice(1 + i * 2, 3 + i * 2), 16)}
                  onChange={(e) => {
                    const parts = [0, 1, 2].map((j) =>
                      parseInt(l.color.slice(1 + j * 2, 3 + j * 2), 16),
                    );
                    parts[i] = Math.max(
                      0,
                      Math.min(255, Number(e.target.value)),
                    );
                    edit({
                      color:
                        "#" +
                        parts
                          .map((n) => n.toString(16).padStart(2, "0"))
                          .join(""),
                    });
                  }}
                />
              </label>
            ))}
          </div>
          <label className="stack">
            HEX
            <input
              aria-label="HEX"
              key={l.color}
              defaultValue={l.color}
              onBlur={(e) => {
                if (/^#[0-9a-f]{6}$/i.test(e.target.value))
                  edit({ color: e.target.value });
                else e.target.value = l.color;
              }}
            />
          </label>
          <button
            disabled={zone !== 0 || !s.selected.length}
            onClick={() =>
              s.edit((p) =>
                s.selected.forEach((id) => (p.keys[id].color = l.color)),
              )
            }
          >
            선택 키에 색상 적용
          </button>
        </div>
        <div className="card">
          <h3>조명 설정</h3>
          <Toggle
            label="상단 조명"
            value={l.top}
            onChange={(top) => edit({ top })}
          />
          <Toggle
            label="하단 조명"
            value={l.bottom}
            onChange={(bottom) => edit({ bottom })}
          />
          <Range
            label="밝기"
            value={l.brightness}
            unit="%"
            min={0}
            max={100}
            step={1}
            onChange={(brightness) => edit({ brightness })}
          />
          <Range
            label="속도"
            value={l.speed}
            unit="%"
            min={0}
            max={100}
            step={1}
            onChange={(speed) => edit({ speed })}
          />
          <button
            onClick={() =>
              s.edit((p) => {
                p.lights[zone] = createProfile(0).lights[zone];
                if (zone === 0) keys.forEach((k) => (p.keys[k.id].color = ""));
              })
            }
          >
            커스텀 조명 삭제 / 복원
          </button>
        </div>
      </div>
      <p className="hint">
        L1–L20 효과 슬롯과 설정값을 저장합니다. 실제 LED 애니메이션은 전송하지
        않습니다.
      </p>
    </section>
  );
}
