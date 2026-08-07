/**
 * 일자리 추천 — 실제 시니어 채용 직종 분포 기반의 예시 공고 풀 + 결정적 적합도 계산.
 *
 * 직종 분포 근거 (2026-08 확인, 한국경제 보도 — 중장년 플랫폼 공고 분포):
 * 생산·품질검사 31.7% > 서빙·주방 21.8% > 영업·상담 17.7% > 매장관리 15.7% >
 * 운전·배달 10.7% + 시설관리·경비·아파트 관리소장 수요.
 *
 * ⚠ 정직성: 실존 회사명을 지어내지 않는다. 회사는 익명("중견 식품제조사")으로 쓰고
 * 모든 공고에 "예시 공고" 라벨을 붙인다. 실제 공고 연동(고용24 API 등)은 후속 작업.
 */
import type { Answers } from './funnelData';

export interface JobPosting {
  id: string;
  category: string;   // 실제 분포상의 직종
  title: string;
  company: string;    // 예시 풀은 익명, 워크넷은 실명(실데이터)
  workTypes: string[];
  fields: string[];   // 잘 맞는 출신 분야
  seniorRoles: boolean; // 관리자 출신 우대 여부
  summary: string;
  requirements: string[]; // 맞춤 이력서에서 강조할 요구 역량
  url?: string;       // 워크넷 실공고 링크
}

/* /api/jobs가 돌려주는 워크넷 실공고 형태 */
export interface WorknetJob {
  id: string; title: string; company: string; category: string;
  region: string; salary: string; career: string; url: string; closeDt: string;
}

/** 워크넷 실공고 → 카드. 점수는 분야 키워드 검색 결과라는 사실에 기반한 보수적 값 */
export function matchWorknet(jobs: WorknetJob[], a: Answers, top = 3): JobMatch[] {
  const longCareer = ['20년~30년', '30년 이상 평생'].includes(a.years ?? '');
  return jobs.slice(0, 10).map((j) => ({
    job: {
      id: j.id, category: j.category || '워크넷', title: j.title, company: j.company,
      workTypes: [], fields: [], seniorRoles: false,
      summary: [j.region, j.salary, j.career, j.closeDt && `마감 ${j.closeDt}`].filter(Boolean).join(' · '),
      requirements: [], url: j.url || undefined,
    },
    score: Math.min(90, 68 + (longCareer ? 7 : 0)),
    reasons: [`${a.field ?? ''} 키워드로 검색된 실제 공고`].filter(Boolean),
  })).slice(0, top);
}

