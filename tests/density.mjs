import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:3001/");
  for (const size of [
    { width: 1920, height: 969 },
    { width: 1173, height: 958 },
  ]) {
    await page.setViewportSize(size);
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
      const dimensions = await page.evaluate(() => ({
        workspace: (() => {
          const e = document.querySelector(".workspace");
          return e.scrollHeight - e.clientHeight;
        })(),
        inspector: (() => {
          const e = document.querySelector(".inspector");
          return e ? e.scrollHeight - e.clientHeight : 0;
        })(),
        horizontal: document.documentElement.scrollWidth - innerWidth,
      }));
      console.log(size.width, name, dimensions);
      assert.equal(dimensions.horizontal, 0);
      assert.ok(dimensions.inspector <= 1);
      if (size.width === 1920)
        assert.ok(
          dimensions.workspace <= 1,
          JSON.stringify({ name, ...dimensions }),
        );
      if (name === "RGB 조명")
        await page.screenshot({ path: `tests/density-${size.width}.png` });
      if (name === "ADVANCED 고급 키") {
        for (const mode of ["SOCD", "DKS", "MPT", "MT", "TGL", "END", "RS"]) {
          await page
            .locator(".advanced-tabs button")
            .filter({ hasText: new RegExp(`^${mode}`) })
            .click();
          const overflow = await page
            .locator(".workspace")
            .evaluate((e) => e.scrollHeight - e.clientHeight);
          console.log(size.width, mode, overflow);
          if (mode === "DKS")
            await page.screenshot({ path: `tests/advanced-${size.width}.png` });
        }
      }
    }
  }
} finally {
  await browser.close();
}
