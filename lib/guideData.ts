/**
 * 워크플로우 가이드 데이터 — "분야당 최선 1개" 원칙.
 * 원천: Job_Workflow_Guide_v4.html (유재원 제작, 2026-08-07 큐레이션).
 * 스타 수·Winget 검증은 그 시점 실측값이다 — 지어낸 수치 아님.
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
}

export const SKILL_CHIPS = [
  { emoji: '📄', label: '문서 작업 정도 해요' },
  { emoji: '🔧', label: '설치 정도는 할 수 있어요' },
  { emoji: '💻', label: '개발 경험 있어요' },
];
export type SkillLevel = 'easy' | 'mid' | 'pro';
export const SKILL_MAP: Record<string, SkillLevel> = {
  '문서 작업 정도 해요': 'easy',
  '설치 정도는 할 수 있어요': 'mid',
  '개발 경험 있어요': 'pro',
};

export const GUIDES: GuideRecipe[] = [
  {
    id: 'research', goalChip: '시장·경쟁 조사', icon: '🕸️',
    title: '경쟁 업체 소식, 자동으로 모아보기',
    oneLiner: '경쟁 가게·업체 홈페이지의 새 글과 가격 정보를 사람이 일일이 열어보지 않고 자동으로 모읍니다.',
    whyBest: '같은 용도 도구 중 사용자가 가장 많고(GitHub 별 16만 개) 마이크로소프트 검증을 받은 도구라 골랐습니다.',
    easySteps: [
      '경쟁 업체 홈페이지 주소를 정합니다',
      '도구가 그 페이지의 글·가격을 자동으로 긁어와 문서로 만듭니다',
      'AI에게 "이 자료에서 우리가 파고들 빈틈을 찾아줘"라고 부탁합니다',
    ],
    installCmd: 'npm install -g @mendable/firecrawl-cli\nwinget install jqlang.jq',
    runCmd: "firecrawl scrape https://경쟁사.com | jq '.content'",
    aiPrompt: '아래 긁어온 경쟁사 데이터를 분석해서, 우리가 써먹을 수 있는 빈틈 키워드 5개를 뽑아줘.',
    repo: 'mendableai/firecrawl',
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
    repo: 'BurntSushi/ripgrep',
  },
  {
    id: 'images', goalChip: '사진 대량 작업', icon: '🖼️',
    title: '사진 수백 장, 한 번에 줄이기',
    oneLiner: '폴더 안 사진 전부를 한 번에 크기 줄이고 형식 바꿉니다. 포토샵 없이.',
    whyBest: '이미지 일괄 처리의 사실상 표준(별 4.4만, MS 검증)이라 골랐습니다.',
    easySteps: [
      '작업할 사진을 한 폴더에 모읍니다',
      '도구가 폴더 전체를 한 번에 원하는 크기·형식으로 바꿉니다',
      '홈페이지·카드뉴스에 바로 쓸 수 있는 용량이 됩니다',
    ],
    installCmd: 'winget install sharkdp.fd\nwinget install ImageMagick.ImageMagick',
    runCmd: 'fd -e png -x magick {} -resize 50% {.}.jpg',
    aiPrompt: '현재 폴더의 모든 PNG를 가로 800px JPG로 일괄 변환하는 ImageMagick 명령어를 짜줘.',
    repo: 'ImageMagick',
  },
  {
    id: 'marketing', goalChip: '홍보물·카드뉴스', icon: '🎯',
    title: '글만 쓰면 카드뉴스가 수백 장',
    oneLiner: 'AI가 써준 홍보 문구를 디자인 툴 없이 곧바로 이미지 수백 장으로 뽑습니다.',
    whyBest: '디자인 툴을 배우지 않고 대량 제작이 되는 유일한 경로라 골랐습니다 (기반 도구 별 8.8만).',
    easySteps: [
      'AI에게 홍보 문구를 여러 장 써달라고 합니다',
      '도구가 그 글을 자동으로 카드뉴스 이미지로 만듭니다',
      '인스타·밴드에 바로 올립니다',
    ],
    installCmd: 'winget install --id astral-sh.uv',
    runCmd: 'uv run --with Pillow generate_cards.py',
    aiPrompt: '1인 창업가를 위한 마케팅 문구 4장을 짜고, [제목, 본문, 추천배경색] 형식의 텍스트로만 줘.',
    repo: 'astral-sh/uv',
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
    installCmd: 'winget install hledger',
    runCmd: 'hledger -f journal.txt balancesheet',
    aiPrompt: '다음 영수증을 읽고 날짜, 금액, 사용처를 [2026-08-08 * 식대 50000] 형태로 바꿔줘.',
    repo: 'simonmichael/hledger',
  },
  {
    id: 'dev', goalChip: '개발 환경 갖추기', icon: '⚡',
    title: '폴더 순간이동 + 빠른 검색 세트',
    oneLiner: '탐색기 클릭 없이 원하는 폴더로 바로 이동하고, 무엇이든 0.1초에 찾습니다.',
    whyBest: '개발 속도를 가장 확실히 올려주는 기본기 조합(별 8.2만)이라 골랐습니다.',
    easySteps: [
      '이 항목은 개발 경험이 있는 분께 권합니다',
      '설치 후 폴더 이름 일부만 쳐도 바로 이동됩니다',
      '깃 관리는 lazygit, 터미널 꾸미기는 starship을 이어서 보세요',
    ],
    installCmd: 'winget install junegunn.fzf\nwinget install ajeetdsouza.zoxide',
    runCmd: 'z 내프로젝트',
    aiPrompt: '(개발 속도를 올려주는 기본 유틸리티 세트입니다)',
    repo: 'junegunn/fzf',
  },
];

