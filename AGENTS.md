# 달나루 앱 (dalnaru-v3)

## 상위 규약은 vault에 있다

코드를 쓰기 전에 vault를 먼저 읽는다. 이 저장소에는 **구현만** 있다.

| 무엇 | 어디 |
| --- | --- |
| 업무 규약 (저장 필터·출처 규칙·네이밍) | `vault/AGENTS.md` |
| 브랜드·디자인 규칙, 디자인 토큰 근거 | `vault/AI-Sessions/wiki/design/` |
| 결정과 **기각 사유** | `vault/AI-Sessions/wiki/decisions/` |
| 구현할 작업 명세 | `vault/AI-Sessions/wiki/dev-tasks/` |
| 다시 하면 안 되는 실패 | `vault/AI-Sessions/wiki/errors/` |

vault는 `dalnaru.code-workspace`로 이 저장소와 함께 열린다.
워크스페이스로 열지 않았다면 실제 경로는
`C:\Users\tree0\OneDrive\Desktop\Projects\dalnaru` 이고,
원격은 https://github.com/tree8727-coder/dalnaru-vault (비공개) 다.

## 여기서 하지 않는 것

- **브랜드 값을 새로 정하지 않는다.** 컬러·폰트·로고·마스코트 규칙은 vault `wiki/design/`에서 가져온다. 거기에 없으면 지어내지 말고 사람에게 묻는다.
- **제품 방향과 기능 범위를 결정하지 않는다.** 결정은 vault `wiki/decisions/`에 근거와 함께 남는다. 여기서 정하면 근거가 사라진다.
- **수집 합법성을 판정하지 않는다.** 크롤링·외부 데이터는 정회광의 판단이 먼저다 (vault 규약 10장).

## 작업을 끝낼 때

`HANDOVER.md`를 갱신한다. 세 가지만 적으면 된다.

1. 무엇을 바꿨는가
2. 왜 그렇게 했는가 (다른 선택지를 버린 이유)
3. 사람이 확인해야 하는 것

Claude Code가 이 파일을 읽어 vault에 `save`한다. 여기 안 적으면 판단 근거가 사라진다.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
