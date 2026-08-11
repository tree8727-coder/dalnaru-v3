/**
 * 퍼널 대화 데이터 수집.
 * 매 응답을 Firestore `funnel_sessions/<sessionId>`에 merge 저장한다.
 * 실패(오프라인·권한)하면 localStorage에 쌓아 둔다 — 데이터를 버리지 않는다.
 *
 * 개인정보 최소 수칙: 이름은 사용자가 직접 입력한 경우에만 저장되고,
 * 그 외에는 칩 선택값(분야·연차·역할·성과·목표)만 저장된다.
 */
import { db, doc, setDoc } from '@/lib/firebase';

export interface FunnelStep {
  q: string;
  a: string;
  tMs: number; // 세션 시작 후 경과 ms — 어디서 오래 머뭇거리는지 보기 위함
}

export function newSessionId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `s-${Math.random().toString(36).slice(2)}`;
}

export async function saveFunnel(
  sessionId: string,
  data: { steps: FunnelStep[]; done?: boolean },
): Promise<void> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'funnel_sessions', sessionId), payload, { merge: true });
  } catch {
    // ponytail: 오프라인 큐 없이 localStorage 한 칸 — 재전송이 필요해지면 큐로 승격
    try {
      localStorage.setItem(`funnel_${sessionId}`, JSON.stringify(payload));
    } catch {
      /* storage도 막힌 환경이면 포기 — 수집이 UX를 깨면 안 된다 */
    }
  }
}

/**
 * 지혜(전문가 판단) 수집 — 아담 실험용 별도 컬렉션.
 * 퍼널과 분리하는 이유: 목적이 다르다. 퍼널은 통계·연구 활용 동의이고,
 * 이 데이터는 "AI 학습 자료화" 별도 동의(consent: true)가 있어야만 저장한다.
 * 동의 없는 호출은 저장하지 않고 조용히 무시한다 — 코드 레벨에서 막는다.
 */
export async function saveWisdom(
  sessionId: string,
  data: { field: string; answers: { q: string; a: string }[]; consent: boolean },
): Promise<boolean> {
  if (!data.consent) return false;
  const payload = { ...data, updatedAt: new Date().toISOString() };
  try {
    await setDoc(doc(db, 'wisdom_sessions', sessionId), payload, { merge: true });
    return true;
  } catch {
    try {
      localStorage.setItem(`wisdom_${sessionId}`, JSON.stringify(payload));
    } catch { /* 위와 동일 */ }
    return true; // 로컬 보관도 수집 성공으로 본다 — 규칙 배포 전 폴백
  }
}
