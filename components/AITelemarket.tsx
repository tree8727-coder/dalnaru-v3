"use client";

import { useState } from "react";
import { PhoneCall, Mic, History, ArrowRight, ShieldCheck, X, Train, ShieldAlert, Wrench } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AITelemarket() {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "leads"), {
        service: "AI 텔레마켓 비서",
        name,
        phone,
        createdAt: serverTimestamp(),
      });
      alert(`사전 신청이 완료되었습니다! 정식 오픈 시 안내 문자를 발송해 드리겠습니다.`);
      setModalOpen(false);
      setName("");
      setPhone("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Section */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
        <div style={{ background: 'linear-gradient(135deg, #047857, #064E3B)', padding: '40px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '16px', color: 'white', backdropFilter: 'blur(10px)' }}>
              <PhoneCall size={32} />
            </div>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, color: '#F3F4F6', marginBottom: '12px' }}>
                AI VOICE CONCIERGE
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: 'white', letterSpacing: '-0.5px' }}>
                앱 설치도 검색도 필요 없는<br />나만의 AI 전화 비서
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '500px' }}>
                "이번 주 일요일 부산 가는 KTX 예매해줘" 전화 한 통이면 끝. 보이스피싱 판독부터 일상 예약까지 음성 AI가 대신 처리합니다.
              </p>
            </div>
          </div>
        </div>

        {/* App Simulator UI */}
        <div style={{ padding: '32px', background: 'var(--bg-color)', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Phone UI Mockup */}
          <div style={{ flex: '1 1 300px', background: '#111827', border: '1px solid #374151', borderRadius: '32px', padding: '24px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ width: '40px', height: '4px', background: '#374151', borderRadius: '4px', margin: '0 auto 24px' }}></div>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'pulse 2s infinite' }}>
                <Mic size={40} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>무엇을 도와드릴까요?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>음성으로 말씀해주세요</p>
            </div>

            <div style={{ background: '#1F2937', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>최근 처리 내역</span>
                <History size={16} color="var(--text-secondary)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}><Train size={16} /></div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>부산행 KTX 예매 완료</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>내일 오전 9시 30분</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--danger)' }}><ShieldAlert size={16} /></div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>스팸/사기 전화 차단</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>검찰 사칭 의심 번호</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--warning)' }}><Wrench size={16} /></div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>LG전자 A/S 접수</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>세탁기 고장 접수 완료</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CSS Animation for pulse */}
            <style jsx>{`
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
                100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
              }
            `}</style>
          </div>

          {/* Pricing & CTA */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>구독 및 제휴 모델</h3>
            
            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>프리미엄 구독 (B2C)</span>
                <span style={{ background: 'var(--success)', color: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>추천</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>월 9,900원</div>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '20px' }}>
                <li>무제한 AI 전화 비서 호출</li>
                <li>실시간 보이스피싱 모니터링</li>
                <li>가족 안심 알림 서비스</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>통신사 제휴 (B2B2C)</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                SKT, KT, LGU+ 와의 요금제 결합 제휴를 통해 시니어 전용 요금제에 기본 탑재되는 모델을 추진 중입니다.
              </p>
            </div>

            <button 
              onClick={() => setModalOpen(true)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--success)', color: 'white', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)', cursor: 'pointer', border: 'none' }}
            >
              <PhoneCall size={20} />
              <span>출시 알림 신청하기</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '32px', position: 'relative', border: '1px solid var(--border-highlight)', background: 'var(--bg-card)' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '4px', cursor: 'pointer', border: 'none' }}>
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ShieldCheck color="var(--success)" size={28} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>출시 알림 신청</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              연락처를 남겨주시면 서비스 정식 오픈 시 <strong style={{ color: 'var(--text-primary)' }}>가장 먼저 안내 문자와 1개월 무료 체험권</strong>을 보내드립니다.
            </p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>성함</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--success)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>휴대폰 번호</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="예: 010-1234-5678"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--success)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ marginTop: '12px', width: '100%', padding: '16px', borderRadius: '10px', background: 'var(--success)', color: 'white', fontSize: '1.1rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'background 0.2s', border: 'none' }}
              >
                {isSubmitting ? '전송 중...' : '신청 완료하고 혜택받기'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
