import { useId } from "react";
import { usePerformance } from "./Controls";

export function TrackingChart({
  samples,
  running,
  onToggle,
  onClear,
}: {
  samples: number[];
  running: boolean;
  onToggle: () => void;
  onClear: () => void;
}) {
  const { first, mixed, empty } = usePerformance();
  const gradient = useId();
  const field = first.rt ? "first" : "press";
  const threshold = first[field];
  const showThreshold = !empty && !mixed(field) && !mixed("rt");
  const current = samples.at(-1);
  const y = (v: number) => 164 - (v / 4) * 140;
  const points = samples.map(
    (v, i) => `${44 + ((75 - samples.length + i) / 74) * 692},${y(v)}`,
  );
  const path = points.length ? `M${points.join(" L")}` : "";
  return (
    <section className="tracking-card" aria-label="입력 지점 실시간 트래킹">
      <div className="tracking-heading">
        <div>
          <h3>
            ACTUATION TRACKING <span className="demo-badge">DEMO</span>
          </h3>
          <p>
            시간에 따른 이동거리 · 입력 지점 / RT 설정은 오른쪽에서 조절하세요.
          </p>
        </div>
        <div className="button-row">
          <button onClick={onClear} disabled={!samples.length}>
            기록 지우기
          </button>
          <button className={running ? "" : "primary"} onClick={onToggle}>
            {running ? "일시정지" : "트래킹 시작"}
          </button>
        </div>
      </div>
      <div className="tracking-metrics">
        <span className={running ? "tracking-live" : ""}>
          ● {running ? "LIVE" : samples.length ? "PAUSED" : "READY"}
        </span>
        <b>
          {current === undefined ? "—" : current.toFixed(2)} <small>mm</small>
        </b>
        <span>
          입력 지점{" "}
          <strong>
            {empty
              ? "키 선택 필요"
              : showThreshold
                ? `${threshold.toFixed(3)} mm`
                : "혼합"}
          </strong>
        </span>
      </div>
      <svg
        className="tracking-graph"
        viewBox="0 0 760 190"
        role="img"
        aria-label="최근 6초 이동거리 그래프, 가로축 시간, 세로축 이동거리 0에서 4mm"
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a1cc28" stopOpacity=".23" />
            <stop offset="100%" stopColor="#a1cc28" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((v) => (
          <g key={v}>
            <line x1="44" x2="736" y1={y(v)} y2={y(v)} stroke="#e6eadd" />
            <text x="32" y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((v) => (
          <g key={v}>
            <line
              x1={44 + (v / 6) * 692}
              x2={44 + (v / 6) * 692}
              y1="24"
              y2="164"
              stroke="#edf0e7"
            />
            <text
              x={44 + (v / 6) * 692}
              y="183"
              textAnchor={v === 6 ? "end" : "middle"}
            >
              {v === 6 ? "지금" : `${v - 6}s`}
            </text>
          </g>
        ))}
        <text x="18" y="12">
          mm
        </text>
        {showThreshold && (
          <line
            className="threshold-line"
            x1="44"
            x2="736"
            y1={y(threshold)}
            y2={y(threshold)}
            stroke="#76865f"
            strokeDasharray="5 5"
          />
        )}
        {path && (
          <>
            <path
              d={`${path} L736,164 L${points[0].split(",")[0]},164 Z`}
              fill={`url(#${gradient})`}
            />
            <path
              className="tracking-wave"
              d={path}
              fill="none"
              stroke="#86b51b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle
              cx="736"
              cy={y(current!)}
              r="4"
              fill="#86b51b"
              stroke="white"
              strokeWidth="2"
            />
          </>
        )}
        {!samples.length && (
          <text
            x="390"
            y="97"
            textAnchor="middle"
            className="tracking-placeholder"
          >
            트래킹을 시작하면 이동거리 그래프가 표시됩니다
          </text>
        )}
      </svg>
      <div className="tracking-legend">
        <span>
          <i />
          이동거리
        </span>
        <span>
          <i className="dashed" />
          입력 지점
        </span>
        <small>가상 샘플 · 실제 키보드 센서 데이터가 아닙니다.</small>
      </div>
    </section>
  );
}
