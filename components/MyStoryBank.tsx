"use client";

import { useState } from "react";
import { Mic, CheckCircle, TrendingUp, BrainCircuit } from "lucide-react";

export default function MyStoryBank() {
  const [isRecording, setIsRecording] = useState(false);
  const [step, setStep] = useState(0);

  const handleMicClick = () => {
    if (isRecording) return;
    setIsRecording(true);
    
    // Simulate AI voice interview flow
    setTimeout(() => {
      setStep(1); // User finished speaking
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>마이 스토리 뱅크</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>인터넷에 없는 나만의 노하우를 음성으로 남기고 수익을 창출하세요.</p>
      </div>

      <div className="card-toss" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <BrainCircuit color="var(--primary)" size={24} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI 심층 인터뷰 대기 중</h3>
        </div>
        
        <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', marginBottom: '24px', fontSize: '1rem', lineHeight: 1.5 }}>
          <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>AI의 질문:</p>
          "1990년대 섬유 공장 운영 당시, 어음 부도 위기를 어떻게 넘기셨는지 생생한 경험담을 들려주실 수 있나요?"
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <button 
            onClick={handleMicClick}
            className={isRecording ? "pulse-button" : ""}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: isRecording ? 'var(--danger)' : 'var(--bg-card-hover)',
              color: isRecording ? '#fff' : 'var(--text-secondary)',
              border: `2px solid ${isRecording ? 'var(--danger)' : 'var(--border-color)'}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: isRecording ? '0 0 30px rgba(255, 69, 58, 0.4)' : 'none',
              cursor: isRecording ? 'default' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <Mic size={32} style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              {isRecording ? '녹음 중...' : '답변하기'}
            </span>
          </button>
        </div>

        {step === 1 && (
          <div className="animate-fade-up" style={{ textAlign: 'center', padding: '16px', background: 'rgba(50, 215, 75, 0.1)', borderRadius: '16px', color: 'var(--success)' }}>
            <CheckCircle size={24} style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 600 }}>지식 추출 및 DB 등재 완료!</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>이 지식은 B2B 컨설팅 펌에서 열람 시 로열티가 지급됩니다.</div>
          </div>
        )}
      </div>

      <div className="card-toss" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>이번 달 누적 로열티 예상 수익</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>₩ 45,000</div>
          </div>
          <div style={{ background: 'rgba(10, 132, 255, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
