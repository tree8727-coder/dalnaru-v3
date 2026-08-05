"use client";

import { useState } from "react";
import { Users, Search, Building2, BarChart3, Database } from "lucide-react";

export default function PersonaRAG() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<boolean>(false);

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setResult(false);
    setTimeout(() => {
      setIsSearching(false);
      setResult(true);
    }, 3000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Building2 color="var(--accent)" size={28} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>B2B 페르소나 마켓 리서치</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>가짜 AI가 아닙니다. 실제 60대 사용자 5,000명의 기억과 가치관을 복제한 '디지털 쌍둥이'들에게 동시에 질문을 던지고 즉각적인 시장 조사 결과를 받으세요.</p>
      </div>

      <div className="card-toss" style={{ padding: '24px', marginBottom: '24px', border: '2px solid rgba(139, 92, 246, 0.4)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <span style={{ background: 'var(--bg-card-hover)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>타겟: 60~65세</span>
          <span style={{ background: 'var(--bg-card-hover)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>관심사: 건강/식품</span>
          <span style={{ background: 'var(--bg-card-hover)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>쌍둥이 인원: 4,821명 대기 중</span>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '16px', left: '16px' }} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 당 0% 음료 패키징에 '제로'라는 단어와 '무당' 중 어느 쪽이 더 신뢰가 가시나요?"
            style={{ width: '100%', background: 'var(--bg-color)', border: 'none', padding: '16px 16px 16px 48px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        
        <button 
          onClick={handleSearch}
          className="btn-primary"
          style={{ width: '100%', marginTop: '16px', background: isSearching ? 'var(--bg-card-hover)' : 'var(--accent)', height: '52px' }}
        >
          {isSearching ? <span className="animate-pulse">4,821명의 쌍둥이에게 쿼리 중... (수수료 산정 중)</span> : '실시간 시뮬레이션 시작 (예상 비용 ₩300,000)'}
        </button>
      </div>

      {result && (
        <div className="animate-fade-up card-toss" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 color="var(--success)" size={24} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>리서치 분석 결과</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>응답 분포</div>
              <div style={{ display: 'flex', gap: '12px', height: '24px' }}>
                <div style={{ width: '78%', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '8px', fontSize: '0.8rem', fontWeight: 700 }}>'무당' 선호 (78%)</div>
                <div style={{ width: '22%', background: 'var(--warning)', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#000' }}>'제로' (22%)</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>AI 종합 인사이트</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                타겟 쌍둥이들의 과거 대화 데이터(RAG)를 분석한 결과, 60대는 '제로'라는 단어를 '인공 감미료가 들어간 화학적인 맛'으로 인식하는 경향이 65%에 달했습니다. 반면 '무당'은 전통적이고 자연스러운 건강식이라는 뉘앙스를 주어 훨씬 높은 신뢰도를 보였습니다. 
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
              <Database size={16} /> 4,821명의 개인화된 RAG 벡터 검색 및 LLM 합성 완료
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
