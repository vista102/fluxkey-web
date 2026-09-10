import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1920, height: 980 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.dismiss());
const base = process.env.DEMO_URL || "http://127.0.0.1:3001/";
try {
  await page.goto(base);
  assert.equal(await page.locator(".key").count(), 61);
  for (const size of [
    { width: 1920, height: 980 },
    { width: 1173, height: 958 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    const m = await page.evaluate(() => {
      const a = document
        .querySelector('[data-physical-key="KEY_A"]')
        .getBoundingClientRect();
      return {
        w: a.width,
        h: a.height,
        overflow: document.documentElement.scrollWidth > innerWidth,
        rows: [...document.querySelectorAll(".key-row")].map(
          (r) => r.lastElementChild.getBoundingClientRect().right,
        ),
      };
    });
    assert.ok(Math.abs(m.w - m.h) < 1, JSON.stringify(m));
    assert.equal(m.overflow, false);
    assert.ok(Math.max(...m.rows) - Math.min(...m.rows) < 1);
  }
  await page.setViewportSize({ width: 1920, height: 980 });
  await page.getByRole("button", { name: "해제", exact: true }).click();
  await page.locator('[data-physical-key="DIGIT_5"]').click();
  await page
    .locator('[data-physical-key="DIGIT_8"]')
    .click({ modifiers: ["Shift"] });
  await page
    .locator('[data-physical-key="DIGIT_2"]')
    .click({ modifiers: ["Shift"] });
  assert.equal(await page.locator(".key.selected").count(), 7);
  await page.getByRole("button", { name: "해제", exact: true }).click();
  const a = await page.locator('[data-physical-key="KEY_A"]').boundingBox(),
    d = await page.locator('[data-physical-key="KEY_D"]').boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(d.x + d.width / 2, d.y + d.height / 2, { steps: 15 });
  await page.mouse.up();
  assert.equal(await page.locator(".key.selected").count(), 3);
  await page.getByRole("button", { name: "해제", exact: true }).click();
  await page.locator('[data-physical-key="KEY_W"]').click();
  const slider = page.locator(".inspector input[type=range]").first();
  await slider.focus();
  await slider.press("ArrowRight");
  assert.equal(await slider.inputValue(), "0.301");
  const bb = await slider.boundingBox();
  await page.mouse.click(bb.x + bb.width * 0.6, bb.y + bb.height / 2);
  assert.ok(Number(await slider.inputValue()) > 2);
  await page.getByRole("button", { name: "Fn Layer", exact: true }).click();
  await page.getByRole("button", { name: "기능", exact: true }).click();
  await page.getByTitle("F1 매핑", { exact: true }).click();
  assert.equal(
    await page.locator('[data-physical-key="KEY_W"] span').textContent(),
    "F1",
  );
  await page.getByRole("button", { name: "Main Layer", exact: true }).click();
  assert.equal(
    await page.locator('[data-physical-key="KEY_W"] span').textContent(),
    "W",
  );
  await page
    .getByRole("button", { name: "ACTUATION 입력 지점", exact: true })
    .click();
  await page
    .locator(".inspector")
    .getByRole("switch", { name: "래피드 트리거", exact: true })
    .click();
  assert.equal(
    await page
      .locator(".inspector")
      .getByRole("slider", { name: "누름 감도", exact: true })
      .isDisabled(),
    true,
  );
  await page
    .locator(".inspector")
    .getByRole("slider", { name: "입력 지점", exact: true })
    .press("ArrowRight");
  assert.equal(
    await page
      .locator(".sidebar")
      .getByText("RAPID TRIGGER", { exact: true })
      .count(),
    0,
  );
  assert.equal(await page.locator(".editor input[type=range]").count(), 0);
  await page.getByRole("button", { name: "트래킹 시작", exact: true }).click();
  await page.waitForFunction(() =>
    document.querySelector(".tracking-wave")?.getAttribute("d")?.includes(" L"),
  );
  await page.getByRole("button", { name: "일시정지", exact: true }).click();
  const frozen = await page.locator(".tracking-wave").getAttribute("d");
  await page.waitForTimeout(200);
  assert.equal(await page.locator(".tracking-wave").getAttribute("d"), frozen);
  await page.setViewportSize({ width: 1173, height: 958 });
  await page.screenshot({ path: "tests/tracking.png", fullPage: true });
  await page.getByRole("button", { name: "기록 지우기", exact: true }).click();
  assert.equal(await page.locator(".tracking-wave").count(), 0);
  await page.setViewportSize({ width: 1920, height: 980 });
  await page.getByRole("button", { name: "RGB 조명", exact: true }).click();
  await page
    .getByRole("slider", { name: "밝기", exact: true })
    .press("ArrowLeft");
  assert.equal(
    await page.getByRole("slider", { name: "밝기", exact: true }).inputValue(),
    "79",
  );
  await page
    .getByRole("slider", { name: "속도", exact: true })
    .press("ArrowRight");
  assert.equal(
    await page.getByRole("slider", { name: "속도", exact: true }).inputValue(),
    "51",
  );
  await page.getByRole("button", { name: "장식 LED 1", exact: true }).click();
  assert.equal(
    await page.getByRole("slider", { name: "밝기", exact: true }).inputValue(),
    "80",
  );
  await page
    .getByRole("button", { name: "ADVANCED 고급 키", exact: true })
    .click();
  for (const t of ["SOCD", "DKS", "MPT", "MT", "TGL", "END", "RS"]) {
    await page
      .locator(".advanced-tabs button")
      .filter({ hasText: new RegExp(`^${t}`) })
      .click();
    await page
      .getByRole("button", { name: "선택 키에 적용", exact: true })
      .click();
  }
  await page
    .getByRole("button", { name: "MACROS 매크로", exact: true })
    .click();
  await page
    .getByRole("button", { name: "키 이벤트 추가", exact: true })
    .click();
  assert.equal(await page.locator(".event-list>div").count(), 3);
  await page.getByRole("button", { name: "기록 시작", exact: true }).click();
  await page.keyboard.press("KeyB");
  await page.keyboard.press("Escape");
  assert.ok((await page.locator(".event-list>div").count()) > 3);
  await page.getByRole("button", { name: "데모 저장", exact: true }).click();
  const saved = await page.evaluate(() =>
    localStorage.getItem("fluxkey-60-demo-v1"),
  );
  assert.ok(saved);
  await page.reload();
  await page
    .getByRole("button", { name: "MACROS 매크로", exact: true })
    .click();
  assert.ok((await page.locator(".event-list>div").count()) > 3);
  await page.getByLabel("프로필 선택", { exact: true }).selectOption("1");
  assert.equal(await page.locator(".event-list>div").count(), 0);
  await page
    .getByRole("button", { name: "PROFILES 내 구성", exact: true })
    .click();
  await page.locator("input[type=file]").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":87}'),
  });
  assert.ok(
    (await page.getByRole("status").innerText()).includes("현재 설정은 유지"),
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "valid.json",
    mimeType: "application/json",
    buffer: Buffer.from(saved),
  });
  assert.ok(
    (await page.getByRole("status").innerText()).includes("가져왔어요"),
  );
  for (const name of [
    "KEYMAP 키 매핑",
    "ACTUATION 입력 지점",
    "RGB 조명",
    "ADVANCED 고급 키",
    "MACROS 매크로",
    "PROFILES 내 구성",
    "DEVICE 장치 · 업데이트",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  }
  await page
    .getByRole("button", { name: "KEYMAP 키 매핑", exact: true })
    .click();
  await page.getByLabel("프로필 선택", { exact: true }).selectOption("0");
  await page.getByRole("button", { name: "알림 닫기", exact: true }).click();
  await page.screenshot({ path: "tests/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 1173, height: 958 });
  await page.screenshot({ path: "tests/compact.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "tests/mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 61 keys, square geometry, responsive overflow, additive Shift, drag, sliders, RT dependency, layers, zones, advanced editors, recording, profiles, persistence, import validation, all tabs; no runtime errors.",
  );
} finally {
  await browser.close();
}
