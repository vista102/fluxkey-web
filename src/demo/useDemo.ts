import { create } from "zustand";
import { createData, validateData } from "./model";
import type { DemoData, Profile } from "./model";
const storageKey = "fluxkey-60-demo-v1";
function load(): DemoData {
  try {
    const d: unknown = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (validateData(d)) return d;
  } catch {
    /* Preserve unusable storage until the user explicitly saves. */
  }
  return createData();
}
interface State {
  data: DemoData;
  saved: DemoData;
  slot: number;
  layer: number;
  selected: string[];
  dirty: boolean;
  notice: string;
  edit: (fn: (p: Profile) => void) => void;
  select: (ids: string[]) => void;
  setSlot: (i: number) => void;
  setLayer: (i: number) => void;
  save: () => void;
  discard: () => void;
  importData: (data: unknown) => void;
  notify: (s: string) => void;
}
const initial = load();
export const useDemo = create<State>((set, get) => ({
  data: initial,
  saved: structuredClone(initial),
  slot: 0,
  layer: 0,
  selected: ["KEY_W"],
  dirty: false,
  notice: "",
  edit: (fn) =>
    set((s) => {
      const data = structuredClone(s.data);
      fn(data.profiles[s.slot]);
      return { data, dirty: true };
    }),
  select: (selected) => set({ selected }),
  setSlot: (slot) => set({ slot }),
  setLayer: (layer) => set({ layer }),
  notify: (notice) => set({ notice }),
  save: () => {
    try {
      const data = get().data;
      localStorage.setItem(storageKey, JSON.stringify(data));
      set({
        saved: structuredClone(data),
        dirty: false,
        notice: "이 브라우저에 저장했어요. 실제 장치는 변경하지 않았습니다.",
      });
    } catch {
      set({
        notice:
          "브라우저 저장 공간을 사용할 수 없습니다. JSON으로 내보내 주세요.",
      });
    }
  },
  discard: () =>
    set((s) => ({
      data: structuredClone(s.saved),
      dirty: false,
      notice: "마지막 로컬 저장 상태로 되돌렸어요.",
    })),
  importData: (data) => {
    if (!validateData(data)) {
      set({
        notice: "호환되지 않거나 손상된 파일입니다. 현재 설정은 유지됩니다.",
      });
      return;
    }
    set({
      data: structuredClone(data),
      dirty: true,
      notice: "데모 설정을 가져왔어요. 저장 버튼으로 확정하세요.",
    });
  },
}));
