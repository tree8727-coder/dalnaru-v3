/**
 * 퍼널 대화 시나리오 + 이력서 생성 데이터.
 *
 * 이력서 구성은 경력기술서 표준을 따른다:
 * 기본정보 + 담당업무 + 수치화된 성과("문제→해결→결과", 수치 없으면 규모·기간·횟수로 대체).
 * 참고: 잡코리아 경력기술서 가이드, 링커리어 경력기술서 양식 (2026-08 확인)
 *
 * AI 백엔드 없이 결정적으로 생성한다. "AI가 분석했다"고 말하지 않는다.
 */

export interface Chip { emoji?: string; label: string }
export interface AchvOption { chip: string; title: string; bullets: string[] }

export type Answers = Partial<{
  field: string; years: string; role: string; orgSize: string;
  duty1: string; duty2: string; achv: string; achvNum: string;
  storyAchv: string;   // 자유 서술 — 성과에 얽힌 이야기 (암묵지 원석)
  hardMoment: string; overcome: string; proudMoment: string;
  knowhow: string;     // 자유 서술 — 후배에게 전할 요령 (업계 암묵지, B2B 핵심)
  tacit: string; style: string; cert: string; workType: string;
  needs: string;       // 자유 서술 — 지금 제일 답답한 것 (Unmet Needs, B2B 핵심)
  goal: string; name: string;
  eduLevel: string;    // 공고 지원 양식 완성 시에만 묻는다 (본 퍼널에서는 안 물음 — 짧게)

  /* ---------- 제출용 사실 (facts) ----------
   * 칩 선택만으로 만든 이력서는 같은 분야면 모두 같은 문서가 되어 제출이 불가능하다.
   * 인사담당자가 가장 먼저 확인하는 건 "어디서 언제까지"이고 그건 고를 수 없는 사실이다.
   * 그래서 이 넷만 직접 받는다 — 대화가 끝난 뒤, 선택 사항으로.
   * 국민연금 가입증명서(무료·본인 발급)에 사업장명과 기간이 그대로 나온다. */
  factOrg: string;      // 회사명 (예: 대한건설(주))
  factPeriod: string;   // 재직 기간 (예: 2011.03 ~ 2024.08)
  factTitle: string;    // 직책 (예: 현장소장)
  factCert: string;     // 실제 자격증명·취득연도
  factContact: string;  // 연락처 (제출용. 저장하지 않고 인쇄본에만 쓴다)
}>;

/** 제출 가능한 이력서가 되려면 최소한 이 둘은 있어야 한다. */
export function isSubmittable(a: Answers): boolean {
  return Boolean(a.factOrg?.trim() && a.factPeriod?.trim());
}

/* 공고 지원 양식(입사지원서)에 필요한 추가 항목.
 * 기업별 전용 양식 다운로드는 불가(로그인·저작물 — job-posting-sources 조사).
 * 대부분의 공고가 표준·자유 양식을 받으므로 표준 입사지원 양식으로 완성한다. */
export const EDU_CHIPS = ['고등학교 졸업', '전문대 졸업', '대학교 졸업', '대학원 이상'];

/* 답변이 이력서 어느 칸에 들어가는지 — 답할 때마다 "○○에 반영됨 ✓" 보상 표시용 */
export const REWARD_BY_KEY: Record<string, string> = {
  field: '경력 사항', years: '경력 사항', role: '경력 사항', orgSize: '경력 사항',
  duty1: '담당 업무', duty2: '담당 업무', achv: '주요 성과', achvNum: '주요 성과',
  storyAchv: '주요 경험', hardMoment: '주요 경험', overcome: '주요 경험', proudMoment: '주요 경험',
  knowhow: '주요 경험', tacit: '자기소개', style: '핵심 역량', cert: '자격 사항',
  workType: '희망 사항', needs: '서비스 개선 과제', goal: '희망 사항', eduLevel: '인적 사항',
};

/* ---------- 분야별 데이터 ---------- */

export const FIELD_CHIPS: Chip[] = [
  { emoji: '🏗️', label: '건설/건축' },
  { emoji: '⚙️', label: '기계/제조' },
  { emoji: '📊', label: '금융/영업' },
  { emoji: '🏫', label: '교육/연구' },
  { emoji: '🚚', label: '물류/유통' },
  { emoji: '✍️', label: '직접 입력할게요' },
];

