export interface KeyDef {
  id: string;
  label: string;
  u: number;
}
const key = (id: string, label = id, u = 1): KeyDef => ({ id, label, u });
export const rows: KeyDef[][] = [
  [
    key("ESC", "Esc"),
    ..."1234567890".split("").map((n) => key(`DIGIT_${n}`, n)),
    key("MINUS", "-"),
    key("EQUAL", "="),
    key("BACKSPACE", "Backspace", 2),
  ],
  [
    key("TAB", "Tab", 1.5),
    ..."QWERTYUIOP".split("").map((n) => key(`KEY_${n}`, n)),
    key("BRACKET_L", "["),
    key("BRACKET_R", "]"),
    key("BACKSLASH", "\\", 1.5),
  ],
  [
    key("CAPS", "Caps", 1.75),
    ..."ASDFGHJKL".split("").map((n) => key(`KEY_${n}`, n)),
    key("SEMICOLON", ";"),
    key("QUOTE", "'"),
    key("ENTER", "Enter", 2.25),
  ],
  [
    key("SHIFT_L", "Shift", 2.25),
    ..."ZXCVBNM".split("").map((n) => key(`KEY_${n}`, n)),
    key("COMMA", ","),
    key("PERIOD", "."),
    key("SLASH", "/"),
    key("SHIFT_R", "Shift", 2.75),
  ],
  [
    key("CTRL_L", "Ctrl", 1.25),
    key("WIN_L", "Win", 1.25),
    key("ALT_L", "Alt", 1.25),
    key("SPACE", "Space", 6.25),
    key("ALT_R", "Alt", 1.25),
    key("FN", "Fn", 1.25),
    key("MENU", "Menu", 1.25),
    key("CTRL_R", "Ctrl", 1.25),
  ],
];
export const keys = rows.flat();
export const basicActions = [
  ...new Set([
    ...keys.map((k) => k.label),
    "`",
    "L-Ctrl",
    "R-Ctrl",
    "L-Shift",
    "R-Shift",
    "L-Alt",
    "R-Alt",
    "L-Gui",
    "R-Gui",
    ...Array.from({ length: 24 }, (_, i) => `F${i + 1}`),
    "↑",
    "↓",
    "←",
    "→",
    "Home",
    "End",
    "Page Up",
    "Page Down",
    "Insert",
    "Delete",
    "Print Screen",
    "Scroll Lock",
    "Pause",
    "Num Lock",
    ...Array.from({ length: 10 }, (_, i) => `Num ${i}`),
    "Num +",
    "Num -",
    "Num *",
    "Num /",
    "Num Enter",
    "Num .",
  ]),
];
export const categories: Record<string, string[]> = {
  기본: basicActions,
  특수: [
    "기본값 복원",
    "비활성화",
    "투명 (하위 레이어)",
    "Fn0",
    "Fn1",
    "Fn2",
    "Fn3",
  ],
  멀티미디어: [
    "화면 밝기 +",
    "화면 밝기 -",
    "다음 곡",
    "이전 곡",
    "정지",
    "재생/일시정지",
    "음소거",
    "볼륨 +",
    "볼륨 -",
    "음악 앱",
    "메일",
    "계산기",
    "내 컴퓨터",
    "브라우저",
  ],
  조명: [
    "메인 다음 효과",
    "메인 색상",
    "메인 밝기 +",
    "메인 밝기 -",
    "메인 속도 +",
    "메인 속도 -",
    "메인 이전 효과",
    "메인 켜기/끄기",
    "메인 방향",
    "장식 다음 효과",
    "장식 색상",
    "장식 밝기 +",
    "장식 밝기 -",
    "장식 속도 +",
    "장식 속도 -",
    "장식 이전 효과",
    "장식 켜기/끄기",
    "장식 방향",
  ],
  제어: [
    "초기화 (키 할당)",
    "Windows 모드",
    "Mac 모드",
    "프로필 1",
    "프로필 2",
    "프로필 3",
    "프로필 4",
  ],
  조합키: basicActions,
  마우스: [
    "마우스 해제 (m-free)",
    "왼쪽 클릭",
    "오른쪽 클릭",
    "가운데 클릭",
    "앞으로",
    "뒤로",
    "마우스 ←",
    "마우스 →",
    "마우스 ↑",
    "마우스 ↓",
    "휠 위",
    "휠 아래",
  ],
  매크로: Array.from({ length: 16 }, (_, i) => `M${i}`),
};
export interface Performance {
  press: number;
  rt: boolean;
  first: number;
  rtPress: number;
  rtRelease: number;
  top: number;
  bottom: number;
  optimize: boolean;
  switchId: string;
  calibrated: boolean;
}
export type AdvancedType = "SOCD" | "DKS" | "MPT" | "MT" | "TGL" | "END" | "RS";
export interface Advanced {
  type: AdvancedType;
  actions: string[];
  thresholds: number[];
  delay: number;
  mode: string;
  matrix: boolean[][];
}
export interface KeyConfig {
  performance: Performance;
  mappings: string[];
  color: string;
  advanced: Advanced | null;
}
export interface MacroEvent {
  type: "down" | "up" | "delay";
  key: string;
  ms: number;
}
export interface Macro {
  events: MacroEvent[];
  mode: number;
  repeats: number;
  defaultDelay: number;
  useDelay: boolean;
}
export interface Lighting {
  effect: number;
  color: string;
  brightness: number;
  speed: number;
  top: boolean;
  bottom: boolean;
}
export interface Profile {
  name: string;
  keys: Record<string, KeyConfig>;
  macros: Macro[];
  lights: Lighting[];
  polling: number;
  sleep: number;
}
export interface DemoData {
  version: 1;
  device: "fluxkey-60-demo";
  profiles: Profile[];
}
export const defaultAdvanced = (type: AdvancedType): Advanced => ({
  type,
  actions: ["A", "D", "", ""],
  thresholds: type === "MPT" ? [0.5, 1, 1.5] : [1.4, 3, 3, 1.4],
  delay: type === "MT" ? 200 : 0,
  mode: "후입력 우선",
  matrix: Array.from({ length: 4 }, () => [false, false, false, false]),
});
export const createProfile = (i: number): Profile => ({
  name: `Profile ${String(i + 1).padStart(2, "0")}`,
  keys: Object.fromEntries(
    keys.map((k) => [
      k.id,
      {
        performance: {
          press: 0.3,
          rt: true,
          first: 0.3,
          rtPress: 0.1,
          rtRelease: 0.1,
          top: 0.1,
          bottom: 0.1,
          optimize: false,
          switchId: "gateron-jade",
          calibrated: false,
        },
        mappings: [k.label, k.label, k.label, k.label],
        color: "",
        advanced: null,
      },
    ]),
  ),
  macros: Array.from({ length: 16 }, () => ({
    events: [],
    mode: 0,
    repeats: 1,
    defaultDelay: 10,
    useDelay: false,
  })),
  lights: Array.from({ length: 2 }, () => ({
    effect: 1,
    color: "#b6ed30",
    brightness: 80,
    speed: 50,
    top: true,
    bottom: true,
  })),
  polling: 8000,
  sleep: 30,
});
export const createData = (): DemoData => ({
  version: 1,
  device: "fluxkey-60-demo",
  profiles: Array.from({ length: 4 }, (_, i) => createProfile(i)),
});
export const switchModels = [
  {
    id: "gateron-jade",
    brand: "GATERON",
    name: "磁玉轴 · Magnetic Jade",
    travel: 3.43,
  },
  {
    id: "gateron-jade-pro",
    brand: "GATERON",
    name: "磁玉Pro · Jade Pro",
    travel: 3.39,
  },
  {
    id: "gateron-jade-max",
    brand: "GATERON",
    name: "磁玉Max · Jade Max",
    travel: 3.41,
  },
  {
    id: "gateron-air",
    brand: "GATERON",
    name: "磁玉Air · Jade Air",
    travel: 3.43,
  },
  {
    id: "gateron-orange",
    brand: "GATERON",
    name: "磁橙轴 · Magnetic Orange",
    travel: 3.935,
  },
  {
    id: "gateron-apollo",
    brand: "GATERON",
    name: "阿波罗轴 · Apollo",
    travel: 3.13,
  },
  ...Object.entries({
    GATERON:
      "麒麟轴:3.44,玉刃轴:3.475,翠玉轴:3.355,粉玉轴:3.355,粉磁玉轴Pro:3.415,悟静轴:3.615,磁绿轴:3.895,磁黑轴:3.4,磁黄轴:3.97,双轨磁橙轴:4.005,双轨磁白轴:4.015,玄武轴(全润):3.365,灰玉轴Pro:3.385,樱花轴:3.39,封底雪刀轴:3.43,金龙轴:3.34,星轨磁轴:3.945,赤龙轴(自润):3.38,紫龙轴:3.335,磁玉Pom:3.3,花火轴:3.15,绿龙轴:3.35,玉京子轴:3.42,磁玉Gaming:3.4",
    TTC: "天王轴:3.46,科泰轴:3.42,太阿磁轴:3.47,精灵王轴:3.47,龙神轴:3.47,凌雪轴:3.51,兵王轴Pro:3.44,兵王轴:3.48,天王SE:3.44,天王轴电竞:3.45,万磁王:3.42,太阳神轴:3.42,圣心万磁王:3.45,紫心万磁王:3.42,爱心万磁王:3.39,白蛇轴:3.41,青蛇轴:3.42,Pom万磁王:3.39,万磁王RGB:3.39",
    other:
      "极磁轴Pro+:3.65,八宝轴L:3.5,八宝轴α:3.5,白色悟空轴:3.4,雪曜轴:3.2,冰曜轴:3.2,天际线轴:3.5,极磁-樱澈轴:3.625,极磁-墨玉轴:3.605,极磁-混元轴:3.655,极磁-灼华轴:3.645,极磁轴RGB:3.58,极磁轴Pro:3.585,冰皇轴:3.36,赤霄轴:3.54,紫星轴:3.55,天青轴Pro:3.61,磁神轴:3.47,天际线轴:3.55,形意轴:3.38,粉皇轴:3.45,悟空轴:3.39,锦鲤轴:3.34,UR冰磁轴:3.31,登神Pro:3.36,ti轴:3.34",
    "Jiang Wan": "库里南轴:3.6",
  }).flatMap(([brand, entries]) =>
    entries.split(",").map((entry, i) => {
      const [name, travel] = entry.split(":");
      return { id: `${brand}-${i}`, brand, name, travel: Number(travel) };
    }),
  ),
];
const finite = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
export function validateData(value: unknown): value is DemoData {
  try {
    return validateStructure(value);
  } catch {
    return false;
  }
}
function validateStructure(value: unknown): value is DemoData {
  if (!value || typeof value !== "object") return false;
  const d = value as DemoData;
  if (
    d.version !== 1 ||
    d.device !== "fluxkey-60-demo" ||
    !Array.isArray(d.profiles) ||
    d.profiles.length !== 4
  )
    return false;
  return d.profiles.every(
    (p) =>
      p &&
      typeof p.name === "string" &&
      p.name.length <= 60 &&
      [125, 250, 500, 1000, 2000, 4000, 8000].includes(p.polling) &&
      [0, 1, 5, 10, 30, 60].includes(p.sleep) &&
      p.keys &&
      Object.keys(p.keys).length === 61 &&
      keys.every((k) => {
        const c = p.keys[k.id];
        const v = c?.performance;
        return (
          c &&
          v &&
          ["press", "first", "rtPress", "rtRelease", "top", "bottom"].every(
            (f) => finite(v[f as keyof Performance], 0, 4),
          ) &&
          typeof v.rt === "boolean" &&
          typeof v.optimize === "boolean" &&
          typeof v.calibrated === "boolean" &&
          switchModels.some((s) => s.id === v.switchId) &&
          Array.isArray(c.mappings) &&
          c.mappings.length === 4 &&
          c.mappings.every((m) => typeof m === "string" && m.length < 100) &&
          (c.color === "" || /^#[0-9a-f]{6}$/i.test(c.color)) &&
          (c.advanced === null ||
            (["SOCD", "DKS", "MPT", "MT", "TGL", "END", "RS"].includes(
              c.advanced?.type,
            ) &&
              Array.isArray(c.advanced.actions) &&
              c.advanced.actions.length === 4 &&
              c.advanced.actions.every((a) => typeof a === "string") &&
              Array.isArray(c.advanced.thresholds) &&
              c.advanced.thresholds.length >= 3 &&
              c.advanced.thresholds.every((t) => finite(t, 0, 4)) &&
              finite(c.advanced.delay, 0, 5000) &&
              typeof c.advanced.mode === "string" &&
              Array.isArray(c.advanced.matrix) &&
              c.advanced.matrix.length === 4 &&
              c.advanced.matrix.every(
                (row) =>
                  Array.isArray(row) &&
                  row.length === 4 &&
                  row.every((b) => typeof b === "boolean"),
              )))
        );
      }) &&
      Array.isArray(p.macros) &&
      p.macros.length === 16 &&
      p.macros.every(
        (m) =>
          m &&
          Number.isInteger(m.mode) &&
          finite(m.mode, 0, 5) &&
          finite(m.repeats, 1, 999) &&
          finite(m.defaultDelay, 0, 5000) &&
          typeof m.useDelay === "boolean" &&
          Array.isArray(m.events) &&
          m.events.length <= 2000 &&
          m.events.every(
            (e) =>
              ["down", "up", "delay"].includes(e.type) &&
              typeof e.key === "string" &&
              finite(e.ms, 0, 60000),
          ),
      ) &&
      Array.isArray(p.lights) &&
      p.lights.length === 2 &&
      p.lights.every(
        (l) =>
          l &&
          /^#[0-9a-f]{6}$/i.test(l.color) &&
          finite(l.effect, 1, 20) &&
          finite(l.brightness, 0, 100) &&
          finite(l.speed, 0, 100) &&
          typeof l.top === "boolean" &&
          typeof l.bottom === "boolean",
      ),
  );
}
