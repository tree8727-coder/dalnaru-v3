"use client";

import { useState } from "react";
import { Calculator, AlertCircle, TrendingUp, Download, ArrowRight } from "lucide-react";

export default function PensionCalculator() {
  const [gender, setGender] = useState("male");
  const [workYears, setWorkYears] = useState<number | "">("");
  const [lastSalary, setLastSalary] = useState<number | "">("");
  const [livingCost, setLivingCost] = useState<number | "">("");
  
  const [result, setResult] = useState<{
    pension: number;
    shortfall: number;
  } | null>(null);

  const calculatePension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workYears || !lastSalary || !livingCost) return;
    
    // 간소화된 국민연금 예상 수령액 공식 (통계적 추정치)
    // 기본금 + (근무년수 * 가중치) + (소득 * 가중치)
    let estimatedPension = 30 + (Number(workYears) * 2.5) + (Number(lastSalary) * 0.12);
    if (gender === 'female') estimatedPension *= 0.95; // 임의의 통계적 보정
    
    // 최대 수령액 상한선 적용 (약 250만원)
    estimatedPension = Math.min(Math.round(estimatedPension), 250);
    
    const shortfall = Math.max(Number(livingCost) - estimatedPension, 0);
    
    setResult({
      pension: estimatedPension,
      shortfall: shortfall
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Input Section */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <Calculator size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>은퇴 자산(소득 크레바스) 진단기</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>불필요한 가입 절차 없이, 단 4가지 질문으로 나의 노후 안전판을 점검해보세요.</p>
          </div>
        </div>

        <form onSubmit={calculatePension} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '1.05rem' }}>1. 성별</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button"
                onClick={() => setGender('male')}
                style={{ flex: 1, padding: '14px', borderRadius: '8px', border: `2px solid ${gender === 'male' ? 'var(--primary)' : 'var(--border-color)'}`, background: gender === 'male' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', fontWeight: 600, fontSize: '1.1rem' }}
              >
                남성
              </button>
              <button 
                type="button"
                onClick={() => setGender('female')}
                style={{ flex: 1, padding: '14px', borderRadius: '8px', border: `2px solid ${gender === 'female' ? 'var(--primary)' : 'var(--border-color)'}`, background: gender === 'female' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', fontWeight: 600, fontSize: '1.1rem' }}
              >
                여성
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '1.05rem' }}>2. 총 경제활동(근무) 기간</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                required min="1" max="50"
                value={workYears}
                onChange={(e) => setWorkYears(Number(e.target.value) || "")}
                placeholder="예: 25"
                style={{ width: '100%', padding: '16px 40px 16px 16px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white', fontSize: '1.1rem', outline: 'none' }}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>년</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '1.05rem' }}>3. 마지막 평균 월 소득</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                required min="50"
                value={lastSalary}
                onChange={(e) => setLastSalary(Number(e.target.value) || "")}
                placeholder="예: 450"
                style={{ width: '100%', padding: '16px 50px 16px 16px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white', fontSize: '1.1rem', outline: 'none' }}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>만 원</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '1.05rem' }}>4. 은퇴 후 희망 월 생활비</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                required min="100"
                value={livingCost}
                onChange={(e) => setLivingCost(Number(e.target.value) || "")}
                placeholder="예: 300"
                style={{ width: '100%', padding: '16px 50px 16px 16px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white', fontSize: '1.1rem', outline: 'none' }}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>만 원</span>
            </div>
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontSize: '1.2rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <span>진단 결과 확인하기</span>
              <ArrowRight />
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {result && (
        <div className="card animate-fade-in" style={{ padding: '32px', border: '1px solid var(--primary)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>진단 완료</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>나의 은퇴 자산 진단 결과</h3>
            <p style={{ color: 'var(--text-secondary)' }}>입력하신 정보를 바탕으로 산출된 예상 결과입니다.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>월 예상 연금액 (65세 이후)</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{result.pension}<span style={{ fontSize: '1.2rem', fontWeight: 600, marginLeft: '4px' }}>만 원</span></div>
            </div>
            
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
              <p style={{ color: '#EF4444', fontWeight: 600, marginBottom: '8px' }}>매월 부족한 금액 (소득 크레바스)</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#EF4444' }}>{result.shortfall}<span style={{ fontSize: '1.2rem', fontWeight: 600, marginLeft: '4px' }}>만 원</span></div>
            </div>
          </div>

          {result.shortfall > 0 ? (
            <div style={{ background: 'rgba(251, 191, 36, 0.08)', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--warning)', marginTop: '2px' }}>
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '6px' }}>노후 준비가 추가로 필요합니다</h4>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  희망 생활비를 유지하기 위해 매월 <strong>{result.shortfall}만 원</strong>의 고정 수익 파이프라인이 필요합니다. 
                  무리한 육체 노동이나 준비되지 않은 자영업보다는, <strong>내일배움카드를 활용한 자격증 취득</strong>이나 <strong>소자본 지식 창업</strong>을 통해 안전하게 소득을 보충하는 것을 추천합니다.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--success)', marginTop: '2px' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)', marginBottom: '6px' }}>안정적인 노후 준비가 예상됩니다!</h4>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  국민연금만으로도 희망하시는 생활비를 충당할 수 있을 것으로 예상됩니다. 
                  여유 있는 시간을 활용해 나의 경험을 나누는 <strong>지식 멘토링</strong>이나 가벼운 <strong>취미 창업</strong>에 도전해보시는 것은 어떨까요?
                </p>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <Download size={20} />
              <span>5060 은퇴 방어 파이프라인 가이드북 (PDF) 무료 다운로드</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