const GENERIC_ACHV: AchvOption[] = [
  { chip: '조직·사람 관리', title: '조직 운영 전문가', bullets: ['수십 명 규모 조직의 목표 관리와 성과 창출', '세대를 아우르는 소통과 갈등 조정', '현장 중심의 실질적 리더십'] },
  { chip: '한 분야 기술 전문성', title: '베테랑 실무 전문가', bullets: ['이론이 아닌 몸으로 익힌 문제 해결 노하우', '신입이 3년 걸릴 판단을 즉시 내리는 경험치', '변화한 환경에도 통하는 기본기'] },
  { chip: '영업·고객 관리', title: '고객 신뢰 전문가', bullets: ['장기 거래처를 만들어 온 관계 자산', '거절을 계약으로 바꿔 온 협상 경험', '고객의 말하지 않는 니즈를 읽는 감각'] },
  { chip: '신사업·개척', title: '신사업 개척 리더', bullets: ['맨땅에서 시장을 만들어 본 실행력', '리스크를 계산하고 감수하는 판단력', '실패에서 배워 다시 세운 복원력'] },
];

export const ACHV_BY_FIELD: Record<string, AchvOption[]> = {
  '건설/건축': [
    { chip: '무사고 현장 운영', title: '안전 관리 마스터', bullets: ['수년간 무사고 현장 운영의 안전 관리 체계', '위험을 사전에 읽어내는 현장 감각', '작업자가 따르는 신뢰 기반 지휘'] },
    { chip: '대형 프로젝트 완수', title: '대형 프로젝트 리더', bullets: ['공기·품질·예산 3박자를 지켜 온 완수 이력', '수십 개 협력업체를 조율한 공정 관리', '돌발 변수에 대한 즉각 대응력'] },
    { chip: '후배·기능인력 양성', title: '현장 인재 양성가', bullets: ['도제식으로 전수해 온 실전 기술 교육', '초보를 숙련공으로 키워 낸 훈련 체계', '현장 언어로 가르치는 전달력'] },
    { chip: '원가·공정 개선', title: '원가 혁신 전문가', bullets: ['낭비를 찾아내는 공정 분석 눈썰미', '품질을 지키며 원가를 낮춘 개선 이력', '자재·인력 운용의 최적화 노하우'] },
  ],
  '기계/제조': [
    { chip: '품질 관리·불량 개선', title: '품질 관리 마스터', bullets: ['불량률을 잡아 온 원인 분석 체계', '데이터와 현장 감각을 결합한 품질 판단', '고객 클레임을 신뢰로 바꾼 대응력'] },
    { chip: '설비·라인 운영', title: '설비 운영 전문가', bullets: ['소리만 듣고도 이상을 감지하는 설비 감각', '가동률을 끌어올린 예방 정비 노하우', '라인 정지 손실을 최소화한 위기 대응'] },
    { chip: '생산성·공정 혁신', title: '공정 혁신 리더', bullets: ['병목을 찾아 생산성을 높인 개선 이력', '현장 작업자가 따라오는 변화 관리', '투자 없이 효율을 올리는 실전 최적화'] },
    { chip: '기술 전수·후배 양성', title: '기술 전수 전문가', bullets: ['암묵지를 매뉴얼로 만들어 온 문서화 역량', '숙련까지의 시간을 단축시킨 교육 체계', '기술의 이유까지 가르치는 깊이'] },
  ],
  '금융/영업': [
    { chip: '장기 고객 관리', title: '고객 자산 관리 전문가', bullets: ['십수 년 거래를 이어 온 신뢰 관리', '고객 생애 주기에 맞춘 제안 감각', '시장 변동기에 빛나는 리스크 안내'] },
    { chip: '영업 실적 상위권', title: '세일즈 마스터', bullets: ['꾸준히 상위권을 지켜 온 영업 체계', '거절의 이유를 계약의 근거로 바꾸는 화법', '소개가 소개를 부르는 관계 자산'] },
    { chip: '지점·조직 운영', title: '금융 조직 리더', bullets: ['목표와 사람을 함께 챙긴 지점 운영', '실적 압박 속에서도 이탈 없는 조직 관리', '숫자 너머의 고객을 보는 관점 전파'] },
    { chip: '리스크·심사 전문', title: '리스크 심사 전문가', bullets: ['서류 너머를 읽는 심사 눈썰미', '부실을 사전에 걸러 온 판단 기준', '규정과 현실 사이의 균형 감각'] },
  ],
  '교육/연구': [
    { chip: '수십 년 강의·교육', title: '교육 전문가', bullets: ['수천 명을 가르치며 다듬은 전달력', '수준별로 눈높이를 맞추는 설계 역량', '배움이 끝나도 기억되는 스승의 관점'] },
    { chip: '연구·개발 성과', title: 'R&D 전문가', bullets: ['가설부터 검증까지 완주해 온 연구 체계', '실패 데이터에서 방향을 찾는 끈기', '현장에 쓰이는 연구를 만든 실용 감각'] },
    { chip: '기관·학과 운영', title: '교육 행정 리더', bullets: ['예산·인력·평가를 함께 굴린 운영 경험', '이해관계자 사이의 조정 역량', '제도를 현장에 안착시킨 실행력'] },
    { chip: '진로·상담 지도', title: '진로 설계 전문가', bullets: ['수백 건의 진로 상담으로 쌓인 사례 데이터', '막연한 고민을 구체적 선택지로 바꾸는 힘', '세대가 달라도 통하는 경청의 기술'] },
  ],
  '물류/유통': [
    { chip: '물류센터·배송 운영', title: '물류 운영 마스터', bullets: ['성수기 물량을 무너짐 없이 소화한 운영력', '동선과 인력 배치의 최적화 노하우', '사고·분실을 줄여 온 관리 체계'] },
    { chip: '재고·구매 관리', title: '재고 최적화 전문가', bullets: ['결품과 과잉 사이의 균형을 지킨 발주 감각', '데이터와 경험을 결합한 수요 예측', '공급처와의 협상으로 원가를 지킨 이력'] },
    { chip: '매장·점포 운영', title: '유통 현장 전문가', bullets: ['입지·상권을 읽는 현장 데이터 감각', '아르바이트를 전력으로 만든 인력 운영', '고객 동선 하나까지 설계한 매장 관리'] },
    { chip: '거래처·상권 개척', title: '유통망 개척 리더', bullets: ['발로 뛰어 거래처를 늘려 온 개척 이력', '지역 상권의 생리를 꿰뚫는 정보력', '신뢰로 유지되는 장기 공급망'] },
  ],
};

