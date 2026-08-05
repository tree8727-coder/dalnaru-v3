"use client";

import { useState } from "react";
import { Puzzle, Plus, Play, ArrowDown, Sparkles, Wand2 } from "lucide-react";

export default function CommunityPipelines() {
  const [activeTab, setActiveTab] = useState<"builder" | "community">("builder");
  const [aiInput, setAiInput] = useState("");
  const [isAiBuilding, setIsAiBuilding] = useState(false);

  const handleAiBuild = () => {
    if (!aiInput.trim()) return;
    setIsAiBuilding(true);
    setTimeout(() => {
      setIsAiBuilding(false);
      alert("AI가 맞춤형 파이프라인을 조립했습니다!");
    }, 2000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>AI 블록 공작소</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>원하는 자동화를 말해보세요. AI가 알맞은 블록을 추천하고 조립해 줍니다.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab("builder")}
          style={{ flex: 1, padding: '10px', borderRadius: '12px', background: activeTab === 'builder' ? 'var(--primary)' : 'var(--bg-card)', color: activeTab === 'builder' ? '#fff' : 'var(--text-secondary)', fontWeight: 700 }}
        >
          내가 조립하기
        </button>
        <button 
          onClick={() => setActiveTab("community")}
          style={{ flex: 1, padding: '10px', borderRadius: '12px', background: activeTab === 'community' ? 'var(--primary)' : 'var(--bg-card)', color: activeTab === 'community' ? '#fff' : 'var(--text-secondary)', fontWeight: 700 }}
        >
          커뮤니티 파이프라인
        </button>
      </div>

      {activeTab === "builder" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Recommender Input */}
          <div className="card-toss" style={{ padding: '20px', border: '2px solid rgba(139, 92, 246, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles color="var(--accent)" size={20} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)' }}>무엇을 자동화하고 싶으신가요?</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="예: 영수증 찍으면 가계부에 적어줘"
                style={{ flex: 1, background: 'var(--bg-color)', border: 'none', padding: '14px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
              />
              <button 
                onClick={handleAiBuild}
                className="btn-primary"
                style={{ width: 'auto', padding: '0 20px', background: isAiBuilding ? 'var(--bg-card-hover)' : 'var(--accent)' }}
              >
                {isAiBuilding ? <Wand2 size={20} className="animate-spin" /> : 'AI 추천'}
              </button>
            </div>
          </div>

          <div className="card-toss" style={{ padding: '24px', background: 'var(--bg-card)', border: '2px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              
              {/* Block 1 */}
              <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>[입력] 냉장고 속 식재료 사진</div>
                <Puzzle size={20} color="rgba(255,255,255,0.5)" />
              </div>

              <ArrowDown size={20} color="var(--border-highlight)" />

              {/* Block 2 */}
              <div style={{ width: '100%', background: 'var(--accent)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>[AI] 당뇨 맞춤형 건강 레시피 생성</div>
                <Puzzle size={20} color="rgba(255,255,255,0.5)" />
              </div>

              <ArrowDown size={20} color="var(--border-highlight)" />

              {/* Block 3 */}
              <div style={{ width: '100%', background: 'var(--success)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>[출력] 부족한 식재료 쿠팡 장바구니 담기</div>
                <Puzzle size={20} color="rgba(255,255,255,0.5)" />
              </div>

              <ArrowDown size={20} color="var(--border-highlight)" />

              {/* Empty Block */}
              <button style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--border-highlight)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <Plus size={20} /> 블록 추가하기
              </button>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
              <button className="btn-primary" style={{ flex: 1 }}>
                <Play size={18} /> 실행
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "community" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { title: "손주 동영상 유튜브 숏츠로 1분 만에 컷편집", author: "은평구 할배", uses: 1240 },
            { title: "오늘 장본 영수증 가계부 자동 정리기", author: "알뜰살뜰", uses: 856 }
          ].map((pipe, idx) => (
            <div key={idx} className="card-toss" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{pipe.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                <span>제작: {pipe.author}</span>
                <span>{pipe.uses}명이 사용 중</span>
              </div>
              <button className="btn-primary" style={{ padding: '12px', fontSize: '1rem', background: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}>
                내 공작소로 가져오기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
