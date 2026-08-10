# /// script
# requires-python = ">=3.11"
# dependencies = ["playwright"]
# ///
"""음성 입력 검증 — 실제 마이크 없이 세 경로를 확인한다.

  1. 미지원 브라우저(삼성 인터넷 상황) → 마이크 버튼이 아예 없어야 한다
  2. 지원 브라우저 + 인식 성공(mock)   → 말한 텍스트가 칸에 들어가야 한다
  3. 인식 결과가 자동 제출되지 않아야 한다 (버튼은 여전히 눌러야 함)
"""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/funnel"

UNSUPPORTED = "delete window.SpeechRecognition; delete window.webkitSpeechRecognition;"
MOCK = """
delete window.SpeechRecognition;
window.webkitSpeechRecognition = class {
  constructor(){ this.lang=''; this.interimResults=false; this.maxAlternatives=1;
                 this.onresult=null; this.onerror=null; this.onend=null; }
  start(){ setTimeout(() => {
    this.onresult && this.onresult({results:[[{transcript:'대한건설 주식회사'}]]});
    this.onend && this.onend();
  }, 300); }
  stop(){ this.onend && this.onend(); }
  abort(){}
};
"""


def walk_to_facts(pg):
    for _ in range(45):
        pg.wait_for_timeout(1200)
        if pg.locator(".facts-input").count():
            return True
        chips = pg.locator(".funnel-chip:not([disabled])")
        if chips.count():
            chips.first.click()
    return False


def run(init_script, label):
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 390, "height": 844})
        pg.add_init_script(init_script)
        pg.goto(URL, wait_until="networkidle", timeout=60000)
        assert walk_to_facts(pg), f"[{label}] 퍼널 완주 실패"
        mic = pg.locator(".facts-mic")
        n = mic.count()
        result = {"mics": n}
        if n:
            org_before = pg.locator(".facts-input").first.input_value()
            mic.first.click()
            pg.wait_for_timeout(900)
            result["org"] = pg.locator(".facts-input").first.input_value()
            result["org_before"] = org_before
            # 자동 제출 안 됨 — 저장 완료 문구가 나타나면 안 된다
            result["autosubmitted"] = pg.locator(".facts-done").count() > 0
        b.close()
        return result


# 1) 미지원 → 버튼 없음
r1 = run(UNSUPPORTED, "unsupported")
assert r1["mics"] == 0, f"미지원인데 마이크 버튼 {r1['mics']}개"
print("1. 미지원 브라우저: 마이크 버튼 없음 OK")

# 2) 지원 + 인식 성공 → 텍스트 반영, 자동 제출 없음
r2 = run(MOCK, "mock")
assert r2["mics"] == 4, f"마이크 버튼 4개여야 하는데 {r2['mics']}개"
assert r2["org"] == "대한건설 주식회사", f"인식 텍스트 미반영: {r2['org']!r}"
assert not r2["autosubmitted"], "인식 결과가 자동 제출됨 — 사용자가 확인할 기회가 없다"
print("2. 인식 성공: '대한건설 주식회사' 칸에 반영 OK")
print("3. 자동 제출 안 됨 OK")
print("\n통과")