export function getAchvOptions(field: string): AchvOption[] {
  return ACHV_BY_FIELD[field] ?? GENERIC_ACHV;
}

const DUTIES_BY_FIELD: Record<string, string[]> = {
  '건설/건축': ['공정·일정 관리', '안전 관리·감독', '협력업체 조율', '자재·원가 관리', '인력 배치·교육', '품질 검수'],
  '기계/제조': ['생산 라인 운영', '품질 검사·관리', '설비 점검·정비', '공정 개선', '작업자 교육', '자재·재고 관리'],
  '금융/영업': ['고객 상담·관리', '신규 고객 개척', '상품 제안·판매', '심사·리스크 관리', '지점·팀 운영', '실적·목표 관리'],
  '교육/연구': ['강의·교육 진행', '교육과정 설계', '연구·실험 수행', '학생·수강생 상담', '기관 운영·행정', '평가·품질 관리'],
  '물류/유통': ['입출고·재고 관리', '배송·운송 관리', '매장·점포 운영', '발주·구매 관리', '거래처 관리', '인력 운영'],
};
const GENERIC_DUTIES = ['조직·인력 관리', '고객·거래처 관리', '기술·실무 수행', '기획·개선 업무', '교육·후배 양성', '운영·행정 관리'];

export function getDutyChips(field: string): string[] {
  return DUTIES_BY_FIELD[field] ?? GENERIC_DUTIES;
}

/* 성과 수치화 꼬리질문 — 수치가 없으면 규모·기간·횟수로 대체 (경력기술서 표준) */
const ACHVNUM_BY_FIELD: Record<string, string[]> = {
  '건설/건축': ['무사고 5년 이상 유지', '최대 100명 규모 현장 지휘', '수십억 규모 프로젝트 완수', '공기 지연 없이 준공 다수'],
  '기계/제조': ['불량률 절반 이하로 개선', '라인 가동률 90% 이상 유지', '수십 명 작업자 관리', '연간 수억 원 원가 절감 기여'],
  '금융/영업': ['거래 고객 수백 명 관리', '목표 달성률 상위권 유지', '10년 이상 장기 고객 다수', '억 단위 계약 다수 성사'],
  '교육/연구': ['누적 수강생 수천 명', '강의 만족도 상위권 유지', '논문·보고서 다수 발표', '수백 건 상담 수행'],
  '물류/유통': ['일 수천 건 물량 처리', '재고 정확도 99% 유지', '수십 개 거래처 관리', '성수기 무사고 운영'],
};
const GENERIC_ACHVNUM = ['10년 이상 한 분야 유지', '수십 명 규모 조직 관리', '연 단위 목표 초과 달성', '숫자보다 신뢰로 증명'];

