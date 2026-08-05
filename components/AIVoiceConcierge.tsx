"use client";

import { useState } from "react";
import { Mic, History, Train, AlertTriangle, CreditCard } from "lucide-react";

export default function AIVoiceConcierge() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  const handleMicClick = () => {
    if (isListening) return;
    
    setIsListening(true);
    setRecognizedText("듣고 있어요...");
    
    setTimeout(() => {
      setRecognizedText("이번 주 일요일 부산 가는 KTX 예매해줘");
    }, 1500);

    setTimeout(() => {
      setIsListening(false);
      alert("✅ AI 비서 처리 완료: 이번 주 일요일 오전 10시 부산행 KTX 예매가 완료되었습니다.");
      setRecognizedText("");
    }, 3000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>말씀만 하세요</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>기차표 예매부터 사기 문자 판독까지</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
        <button 
          onClick={handleMicClick}
          className={isListening ? "pulse-button" : ""}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: isListening ? 'var(--primary)' : 'var(--bg-card)',
            color: isListening ? '#fff' : 'var(--primary)',
            border: `2px solid ${isListening ? 'var(--primary)' : 'var(--border-color)'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: isListening ? '0 0 30px rgba(10, 132, 255, 0.5)' : 'var(--shadow-md)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: isListening ? 'default' : 'pointer'
          }}
        >
          <Mic size={48} />
        </button>
      </div>

      <div style={{ textAlign: 'center', minHeight: '30px', marginBottom: '40px', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
        {recognizedText}
      </div>

      <div className="card-toss" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>최근 AI 처리 내역</h3>
          <History size={18} color="var(--text-secondary)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(10, 132, 255, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
              <Train size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>서울 ➔ 대전 KTX 예매</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>오늘 오전 10:30 처리 완료</div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)' }}></div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255, 69, 58, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--danger)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>스팸/보이스피싱 차단</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>어제 오후 2:15 검찰 사칭 번호</div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)' }}></div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(50, 215, 75, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--success)' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>통신비 자동이체 내역 조회</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>3일 전 처리 완료</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
