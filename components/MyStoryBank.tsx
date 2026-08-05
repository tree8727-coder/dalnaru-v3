"use client";

import { useState, useEffect } from "react";
import { Mic, CheckCircle, TrendingUp, Heart, BellRing } from "lucide-react";

export default function MyStoryBank() {
  const [isRecording, setIsRecording] = useState(false);
  const [step, setStep] = useState(0);
  const [bounty, setBounty] = useState(50000);

  // Simulate dynamic pricing rising
  useEffect(() => {
    const timer = setInterval(() => {
      setBounty(prev => prev + Math.floor(Math.random() * 2000));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleMicClick = () => {
    if (isRecording) return;
    setIsRecording(true);
    
    setTimeout(() => {
      setStep(1);
      setIsRecording(false);
    }, 4000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>선배님의 지혜를 나눠주세요</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>선배님의 관록과 경험이 후배 창업자들에게는 돈으로 환산할 수 없는 가장 큰 무기가 됩니다.</p>
      </div>

      <div className="card-toss" style={{ padding: '24px', marginBottom: '20px', border: '2px solid rgba(255, 159, 10, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellRing color="var(--warning)" size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--warning)' }}>급상승 중인 지식 요청</h3>
          </div>
          <div style={{ background: 'rgba(255, 159, 10, 0.1)', padding: '6px 12px', borderRadius: '12px', color: 'var(--warning)', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={18} />
            ₩ {bounty.toLocaleString()}
          </div>
        </div>
        
        <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', marginBottom: '24px', fontSize: '1.05rem', lineHeight: 1.6 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>A 프롭테크 스타트업 외 12곳에서 요청함</p>
          "1990년대 후반 외환위기 당시, 지역 상권 부동산 폭락 시기에 건물주들은 세입자들과 어떤 방식으로 고통을 분담하고 이면 계약을 맺었나요? 당시의 생생한 현장 관행이 궁금합니다."
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <button 
            onClick={handleMicClick}
            className={isRecording ? "pulse-button" : ""}
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: isRecording ? 'var(--danger)' : 'var(--bg-card-hover)',
              color: isRecording ? '#fff' : 'var(--text-primary)',
              border: `2px solid ${isRecording ? 'var(--danger)' : 'var(--border-color)'}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: isRecording ? '0 0 30px rgba(255, 69, 58, 0.4)' : 'var(--shadow-md)',
              cursor: isRecording ? 'default' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <Mic size={32} style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              {isRecording ? '듣고 있습니다...' : '답변 남기기'}
            </span>
          </button>
        </div>
        {!isRecording && step === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>버튼을 누르고 편하게 말씀해 주세요.</p>
        )}

        {step === 1 && (
          <div className="animate-fade-up" style={{ textAlign: 'center', padding: '20px', background: 'rgba(50, 215, 75, 0.1)', borderRadius: '16px', color: 'var(--success)', marginTop: '20px' }}>
            <Heart size={28} style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>지혜를 나눠주셔서 감사합니다!</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>누적된 현상금 <strong>₩ {bounty.toLocaleString()}</strong>이(가) 수익금으로 적립되었습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}