export function getAchvNumChips(field: string): string[] {
  return ACHVNUM_BY_FIELD[field] ?? GENERIC_ACHVNUM;
}

/* 암묵지 — B2B 데이터의 핵심. 칩은 마중물이고 직접입력이 진짜다 */
export const TACIT_CHIPS: Chip[] = [
  { label: '기본을 지키는 게 제일 빠르다' },
  { label: '사람을 남기는 게 일을 남기는 것' },
  { label: '현장의 답은 현장에 있다' },
  { label: '신뢰는 쌓는 데 10년, 잃는 건 하루' },
  { emoji: '✍️', label: '직접 입력할게요' },
];

export const STYLE_CHIPS = ['꼼꼼하다는 말을 많이 듣습니다', '책임감 하나는 자신 있습니다', '사람들과 두루 잘 지냅니다', '위기에 침착합니다'];

export const CERT_CHIPS: Chip[] = [
  { label: '국가기술자격 보유' },
  { label: '운전면허·중장비 가능' },
  { label: '컴퓨터·문서 작업 가능' },
  { label: '경력이 곧 자격입니다' },
  { emoji: '✍️', label: '직접 입력할게요' },
];

export const ORG_CHIPS = ['혼자 또는 소규모', '10명 안팎 조직', '수십 명 규모 조직', '100명 이상 조직'];
export const YEAR_CHIPS = ['10년 이하', '10년~20년', '20년~30년', '30년 이상 평생'];

/**
 * 연차 칩을 문장에 넣을 때 쓰는 표현.
 *
 * 라벨을 그대로 박으면 "10년 이하 동안 현장을 지켜온", "30년 이상 평생 동안" 처럼
 * 말이 안 되는 문장이 나온다 (2026-08-11 프로덕션 완주 테스트에서 확인).
 * 네 칩 중 둘이 그랬고, 그중 하나는 이 나이대에서 가장 많이 고를 항목이다.
 *
 * 값을 고른 기준 두 가지:
 * 1. "~ 동안" 뒤에 붙어도 말이 되어야 한다 ("10년 넘게 동안"은 비문이라 못 쓴다)
 * 2. **절대 부풀리지 않는다.** 3년 일한 사람이 '10년 이하'를 골랐는데 "10년 남짓"이
 *    되면 기업에 내는 문서에서 경력을 과장하는 셈이다. 그래서 '여러 해'로 둔다.
 *    '30여 년'은 40년 경력을 조금 줄여 말하지만, 넘겨 말하는 것보다 안전하다.
 *
 * 일자리 매칭(jobMatch)은 계속 원래 라벨로 비교한다 — 여기서 바꾸지 않는다.
 */
const YEARS_PHRASE: Record<string, string> = {
  '10년 이하': '여러 해',
  '10년~20년': '10여 년',
  '20년~30년': '20여 년',
  '30년 이상 평생': '30여 년',
};
const yearsPhrase = (y?: string): string => (y ? YEARS_PHRASE[y] ?? y : '');
export const ROLE_CHIPS = ['실무 전문가', '팀장·부장', '현장소장·공장장', '임원', '사장·대표'];
export const WORKTYPE_CHIPS = ['풀타임 정규직', '파트타임', '자문·프로젝트 단위', '형태는 상관없음'];
export const GOAL_CHIPS = ['재취업 준비', '파트타임·자문', '창업 준비', '후배 멘토링'];

/* ---------- 경청·칭찬 맞장구 ----------
 * 이 서비스는 서비스직이다. 답을 받으면 먼저 들었다는 표시와 칭찬을 하고
 * 다음 질문으로 넘어간다. 기계적 반복처럼 들리지 않게 답변 내용을 섞는다. */