export const JOB_POOL: JobPosting[] = [
  {
    id: 'qc', category: '생산·품질검사', title: '생산품질 검사원 (시니어 우대)', company: '중견 식품제조사',
    workTypes: ['풀타임 정규직', '파트타임'], fields: ['기계/제조', '물류/유통'], seniorRoles: false,
    summary: '제조 라인 품질 검사와 기록 관리. 제조 현장 경력자의 꼼꼼함을 우대합니다.',
    requirements: ['품질 검사·관리 경험', '꼼꼼한 기록 관리', '제조 현장 이해'],
  },
  {
    id: 'fm', category: '시설관리', title: '건물 시설관리 책임자', company: '오피스 건물 관리업체',
    workTypes: ['풀타임 정규직'], fields: ['건설/건축', '기계/제조'], seniorRoles: true,
    summary: '중형 건물의 설비 점검·안전 관리 총괄. 현장 관리 경력자를 찾습니다.',
    requirements: ['설비·안전 관리 경험', '현장 인력 지휘', '국가기술자격 우대'],
  },
  {
    id: 'apt', category: '시설관리', title: '아파트 관리소장', company: '아파트 위탁관리사',
    workTypes: ['풀타임 정규직'], fields: ['건설/건축', '금융/영업'], seniorRoles: true,
    summary: '단지 운영 총괄 — 시설·회계·민원. 조직 운영 경험이 곧 자격입니다.',
    requirements: ['조직 운영 경험', '민원·소통 능력', '주택관리사 자격 우대'],
  },
  {
    id: 'sales', category: '영업·상담', title: '고객 상담·영업 매니저 (경력 무관 시니어 환영)', company: '생활서비스 기업',
    workTypes: ['풀타임 정규직', '파트타임'], fields: ['금융/영업', '교육/연구'], seniorRoles: false,
    summary: '중장년 고객 대상 상담·안내. 같은 눈높이의 상담자를 찾습니다.',
    requirements: ['고객 상담·관리 경험', '신뢰를 주는 화법', '장기 고객 관리 이력'],
  },
  {
    id: 'store', category: '매장관리', title: '매장 운영 관리자', company: '프랜차이즈 본사',
    workTypes: ['풀타임 정규직'], fields: ['물류/유통', '금융/영업'], seniorRoles: true,
    summary: '가맹점 운영 지원과 인력 관리. 점포 운영 경력자 우대.',
    requirements: ['매장·점포 운영 경험', '인력 운영', '재고·발주 관리'],
  },
  {
    id: 'mentor', category: '교육·멘토링', title: '직무 멘토 (프로젝트 계약)', company: '중소기업 지원기관',
    workTypes: ['자문·프로젝트 단위', '파트타임'], fields: ['건설/건축', '기계/제조', '금융/영업', '교육/연구', '물류/유통'], seniorRoles: true,
    summary: '퇴직 전문가가 중소기업 실무진을 지도하는 멘토링 사업. 경력 자체가 지원 자격입니다.',
    requirements: ['20년 이상 실무 경력', '후배 양성·교육 경험', '전수 가능한 전문 분야'],
  },
  {
    id: 'advisor', category: '자문', title: '기술 자문위원 (비상근)', company: '엔지니어링 컨설팅사',
    workTypes: ['자문·프로젝트 단위'], fields: ['건설/건축', '기계/제조'], seniorRoles: true,
    summary: '프로젝트 단위 기술 검토·자문. 현장 판단력을 삽니다.',
    requirements: ['기술 검토·판단 경력', '대형 프로젝트 경험', '보고서 작성 가능'],
  },
  {
    id: 'lecture', category: '교육·멘토링', title: '실무 강사 (파트타임)', company: '직업전문학교',
    workTypes: ['파트타임', '자문·프로젝트 단위'], fields: ['교육/연구', '기계/제조', '건설/건축'], seniorRoles: false,
    summary: '실무 경험 기반 강의. 가르쳐 본 경험이 있으면 더 좋습니다.',
    requirements: ['실무 경력', '교육·전수 경험', '전달력'],
  },
  {
    id: 'logi', category: '운전·배달·물류', title: '물류센터 운영 관리자', company: '지역 물류센터',
    workTypes: ['풀타임 정규직'], fields: ['물류/유통'], seniorRoles: true,
    summary: '입출고·인력·안전 관리. 물류 현장 경력자 우대.',
    requirements: ['입출고·재고 관리', '인력 운영', '무사고 운영 이력'],
  },
  {
    id: 'guard', category: '경비·보안', title: '건물 보안 팀장', company: '보안 전문업체',
    workTypes: ['풀타임 정규직', '파트타임'], fields: ['건설/건축', '기계/제조', '물류/유통'], seniorRoles: false,
    summary: '출입 관리와 순찰 총괄. 성실함과 책임감이 최우선입니다.',
    requirements: ['책임감·성실성', '위기 대응 침착성', '경비 신임교육 이수 가능'],
  },
];

export interface JobMatch {
  job: JobPosting;
  score: number;      // 55~95
  reasons: string[];  // 왜 맞는지 2개
}

/** 결정적 적합도 계산 — AI라 부르지 않는다. 규칙 기반 매칭이다. */
export function matchJobs(a: Answers, top = 3): JobMatch[] {
  const isManager = ['팀장·부장', '현장소장·공장장', '임원', '사장·대표'].includes(a.role ?? '');
  const longCareer = ['20년~30년', '30년 이상 평생'].includes(a.years ?? '');

  return JOB_POOL.map((job) => {
    let score = 50;
    const reasons: string[] = [];
    if (a.field && job.fields.includes(a.field)) {
      score += 25;
      reasons.push(`${a.field} 경력과 직결되는 직무`);
    }
    if (a.workType && (job.workTypes.includes(a.workType) || a.workType === '형태는 상관없음')) {
      score += 10;
      reasons.push(`희망 근무형태(${a.workType})와 일치`);
    }
    if (job.seniorRoles && isManager) {
      score += 8;
      reasons.push(`${a.role} 경험 우대`);
    }
    if (longCareer) score += 5;
    if (a.cert === '국가기술자격 보유' && job.requirements.some((r) => r.includes('자격'))) {
      score += 7;
      reasons.push('보유 자격이 우대 조건');
    }
    return { job, score: Math.min(95, score), reasons: reasons.slice(0, 2) };
  })
    .sort((x, y) => y.score - x.score)
    .slice(0, top)
    .filter((m) => m.score >= 55);
}
