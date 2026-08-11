# /// script
# requires-python = ">=3.11"
# dependencies = ["playwright"]
# ///
"""달나루 접근성 실측 — 고령층 기준으로 화면을 잰다.

기준 (고령층친화 디지털 접근성 / WCAG 2.1 AA)
  터치영역  44x44px 이상
  본문글자  16px 이상
  대비      본문 4.5:1, 큰글씨(18.66px+bold 또는 24px+) 3:1 이상
"""
import json
import sys
from playwright.sync_api import sync_playwright

BASE = "https://dalnaru.vercel.app"
PAGES = ["/", "/funnel", "/calc", "/call", "/guide", "/gift", "/wisdom", "/partners"]

JS = r"""() => {
  const lum = (c) => { const [r,g,b] = c.map(v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); });
                       return 0.2126*r + 0.7152*g + 0.0722*b; };
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if(!m) return null;
                         const p = m[1].split(',').map(x=>parseFloat(x));
                         return {rgb:[p[0],p[1],p[2]], a: p.length>3 ? p[3] : 1}; };
  const bgOf = (el) => { let n = el;
    while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.5) return c.rgb; n = n.parentElement; }
    return [255,255,255]; };
  const ratio = (a,b) => { const l1 = lum(a), l2 = lum(b);
    return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)); };

  const tap = [], font = [], contrast = [];
  // 터치 영역
  document.querySelectorAll('button, a[href], [role="button"], input, select').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.width < 44 || r.height < 44)
      tap.push({t:(el.innerText||el.getAttribute('aria-label')||el.tagName).trim().slice(0,26),
               w:Math.round(r.width), h:Math.round(r.height)});
  });
  // 글자 크기 + 대비 (실제 텍스트를 가진 잎 노드만)
  document.querySelectorAll('body *').forEach(el => {
    if (el.children.length > 0) return;
    const txt = (el.innerText||'').trim();
    if (txt.length < 2) return;
    const st = getComputedStyle(el);
    const fs = parseFloat(st.fontSize);
    const w = parseInt(st.fontWeight) || 400;
    if (fs < 16) font.push({t:txt.slice(0,26), px:Math.round(fs*10)/10});
    const fg = parse(st.color); if (!fg) return;
    const cr = ratio(fg.rgb, bgOf(el));
    const big = fs >= 24 || (fs >= 18.66 && w >= 700);
    const need = big ? 3 : 4.5;
    if (cr < need) contrast.push({t:txt.slice(0,26), px:Math.round(fs), r:Math.round(cr*100)/100, need});
  });
  return {tap, font, contrast,
          hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          height: document.body.scrollHeight};
}"""


def main():
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        for path in PAGES:
            pg = b.new_page(viewport={"width": 390, "height": 844})
            try:
                pg.goto(BASE + path, wait_until="networkidle", timeout=45000)
                pg.wait_for_timeout(2500)          # 타이핑 애니메이션이 끝나길 기다린다
                out[path] = pg.evaluate(JS)
            except Exception as e:
                out[path] = {"오류": f"{type(e).__name__}: {str(e)[:150]}"}
            pg.close()
        b.close()

    print(f"{'화면':<9}{'작은버튼':>7}{'작은글자':>7}{'대비미달':>7}{'높이':>8}")
    print("-" * 40)
    for path, r in out.items():
        if "오류" in r:
            print(f"{path:<9}  {r['오류']}")
            continue
        print(f"{path:<9}{len(r['tap']):>7}{len(r['font']):>7}{len(r['contrast']):>7}{r['height']:>7}px")

    print("\n── 44px 미만 터치영역 ──")
    seen = set()
    for path, r in out.items():
        for x in r.get("tap", []):
            k = (x["t"], x["w"], x["h"])
            if k in seen: continue
            seen.add(k)
            print(f"  {x['w']:>3}x{x['h']:<3}  {x['t']}")

    print("\n── 16px 미만 글자 ──")
    seen = set()
    for path, r in out.items():
        for x in r.get("font", []):
            if x["t"] in seen: continue
            seen.add(x["t"])
            print(f"  {x['px']:>5}px  {x['t']}")

    print("\n── 대비 미달 ──")
    seen = set()
    for path, r in out.items():
        for x in r.get("contrast", []):
            if x["t"] in seen: continue
            seen.add(x["t"])
            print(f"  {x['r']:>5}:1 (필요 {x['need']})  {x['px']}px  {x['t']}")

    json.dump(out, open("a11y.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("\n→ a11y.json")


if __name__ == "__main__":
    sys.exit(main())
