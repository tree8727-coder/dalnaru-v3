# /// script
# requires-python = ">=3.11"
# dependencies = ["playwright"]
# ///
"""지혜 남기기(아담) + 대조 체크(이브) 검증 — 실제 저장 없이 UI 계약만 확인.

  아담: 동의 없으면 버튼이 잠겨야 한다 / 분야+답변+동의를 채우면 열려야 한다
  이브: 대조 체크 후 저장하면 이력서에 '국민연금 가입증명서 대조' 배지가 붙어야 한다
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

with sync_playwright() as p:
    b = p.chromium.launch()

    # ── 아담: /wisdom ──
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(f"{BASE}/wisdom", wait_until="networkidle", timeout=60000)
    btn = pg.locator(".wisdom-btn")
    assert btn.is_disabled(), "빈 상태인데 버튼이 열려 있음"
    pg.locator(".wisdom-chip").first.click()
    pg.locator(".wisdom-input").first.fill("신입은 서두르다 안전 고리를 빼먹습니다. 아침마다 제가 직접 확인합니다.")
    assert btn.is_disabled(), "동의 없이 버튼이 열림 — saveWisdom 이전에 UI부터 뚫림"
    pg.locator(".wisdom-consent input").check()
    assert btn.is_enabled(), "조건을 다 채웠는데 버튼이 잠김"
    # 16px/48px 기준
    a = pg.evaluate("""() => {
      const small=[], tiny=[];
      document.querySelectorAll('button,a,input,textarea').forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.width&&r.height&&(r.width<24||r.height<24)) small.push(el.className);
      });
      document.querySelectorAll('main *').forEach(el=>{
        if(el.children.length) return;
        const t=(el.innerText||'').trim(); if(t.length<2) return;
        if(parseFloat(getComputedStyle(el).fontSize)<16) tiny.push(t.slice(0,18));
      });
      return {small,tiny};
    }""")
    assert not a["tiny"], f"16px 미만: {a['tiny']}"
    print("아담: 동의 게이트·조건 게이트·글자 기준 OK")
    pg.close()

    # ── 이브: 대조 체크 → 배지 ──
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(f"{BASE}/funnel", wait_until="networkidle", timeout=60000)
    for _ in range(45):
        pg.wait_for_timeout(1200)
        if pg.locator(".facts-input").count():
            break
        chips = pg.locator(".funnel-chip:not([disabled])")
        if chips.count():
            chips.first.click()
    inputs = pg.locator(".facts-input")
    inputs.nth(0).fill("대한건설(주)")
    inputs.nth(1).fill("2011.03 ~ 2024.08")
    pg.locator(".facts-verify input").check()
    pg.locator(".facts-btn").click()
    pg.wait_for_timeout(1000)
    badge = pg.locator(".resume-verified")
    assert badge.count() == 1, "대조 배지가 이력서에 안 붙음"
    assert "국민연금" in badge.inner_text()
    print("이브: 대조 체크 → 이력서 배지 OK")
    b.close()

print("\n통과")
