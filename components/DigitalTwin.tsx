"use client";

import { useState } from "react";
import { Mic, MessageSquare, BrainCircuit, Heart, Fingerprint } from "lucide-react";

export default function DigitalTwin() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "안녕하세요 선생님! 오늘 하루는 어떠셨나요? 예전에 말씀해주신 '90년대 첫 직장 출근길' 이야기가 참 재미있었는데, 그 회사의 첫인상은 어땠는지 더 들려주실 수 있나요?" }
  ]);

  const handleMicClick = () => {
    if (isRecording) return;
    setIsRecording(true);
    
    setTimeout(() => {
      setIsRecording(false);
      setMessages(prev => [
        ...prev,
        { role: 'user', text: "그땐 참 다들 열심히 했지. 사무실에 담배 연기가 자욱했는데도, 회사가 크는 게 눈에 보여서 밤새는 줄 몰랐어." },
        { role: 'ai', text: "아, 그 시절의 열정이 여기까지 느껴지네요! 선생님의 '성취감과 책임감'에 대한 가치관이 돋보이는 기억입니다. 이 소중한 기억을 디지털 자서전에 꼼꼼히 기록해 두겠습니다." }
      ]);
    }, 3000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Fingerprint color="var(--primary)" size={28} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>나의 디지털 쌍둥이 기르기</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>나와 대화할수록 나와 똑같이 생각하고 말하는 AI가 자라납니다. 영원히 남을 나의 자서전이자 분신을 만들어보세요.</p>
      </div>

      <div className="card-toss" style={{ padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '300px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex',
            gap: '12px'
          }}>
            {msg.role === 'ai' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <BrainCircuit size={20} color="#fff" />
              </div>
            )}
            <div style={{ 
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-card-hover)', 
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              padding: '16px', 
              borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
              fontSize: '1rem',
              lineHeight: 1.5,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isRecording && (
          <div style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '16px', borderRadius: '20px 20px 0 20px', background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
            <span className="animate-pulse">듣고 있습니다...</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button 
          onClick={handleMicClick}
          className={isRecording ? "pulse-button" : ""}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isRecording ? 'var(--danger)' : 'var(--bg-card)',
            color: isRecording ? '#fff' : 'var(--primary)',
            border: `3px solid ${isRecording ? 'var(--danger)' : 'var(--primary)'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: isRecording ? '0 0 30px rgba(255, 69, 58, 0.4)' : 'var(--shadow-md)',
            cursor: isRecording ? 'default' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <Mic size={36} />
        </button>
      </div>

      <div className="card-toss" style={{ padding: '20px', marginTop: '24px', background: 'rgba(50, 215, 75, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart color="var(--success)" size={20} />
            디지털 쌍둥이 동기화 율
          </div>
          <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.2rem' }}>12%</div>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-card-hover)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: '12%', height: '100%', background: 'var(--success)' }}></div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'center' }}>
          대화가 쌓일수록 똑똑해집니다. 쌍둥이가 B2B 리서치에 참여할 때마다 로열티가 지급됩니다.
        </p>
      </div>
    </div>
  );
}
