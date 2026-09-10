import { useState } from "react";
import { Keyboard, ChevronRight } from "lucide-react";
import { useDemo } from "./useDemo";
import { categories, keys } from "./model";
export function Keymap() {
  const s = useDemo();
  const [category, setCategory] = useState("기본");
  const [query, setQuery] = useState("");
  const [mods, setMods] = useState<string[]>([]);
  const [group, setGroup] = useState("문자");
  const groups: Record<string, string[]> = {
    문자: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    숫자: "1234567890".split(""),
    "수정 키": [
      "Esc",
      "Tab",
      "Caps",
      "Shift",
      "Ctrl",
      "Win",
      "Alt",
      "Space",
      "Fn",
      "Menu",
      "Enter",
      "Backspace",
      "L-Ctrl",
      "R-Ctrl",
      "L-Shift",
      "R-Shift",
      "L-Alt",
      "R-Alt",
      "L-Gui",
      "R-Gui",
    ],
    탐색: [
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
    ],
    기능: Array.from({ length: 24 }, (_, i) => "F" + (i + 1)),
    기호: ["-", "=", "[", "]", "\\", ";", "'", ",", ".", "/", "`"],
    전체: categories["기본"],
  };
  const actions = (
    category === "기본" && !query ? groups[group] : categories[category]
  ).filter((a) => a.toLowerCase().includes(query.toLowerCase()));
  const actionValue = (a: string) =>
    category === "조합키" ? [...mods, a].join(" + ") : a;
  const apply = (a: string) =>
    s.edit((p) =>
      s.selected.forEach(
        (id) =>
          (p.keys[id].mappings[s.layer] =
            a === "기본값 복원"
              ? keys.find((k) => k.id === id)!.label
              : actionValue(a)),
      ),
    );
  return (
    <section className="mapping-panel">
      <div className="palette-categories">
        <h3>KEY FUNCTIONS</h3>
        {Object.keys(categories).map((c) => (
          <button
            key={c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            <Keyboard size={14} />
            {c}
            <ChevronRight size={12} />
          </button>
        ))}
      </div>
      <div className="palette-content">
        <div className="section-heading">
          <h3>{category === "기본" ? "COMMON KEYS" : category}</h3>
          <input
            aria-label="키 검색"
            placeholder="키 검색…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {category === "조합키" && (
          <div className="button-row modifier-row">
            {["CTRL", "SHIFT", "WIN", "ALT"].map((m) => (
              <button
                key={m}
                aria-pressed={mods.includes(m)}
                onClick={() =>
                  setMods(
                    mods.includes(m)
                      ? mods.filter((x) => x !== m)
                      : [...mods, m],
                  )
                }
              >
                {m}
              </button>
            ))}
          </div>
        )}
        {category === "기본" && (
          <div className="tabs palette-groups">
            {Object.keys(groups).map((g) => (
              <button
                key={g}
                className={group === g ? "active" : ""}
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}
        <div
          className={`action-palette ${category !== "기본" ? "wide-actions" : ""}`}
        >
          {actions.map((a) => (
            <button
              key={a}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/fluxkey-action", actionValue(a))
              }
              onClick={() => apply(a)}
              disabled={!s.selected.length}
              title={`${actionValue(a)} 매핑`}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="hint">
          클릭하면 선택 키에 적용 · 키보드로 드래그하면 해당 키에 적용
        </p>
        {["멀티미디어", "조명", "제어", "마우스"].includes(category) && (
          <p className="source-note">
            원본의 아이콘 슬롯을 대응시킨 데모입니다. 이름은 아이콘 식별자로
            해석했으며 실제 HID 코드는 포함하지 않습니다.
          </p>
        )}
      </div>
    </section>
  );
}