export const ACK_BY_KEY: Partial<Record<keyof Answers, (label: string) => string>> = {
  field: (l) => `${l}이라, 좋은 분야에서 일해오셨네요.`,
  years: (l) => l.includes('30년') ? '평생을 한길로 걸어오셨네요 — 정말 대단하십니다.' : `${l}이면 결코 짧지 않은 세월입니다.`,
  role: (l) => `${l}까지 맡으셨다니, 어깨가 무거우셨겠습니다.`,
  orgSize: () => '그 규모를 이끌어오신 경험, 흔치 않습니다.',
  duty1: () => '중요한 일을 맡고 계셨네요.',
  achv: () => '그건 아무나 못 하는 일입니다.',
  achvNum: () => '숫자가 대표님을 대신 말해주네요. 훌륭합니다.',
  hardMoment: () => '그 시절, 애 많이 쓰셨습니다.',
  overcome: () => '그렇게 버텨내신 것이 진짜 실력입니다.',
  proudMoment: () => '듣기만 해도 뿌듯한 장면이네요.',
  tacit: () => '좋은 말씀입니다. 이력서에 꼭 담겠습니다.',
  style: () => '주변의 그 평가가 곧 증명이지요.',
  cert: () => '든든한 무기네요.',
  workType: () => '네, 알겠습니다.',
};

/* ---------- 대화 흐름 (config-driven) ---------- */

export interface FlowStep {
  key: keyof Answers;
  ask: (a: Answers) => string;       // 봇 질문 (직전 답 맞장구 포함)
  chips: (a: Answers) => Chip[];
  sentence: (label: string) => string; // 칩 → 채팅창 자동 타이핑 문장
  skipLabel?: string;                  // 이 라벨이면 건너뜀 (답 저장 안 함)
  input?: 'text';                      // 자유 서술 질문 — 칩 대신 글상자. 이 답이 데이터의 원석
}

const toChips = (ls: string[]): Chip[] => ls.map((label) => ({ label }));

