# /// script
# requires-python = ">=3.11"
# dependencies = ["playwright"]
# ///
"""퍼널을 끝까지 눌러 보고 NextSteps 화면을 확인·측정한다."""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/funnel"

MEASURE = r"""() => {
  const s = document.querySelector('.nextsteps');
  if (!s) return {found:false};
  const small = [];
  s.querySelectorAll('a, button').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width && r.height && (r.width < 44 || r.height < 44))
      small.push({t:el.innerText.trim().slice(0,20), w:Math.round(r.width), h:Math.round(r.height)});
  });
  const tiny = [];
  s.querySelectorAll('*').forEach(el => {
    if (el.children.length) return;
    const t = (el.innerText||'').trim(); if (t.length < 2) return;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 16) tiny.push({t:t.slice(0,24), px:Math.round(px*10)/10});
  });
  return {found:true, small, tiny, h:Math.round(s.getBoundingClientRect().height)};
}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    pg.goto(URL, wait_until="networkidle", timeout=60000)

    for step in range(45):
        pg.wait_for_timeout(1400)
        if pg.locator(".nextsteps").count():
            print(f"[{step}] 완주 - NextSteps 도달")
            break
        chips = pg.locator(".funnel-chip:not([disabled])")
        if chips.count() == 0:
            continue
        print(f"[{step}] 클릭: {chips.first.inner_text().strip()[:22]}")
        chips.first.click()

    pg.wait_for_timeout(2500)
    r = pg.evaluate(MEASURE)
    if not r.get("found"):
        print("NextSteps 못 찾음 - 완주 전에 멈춤")
        pg.screenshot(path="walk-stuck.png", full_page=True)
    else:
        print(f"\nNextSteps 높이 {r['h']}px")
        print(f"44px 미만 터치영역: {r['small'] or '없음'}")
        print(f"16px 미만 글자: {r['tiny'] or '없음'}")
        box = pg.locator(".nextsteps").bounding_box()
        pg.screenshot(path="walk-nextsteps.png",
                      clip={"x": 0, "y": box["y"], "width": 390, "height": min(box["height"], 2600)})
        print("-> walk-nextsteps.png")
    b.close()
