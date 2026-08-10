# /// script
# requires-python = ">=3.11"
# dependencies = ["playwright"]
# ///
"""퍼널 완주 → 회사명·기간 입력 → 이력서에 실제로 반영되는지 확인."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000/funnel"
ORG, PERIOD, TITLE, CERT = "대한건설(주)", "2011.03 ~ 2024.08", "현장소장", "건설안전기사 (2015)"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    pg.goto(URL, wait_until="networkidle", timeout=60000)

    for _ in range(45):
        pg.wait_for_timeout(1300)
        if pg.locator(".facts").count():
            break
        chips = pg.locator(".funnel-chip:not([disabled])")
        if chips.count():
            chips.first.click()
    else:
        print("완주 실패"); b.close(); raise SystemExit(1)

    print("제출용 사실 화면 도달")

    # 입력 전 이력서에 뭐가 적혀 있나
    before = pg.locator(".resume-doc, [class*=resume]").first.inner_text()[:400]

    inputs = pg.locator(".facts-input")
    for i, val in enumerate([ORG, PERIOD, TITLE, CERT]):
        inputs.nth(i).fill(val)

    pg.locator(".facts-btn").click()
    pg.wait_for_timeout(1200)

    body = pg.locator("body").inner_text()
    print(f"\n회사명 반영: {'O' if ORG in body else 'X'}")
    print(f"기간 반영:   {'O' if PERIOD in body else 'X'}")
    print(f"직책 반영:   {'O' if TITLE in body else 'X'}")
    print(f"자격증 반영: {'O' if CERT in body else 'X'}")
    print(f"이전 표기('건설/건축 · ') 남아 있나: {'남음' if '건설/건축 · ' in body else '사라짐'}")

    # 접근성 측정
    a = pg.evaluate("""() => {
      const s = document.querySelector('.facts'); if (!s) return null;
      const small = [], tiny = [];
      s.querySelectorAll('button,input,a').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && r.height && (r.width < 44 || r.height < 44))
          small.push(el.innerText.trim().slice(0,18) || el.tagName);
      });
      s.querySelectorAll('*').forEach(el => {
        if (el.children.length) return;
        const t = (el.innerText||'').trim(); if (t.length < 2) return;
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px < 16) tiny.push(`${t.slice(0,18)} ${px}px`);
      });
      return {small, tiny};
    }""")
    if a:
        print(f"\n44px 미만: {a['small'] or '없음'}")
        print(f"16px 미만: {a['tiny'] or '없음'}")

    pg.locator(".facts").scroll_into_view_if_needed()
    pg.wait_for_timeout(300)
    pg.screenshot(path="facts-after.png")
    print("-> facts-after.png")
    b.close()
