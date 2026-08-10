/**
 * 워크플로우 가이드 데이터 — "분야당 최선 1개" 원칙.
 * 원천: Job_Workflow_Guide_v4.html (유재원 제작, 2026-08-07 큐레이션).
 * 스타 수·Winget 검증은 그 시점 실측값이다 — 지어낸 수치 아님.
 *
 * 2026-08-10 재실측(GitHub API·winget show)에서 세 가지를 고쳤다:
 * - ImageMagick 별 수가 4.4만으로 적혀 있었으나 실제 1.7만 → 정정
 *   ("가짜 사회적 증거 금지" 원칙 위반이었음)
 * - hledger 설치 명령 `winget install hledger`는 실패한다 → `simonmichael.hledger`
 * - 나머지 별 수는 오늘 값으로 갱신
 * 별 수를 고칠 때는 반드시 `gh api repos/<repo> --jq .stargazers_count`로 다시 재고,
 * 설치 명령은 `winget show --id <id> --exact`로 존재를 확인한 뒤 적는다.
 *
 * 화면의 "MS 검증" 배지는 모든 레시피가 winget 등재 패키지라는 전제에 기대고 있다.
 * ponytail: winget에 없는 도구를 추가하는 순간 배지가 거짓이 된다 —
 * 그때 recipe에 verified 필드를 만들어 분기할 것. 지금은 전부 참이라 필드를 두지 않는다.
 * (n8n·Stirling-PDF는 winget 패키지가 없어 이 가이드에 넣지 않았다. tools.html 랭킹에만 둔다.)
 *
 * 눈높이 3단계: 같은 레시피를 다르게 렌더한다.
 * - easy:   명령어 숨김. "자녀·지인에게 부탁하기" 경로 제공 (부탁 메시지 복사)
 * - mid:    쉬운 설명 + 복사 가능한 명령어 + AI 프롬프트
 * - pro:    명령어 위주
 */

export interface GuideRecipe {
  id: string;
  goalChip: string;      // Q1 칩 (사용자 언어)
  icon: string;
  title: string;         // 눈높이 제목
  oneLiner: string;      // 이걸 쓰면 뭐가 좋아지는가 (쉬운 말)
  whyBest: string;       // 왜 이게 최선인가 — 큐레이션 근거 (실측)
  easySteps: string[];   // 명령어 없는 설명
  installCmd: string;
  runCmd: string;
  aiPrompt: string;      // 같이 쓰는 AI 프롬프트
  repo: string;
  stars: string;         // GitHub 별 수 — v5 실측값(2026-08-08). 진짜 사회적 증거
}

/* 실력을 자백하게 하지 않는다("문서 작업 정도 해요"는 자존감 원칙 위반).
 * 대신 원하는 설명 방식을 고르게 한다 — 같은 정보, 다른 눈높이. */
export const SKILL_CHIPS = [
  { emoji: '💬', label: '뭐가 좋아지는지 쉽게' },
  { emoji: '📋', label: '따라 할 수 있게 자세히' },
  { emoji: '⚡', label: '핵심만 빠르게' },
];
export type SkillLevel = 'easy' | 'mid' | 'pro';
export const SKILL_MAP: Record<string, SkillLevel> = {
  '뭐가 좋아지는지 쉽게': 'easy',
  '따라 할 수 있게 자세히': 'mid',
  '핵심만 빠르게': 'pro',
};