export const FLOW: FlowStep[] = [
  {
    key: 'field',
    ask: () => '가장 오래 일하신 분야가 어디신가요?',
    chips: () => FIELD_CHIPS,
    sentence: (l) => `${l} 분야에서 오래 일했습니다.`,
  },
  {
    key: 'years',
    ask: () => '대략 어느 정도 기간 동안 몸담으셨나요?',
    chips: () => toChips(YEAR_CHIPS),
    sentence: (l) => `${l} 몸담았습니다.`,
  },
  {
    key: 'role',
    ask: () => '그 시간 동안 주로 어떤 역할을 맡으셨나요?',
    chips: () => toChips(ROLE_CHIPS),
    sentence: (l) => `${l}(으)로 일했습니다.`,
  },
  {
    key: 'orgSize',
    ask: () => '어느 정도 규모의 조직에서 일하셨나요?',
    chips: () => toChips(ORG_CHIPS),
    sentence: (l) => `${l}에서 일했습니다.`,
  },
  {
    key: 'duty1',
    ask: () => '주로 어떤 업무를 담당하셨나요? 제일 가까운 것 하나만 골라주세요.',
    chips: (a) => toChips(getDutyChips(a.field ?? '')),
    sentence: (l) => `${l} 업무를 주로 했습니다.`,
  },
  {
    key: 'duty2',
    ask: () => '하나 더 꼽는다면요? (이걸로 충분하시면 건너뛰셔도 됩니다)',
    chips: (a) => [...toChips(getDutyChips(a.field ?? '').filter((d) => d !== a.duty1)), { emoji: '👌', label: '이걸로 충분해요' }],
    sentence: (l) => `${l}도 함께 했습니다.`,
    skipLabel: '이걸로 충분해요',
  },
  {
    key: 'achv',
    ask: () => '이력서가 절반 넘게 채워졌습니다. 이제 제일 중요한 질문 — 딱 하나만 꼽는다면, 가장 자랑할 만한 것은 무엇인가요?',
    chips: (a) => toChips(getAchvOptions(a.field ?? '').map((o) => o.chip)),
    sentence: (l) => `${l}이(가) 제일 자랑스럽습니다.`,
  },
  {
    key: 'achvNum',
    ask: () => '멋집니다. 그 성과, 숫자나 규모로 하면 어느 쪽에 가장 가깝나요? (이력서는 숫자가 있어야 힘이 생깁니다)',
    chips: (a) => toChips(getAchvNumChips(a.field ?? '')),
    sentence: (l) => `${l} 정도 됩니다.`,
  },
  {
    key: 'hardMoment',
    ask: () => '이제부터는 이력서에 깊이를 넣는 질문입니다 — 그 세월 중 가장 큰 고비는 어떤 종류였나요?',
    chips: () => toChips(['사람 문제로 힘들 때', '실적·자금 압박', '사고·품질 문제', '조직 개편·구조조정']),
    sentence: (l) => `${l}이(가) 가장 큰 고비였습니다.`,
  },
  {
    key: 'overcome',
    ask: () => '다들 그 지점에서 무너지는데, 버텨내셨네요. 어떻게 넘기셨나요? (이 답이 이력서의 「위기 대응」 항목이 됩니다)',
    chips: () => toChips(['정면 돌파했습니다', '사람들과 함께 풀었습니다', '원칙대로 차근차근', '버티며 때를 기다렸습니다']),
    sentence: (l) => l,
  },
  {
    key: 'proudMoment',
    ask: () => '반대로, 지금 떠올려도 제일 뿌듯한 순간은 언제였나요?',
    chips: () => toChips(['키운 후배가 성장했을 때', '어려운 목표를 해냈을 때', '주변의 인정을 받았을 때', '큰 사고를 막아냈을 때']),
    sentence: (l) => `${l}가 제일 뿌듯합니다.`,
  },
  {
    key: 'tacit',
    ask: () => '그 세월에서 배운 것을 후배에게 딱 한 문장으로 전한다면요?',
    chips: () => TACIT_CHIPS,
    sentence: (l) => `"${l}" — 이 한마디입니다.`,
  },
  {
    key: 'style',
    // 도입부를 빼둔다 — 바로 앞 ACK(tacit)가 이미 "좋은 말씀입니다. 이력서에 꼭 담겠습니다."를
    // 말하고 있어서, 여기에 또 쓰면 봇이 같은 칭찬을 연달아 두 번 한다(2026-08-11 프로덕션 완주 확인).
    ask: () => '주변 분들은 대표님을 어떤 사람이라고 하나요?',
    chips: () => toChips(STYLE_CHIPS),
    sentence: (l) => `"${l}"라는 말을 듣습니다.`,
  },
  {
    key: 'cert',
    ask: () => '거의 다 왔습니다. 보유하신 자격증이나 특별히 내세울 무기가 있나요?',
    chips: () => CERT_CHIPS,
    sentence: (l) => `${l}.`,
  },
  {
    key: 'workType',
    ask: () => '앞으로는 어떤 형태로 일하고 싶으세요?',
    chips: () => toChips(WORKTYPE_CHIPS),
    sentence: (l) => `${l}를 생각하고 있습니다.`,
  },
  {
    key: 'goal',
    ask: () => '마지막 질문입니다. 이 경험을 앞으로 어디에 쓰고 싶으세요?',
    chips: () => toChips(GOAL_CHIPS),
    sentence: (l) => `${l}가 목표입니다.`,
  },
];

/* ---------- 이력서 지급 후 업그레이드 (자유 서술) ----------
 * 이탈 방지 설계: 타이핑 질문은 보상(이력서)을 받은 뒤에만 나온다.
 * 이미 내 이력서가 눈앞에 있으므로 "더 좋게 만들기" 동기로 자발적으로 쓴다.
 * 이 답들이 암묵지·Unmet Needs 원문 — B2B 데이터의 원석이다. */

export interface EnrichStep {
  key: keyof Answers;
  title: string;      // 카드 제목
  benefit: string;    // 답하면 이력서가 어떻게 좋아지는지
  ask: string;        // 열었을 때 안내 문구
}

export const ENRICH_STEPS: EnrichStep[] = [
  {
    key: 'storyAchv',
    title: '성과에 얽힌 이야기 더하기',
    benefit: '「주요 경험」에 대표님만의 일화가 인용됩니다 — 남들과 똑같은 이력서가 달라집니다',
    ask: '그 성과 뒤에 있던 이야기를 한두 문장만 들려주세요. 말씀하시듯 편하게요.',
  },
  {
    key: 'knowhow',
    title: '후배에게 전할 요령 남기기',
    benefit: '「전수 노하우」 항목이 생깁니다 — 가르칠 수 있는 사람임을 보여주는 항목입니다',
    ask: '후배가 같은 일을 맡는다면 꼭 알려주고 싶은 요령이나 순서, 한 줄이면 충분합니다.',
  },
  {
    key: 'needs',
    title: '지금 제일 답답한 것 알려주기',
    benefit: '이력서에는 안 들어가지만, 저희가 다음에 풀어드릴 숙제가 됩니다',
    ask: '요즘 다음 일을 준비하시면서 제일 답답하거나 아쉬운 점은 뭔가요? 솔직하게요.',
  },
];

