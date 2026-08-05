"use client";

import { useState } from "react";
import { Puzzle, Plus, Play, ArrowDown, Share2, Users } from "lucide-react";

export default function CommunityPipelines() {
  const [activeTab, setActiveTab] = useState<"builder" | "community">("builder");

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>나만의 AI 파이프라인 조립</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>레고 블록을 맞추듯, 내가 필요한 AI 자동화 프로세스를 직접 만들거나 이웃들이 만든 것을 가져와 써보세요.</p>
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
        <div className="card-toss" style={{ padding: '24px', background: 'var(--bg-card)', border: '2px dashed var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            
            {/* Block 1 */}
            <div style={{ width: '100%', background: 'var(--accent)', borderRadius: '12px 12px 12px 12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>[입력] 옛날 흑백 사진</div>
              <Puzzle size={20} color="rgba(255,255,255,0.5)" />
            </div>

            <ArrowDown size={20} color="var(--border-highlight)" />

            {/* Block 2 */}
            <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '12px 12px 12px 12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>[AI 처리] 컬러 복원 및 화질 개선</div>
              <Puzzle size={20} color="rgba(255,255,255,0.5)" />
            </div>

            <ArrowDown size={20} color="var(--border-highlight)" />

            {/* Empty Block */}
            <button style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--border-highlight)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <Plus size={20} /> 새 블록 조립하기
            </button>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ flex: 2 }}>
              <Play size={18} /> 실행하기
            </button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}>
              <Share2 size={18} /> 공유
            </button>
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {pipe.uses}명이 사용 중</span>
              </div>
              <button className="btn-primary" style={{ padding: '12px', fontSize: '1rem', background: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}>
                내 블록으로 가져오기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