export const GUIDES: GuideRecipe[] = [
  {
    id: 'research', goalChip: '시장·경쟁 조사', icon: '🕸️',
    title: '경쟁 업체 소식, 자동으로 모아보기',
    oneLiner: '경쟁 가게·업체 홈페이지의 새 글과 가격 정보를 사람이 일일이 열어보지 않고 자동으로 모읍니다.',
    whyBest: '같은 용도 도구 중 사용자가 가장 많고(GitHub 별 16.5만 개) 마이크로소프트 검증을 받은 도구라 골랐습니다.',
    easySteps: [
      'firecrawl.dev에서 무료로 가입해 열쇠(API 키) 하나를 받습니다 — 이 도구만 가입이 필요합니다',
      '경쟁 업체 홈페이지 주소를 정합니다',
      '도구가 그 페이지의 글·가격을 자동으로 긁어와 문서로 만듭니다',
      'AI에게 "이 자료에서 우리가 파고들 빈틈을 찾아줘"라고 부탁합니다',
    ],
    // 2026-08-10 정정: `@mendable/firecrawl-cli`는 npm에 없다(404). 실제 패키지는 `firecrawl-cli`,
    // 실행 파일 이름은 그대로 `firecrawl`이다. 무료 한도가 있지만 가입·API 키가 필요하다.
    installCmd: 'npm install -g firecrawl-cli\nwinget install --id jqlang.jq',
    runCmd: "firecrawl scrape https://경쟁사.com | jq '.content'",
    aiPrompt: '아래 긁어온 경쟁사 데이터를 분석해서, 우리가 써먹을 수 있는 빈틈 키워드 5개를 뽑아줘.',
    repo: 'mendableai/firecrawl', stars: '16.5만',
  },
  {
    id: 'notes', goalChip: '메모·회의록 정리', icon: '🧠',
    title: '쌓인 메모에서 0.1초 만에 찾아내기',
    oneLiner: '수백 개 메모·회의록을 한 폴더에 두고, 단어 하나로 구글처럼 검색합니다.',
    whyBest: '텍스트 검색 도구 중 가장 빠르고 널리 검증됨(별 6.7만, MS 검증). 설치도 한 줄이라 골랐습니다.',
    easySteps: [
      '메모·회의록 파일을 한 폴더에 모읍니다',
      '찾고 싶은 단어로 검색하면 어느 파일 몇째 줄인지 바로 나옵니다',
      'AI에게 "이 녹취록을 배경·목표·할일로 정리해줘"라고 부탁하면 정리까지 됩니다',
    ],
    installCmd: 'winget install BurntSushi.ripgrep.MSVC',
    runCmd: "rg '마케팅 타겟' my_notes/",
    aiPrompt: '아래 두서없는 회의 녹취록을 [배경, 목표, 액션아이템] 구조로 정리해줘.',
    repo: 'BurntSushi/ripgrep', stars: '6.7만',
  },
  {
    id: 'images', goalChip: '사진 대량 작업', icon: '🖼️',
    title: '사진 수백 장, 한 번에 줄이기',
    oneLiner: '폴더 안 사진 전부를 한 번에 크기 줄이고 형식 바꿉니다. 포토샵 없이.',
    whyBest: '30년 넘게 쓰여 온 이미지 일괄 처리의 사실상 표준입니다(별 1.7만, MS 검증). 별 수는 요즘 도구보다 적지만, 오래 버틴 도구라 자료와 사용법이 가장 많습니다.',
    easySteps: [
      '작업할 사진을 한 폴더에 모읍니다',
      '도구가 폴더 전체를 한 번에 원하는 크기·형식으로 바꿉니다',
      '홈페이지·카드뉴스에 바로 쓸 수 있는 용량이 됩니다',
    ],
    installCmd: 'winget install sharkdp.fd\nwinget install ImageMagick.ImageMagick',
    runCmd: 'fd -e png -x magick {} -resize 50% {.}.jpg',
    aiPrompt: '현재 폴더의 모든 PNG를 가로 800px JPG로 일괄 변환하는 ImageMagick 명령어를 짜줘.',
    repo: 'ImageMagick/ImageMagick', stars: '1.7만',
  },
  {
    id: 'marketing', goalChip: '홍보물·카드뉴스', icon: '🎯',
    title: '글만 쓰면 카드뉴스가 수백 장',
    oneLiner: 'AI가 써준 홍보 문구를 디자인 툴 없이 곧바로 이미지 수백 장으로 뽑습니다.',
    whyBest: '디자인 툴을 배우지 않고 대량 제작이 되는 유일한 경로라 골랐습니다 (기반 도구 별 8.9만).',
    easySteps: [
      'AI에게 홍보 문구를 여러 장 써달라고 합니다',
      '도구가 그 글을 자동으로 카드뉴스 이미지로 만듭니다',
      '인스타·밴드에 바로 올립니다',
    ],
    installCmd: 'winget install --id astral-sh.uv',
    runCmd: 'uv run --with Pillow generate_cards.py',
    aiPrompt: '1인 창업가를 위한 마케팅 문구 4장을 짜고, [제목, 본문, 추천배경색] 형식의 텍스트로만 줘.',
    repo: 'astral-sh/uv', stars: '8.9만',
  },
  {
    id: 'finance', goalChip: '장부·돈 정리', icon: '🧾',
    title: '쓴 돈 적기만 하면 장부가 됩니다',
    oneLiner: '엑셀 수식과 싸우지 않고, 텍스트로 툭툭 적으면 재무제표가 나옵니다.',
    whyBest: '수십 년 유지된 검증된 방식(평문 회계)이라 골랐습니다. 다만 셋 중 가장 어렵습니다 — 급하지 않으면 마지막에 하세요.',
    easySteps: [
      '쓴 돈을 "날짜 · 쓴 곳 · 금액"으로 텍스트에 적습니다',
      '영수증 사진은 AI에게 읽혀서 그 형식으로 바꿉니다',
      '도구가 자동으로 잔액표·손익표를 만들어 줍니다',
    ],
    // `winget install hledger`는 패키지를 못 찾는다 (2026-08-10 확인). 장치 ID를 써야 한다.
    installCmd: 'winget install --id simonmichael.hledger',
    runCmd: 'hledger -f journal.txt balancesheet',
    aiPrompt: '다음 영수증을 읽고 날짜, 금액, 사용처를 [2026-08-08 * 식대 50000] 형태로 바꿔줘.',
    repo: 'simonmichael/hledger', stars: '4.6천',
  },
  {
    id: 'privateai', goalChip: 'AI 쓰고 싶은데 내 정보가 걱정', icon: '🔒',
    title: '내 컴퓨터 안에서만 도는 AI',
    oneLiner: '물어본 내용이 인터넷으로 나가지 않습니다. AI를 내 컴퓨터에 설치해서 쓰기 때문입니다. 월 요금도 없습니다.',
    whyBest: '내려받아 쓰는 AI 도구 중 사용자가 가장 많고(별 17.8만) 설치가 한 줄로 끝나 골랐습니다. 다만 컴퓨터가 오래됐으면 답이 느립니다 — 아래 작은 모델(2.4b)을 쓰세요.',
    easySteps: [
      'AI 프로그램을 컴퓨터에 설치합니다',
      '한국어를 잘하는 작은 AI 모델 하나를 내려받습니다 (약 1.6GB, 한 번만)',
      '그다음부터는 인터넷을 꺼도 씁니다. 이력서 문장, 편지, 요약을 시켜도 내용이 밖으로 안 나갑니다',
    ],
    installCmd: 'winget install --id Ollama.Ollama',
    runCmd: 'ollama run exaone3.5:2.4b',
    aiPrompt: '아래 내 경력 설명을 이력서에 넣을 문장 3개로, 과장 없이 담백하게 다듬어줘.',
    repo: 'ollama/ollama', stars: '17.8만',
  },
  {
    id: 'report', goalChip: '메모를 보고서 파일로', icon: '📄',
    title: '메모장에 쓴 글이 그대로 보고서가 됩니다',
    oneLiner: '메모로 적어둔 내용을 워드 문서로 한 번에 바꿉니다. 서식을 맞추느라 시간 쓰지 않습니다.',
    whyBest: '문서 형식 변환의 사실상 표준(별 4.6만, MS 검증)입니다. 워드·발표자료·웹문서를 도구 하나로 다 바꿀 수 있어 골랐습니다.',
    easySteps: [
      '회의나 생각을 메모장에 편하게 적습니다 (제목 줄 앞에 # 를 붙이면 제목이 됩니다)',
      '도구가 그 메모를 워드 파일로 바꿔 줍니다',
      'PDF가 필요하면 그 워드 파일을 열어 「PDF로 저장」하면 됩니다',
    ],
    installCmd: 'winget install --id JohnMacFarlane.Pandoc',
    // PDF로 바로 뽑으려면 별도 조판 프로그램이 필요해 초심자에게서 실패한다. docx로 끝낸다.
    runCmd: 'pandoc 회의록.md -o 보고서.docx',
    aiPrompt: '아래 두서없는 회의 메모를 [배경 / 결정한 것 / 할 일 / 담당 / 기한] 순서로 정리해줘. 제목 줄 앞에는 # 를 붙여줘.',
    repo: 'jgm/pandoc', stars: '4.6만',
  },
  // 빼기(2026-08-08): 개발 환경 항목 제거 — 5060 눈높이 대상이 아님.
  // 개발자용 도구는 tools.html(WorkflowHub v7 전체 랭킹)에서만 제공한다.
  // 빼기(2026-08-10): n8n(별 19.9만)·Stirling-PDF는 winget 패키지가 없어 설치가
  // npm/Docker다. 명령을 붙여넣었는데 실패하면 신뢰가 먼저 깨진다 — 랭킹에만 둔다.
];