/* ---------- 이력서 생성 ---------- */

const GOAL_PHRASE: Record<string, string> = {
  '재취업 준비': '새 일터에서 다시 증명하는 것',
  '파트타임·자문': '필요한 곳에 필요한 만큼 나누는 것',
  '창업 준비': '내 이름을 건 새 시작',
  '후배 멘토링': '다음 세대를 키우는 것',
};

/* 경험 일화 → 이력서 「주요 경험」 문장 변환 */
const HARD_PHRASE: Record<string, string> = {
  '사람 문제로 힘들 때': '사람 사이의 갈등',
  '실적·자금 압박': '실적과 자금의 압박',
  '사고·품질 문제': '사고와 품질 위기',
  '조직 개편·구조조정': '조직 개편의 격랑',
};
const OVERCOME_PHRASE: Record<string, string> = {
  '정면 돌파했습니다': '정면 돌파로',
  '사람들과 함께 풀었습니다': '사람들과 함께',
  '원칙대로 차근차근': '원칙을 지키며',
  '버티며 때를 기다렸습니다': '긴 호흡으로',
};
const PROUD_PHRASE: Record<string, string> = {
  '키운 후배가 성장했을 때': '후배 양성에서 보람을 찾아 온 사람입니다',
  '어려운 목표를 해냈을 때': '어려운 목표일수록 힘을 내는 사람입니다',
  '주변의 인정을 받았을 때': '묵묵한 일로 신뢰를 쌓아 온 사람입니다',
  '큰 사고를 막아냈을 때': '보이지 않는 곳에서 사고를 막아 온 사람입니다',
};

export interface Resume {
  name: string;
  title: string;          // [안전 관리 마스터]
  headline: string;       // 30년 건설/건축 현장소장
  goal: string;           // 희망 직무
  workType: string;       // 희망 근무 형태
  edu: string;            // 최종 학력 (공고 지원 양식에서만 채워짐)
  competencies: string[]; // 핵심역량 (성과 bullets + 스타일)
  career: {
    period: string; org: string; role: string;
    duties: string[]; achievement: string;
  } | null;
  experiences: string[];  // 주요 경험 (위기 대응·성취)
  certs: string;
  tacitQuote: string;     // 자기소개 핵심 한 줄
  summary: string;        // 경력 요약
}

export function buildResume(a: Answers): Resume {
  const achvOpt = getAchvOptions(a.field ?? '').find((o) => o.chip === a.achv);
  const duties = [a.duty1, a.duty2].filter(Boolean) as string[];

  const experiences: string[] = [];
  if (a.storyAchv) {
    experiences.push(`현장 일화 — “${a.storyAchv}”`);
  }
  if (a.hardMoment && a.overcome) {
    experiences.push(
      `위기 대응 — ${HARD_PHRASE[a.hardMoment] ?? a.hardMoment} 앞에서도 ${OVERCOME_PHRASE[a.overcome] ?? ''} 조직을 지켜낸 경험이 있습니다.`,
    );
  }
  if (a.proudMoment) {
    experiences.push(`성취 — ${PROUD_PHRASE[a.proudMoment] ?? a.proudMoment}.`);
  }
  if (a.knowhow) {
    experiences.push(`전수 노하우 — ${a.knowhow}`);
  }

  return {
    name: a.name || '',
    title: achvOpt ? `[${achvOpt.title}]` : '',
    headline: [yearsPhrase(a.years), a.field, a.role].filter(Boolean).join(' '),
    goal: a.goal ?? '',
    workType: a.workType ?? '',
    edu: a.eduLevel ?? '',
    competencies: [
      ...(achvOpt?.bullets ?? []),
      ...(a.style ? [a.style.replace(/라는 말을.*$/, '').replace(/"/g, '')] : []),
    ].slice(0, 4),
    career: a.field
      ? {
          // 실제로 입력한 사실이 있으면 그것이 우선. 없으면 분류로 대체하되
          // 그 상태는 제출용이 아니며 화면에서 그렇게 안내한다(isSubmittable).
          period: a.factPeriod?.trim() || yearsPhrase(a.years),
          org: a.factOrg?.trim() || [a.field, a.orgSize].filter(Boolean).join(' · '),
          role: a.factTitle?.trim() || a.role || '',
          duties,
          achievement: [a.achv, a.achvNum].filter(Boolean).join(' — '),
        }
      : null,
    experiences,
    certs: a.factCert?.trim()
      || (a.cert === '경력이 곧 자격입니다'
            ? `별도 자격 대신 ${yearsPhrase(a.years)} 실무 경력으로 증명`
            : (a.cert ?? '')),
    tacitQuote: a.tacit ?? '',
    summary: a.field
      ? `${yearsPhrase(a.years)} 동안 ${a.field} 현장을 지켜온 ${a.role ?? '전문가'}입니다. ` +
        (a.achvNum ? `${a.achvNum}의 기록이 제 일하는 방식을 증명합니다. ` : '') +
        (a.goal ? `이제 그 경험으로 ${GOAL_PHRASE[a.goal] ?? '새로운 시작'}을 준비하고 있습니다.` : '')
      : '',
  };
}

/* ---------- 가족 공유용 회고 카드 ----------
 * 같은 대화에서 두 번째 출구: 기업엔 이력서, 가족엔 회고.
 * 근거: 0806 회의 참고문헌 5 — "수익 이상으로 본인 지식이 쓰인다는 효능감.
 * 자서전·회고록 기반이 트래픽 유입의 핵심" */
export interface Memoir {
  title: string;       // ○○년, 하나의 길
  headline: string;
  crisis: string;      // 고비와 극복
  proud: string;       // 뿌듯했던 순간
  story: string;       // 본인 육성 일화
  lesson: string;      // 후배에게 남기는 한 문장
  closing: string;
}

export function buildMemoir(a: Answers): Memoir {
  return {
    title: `${yearsPhrase(a.years)}, 하나의 길`,
    headline: [a.field, a.role].filter(Boolean).join('의 ') + (a.name ? ` — ${a.name}` : ''),
    crisis: a.hardMoment && a.overcome
      ? `${HARD_PHRASE[a.hardMoment] ?? a.hardMoment} 앞에서도 ${OVERCOME_PHRASE[a.overcome] ?? ''} 버텨냈습니다.`
      : '',
    proud: a.proudMoment ? `가장 뿌듯했던 순간은 ${a.proudMoment.replace(/때$/, '때였습니다')}.` : '',
    story: a.storyAchv ?? '',
    lesson: a.tacit ?? '',
    closing: '이 길을 걸어온 당신께, 수고하셨습니다.',
  };
}

/* 이력서 완성도(%) — 게이지용 */
export function resumeProgress(a: Answers): number {
  const keys: (keyof Answers)[] = ['field', 'years', 'role', 'orgSize', 'duty1', 'achv', 'achvNum', 'hardMoment', 'overcome', 'proudMoment', 'tacit', 'style', 'cert', 'workType', 'goal'];
  const filled = keys.filter((k) => a[k]).length;
  return Math.round((filled / keys.length) * 100);
}

/* 티저용 샘플 */
export const SAMPLE_ANSWERS: Answers = {
  field: '건설/건축', years: '30년 이상 평생', role: '현장소장·공장장', orgSize: '수십 명 규모 조직',
  duty1: '공정·일정 관리', duty2: '안전 관리·감독', achv: '무사고 현장 운영', achvNum: '무사고 5년 이상 유지',
  storyAchv: '장마철에 다들 공기 맞추라고 밀어붙일 때, 하루를 세워서라도 비계부터 다시 잡았습니다. 그 현장이 무사고로 끝났습니다',
  hardMoment: '사고·품질 문제', overcome: '원칙대로 차근차근', proudMoment: '큰 사고를 막아냈을 때',
  knowhow: '아침에 현장 한 바퀴를 돌 때 어제와 달라진 것부터 찾아라',
  tacit: '현장의 답은 현장에 있다', style: '책임감 하나는 자신 있습니다', cert: '국가기술자격 보유',
  workType: '파트타임', goal: '후배 멘토링', name: '김ㅇㅇ',
};
