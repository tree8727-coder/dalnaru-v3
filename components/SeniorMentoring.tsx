"use client";

import { useState } from "react";
import { Users, Briefcase, ArrowRight, ShieldCheck, X, Star } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SeniorMentoring() {
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
        service: "시니어 멘토링 (프리미엄)",
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
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #312E81)', padding: '40px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '16px', color: 'white', backdropFilter: 'blur(10px)' }}>
              <Users size={32} />
            </div>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, color: '#F3F4F6', marginBottom: '12px' }}>
                STAR MENTOR CLUB
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: 'white', letterSpacing: '-0.5px' }}>
                나의 20년 경력이<br />스타트업의 나침반이 됩니다
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '500px' }}>
                은퇴 후에도 멈추지 않는 지적 성취. 대기업 및 전문직 출신의 멘토와 업계 실무 동향이 필요한 주니어/창업가를 매칭합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Simulator UI */}
        <div style={{ padding: '32px', background: 'var(--bg-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} color="var(--primary)" /> 
              실시간 멘토링 요청 대기
            </h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>업데이트: 방금 전</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {/* Request Card 1 */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600, marginBottom: '4px' }}>IT / B2B SaaS 스타트업</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>B2B 영업 및 엔터프라이즈 도입 전략 피드백</div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                  1시간 / 15만원
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>"엔터프라이즈 세일즈 경험이 있으신 전무/상무급 멘토님을 찾습니다."</p>
            </div>

            {/* Request Card 2 */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600, marginBottom: '4px' }}>제조업 / 스마트팩토리</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>생산 라인 효율화 및 초기 QC 세팅 자문</div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                  2시간 / 25만원
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>"현장 경험이 풍부하신 공장장/품질관리 마스터님께 조언을 구합니다."</p>
            </div>
          </div>

          {/* Monetization / Pricing Section */}
          <div style={{ background: 'linear-gradient(180deg, var(--bg-card), var(--bg-color))', borderRadius: '16px', border: '1px solid var(--border-highlight)', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>투명하고 확실한 수익화 모델</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div style={{ flex: '1 1 200px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ color: 'var(--primary-light)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>단 10%</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>업계 최저 수준의<br/>매칭 수수료만 받습니다.</div>
              </div>
              <div style={{ flex: '1 1 200px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ color: 'var(--warning)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>프리미엄 노출</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>월 29,900원 구독 시<br/>상단 우선 노출 및 배지 부여</div>
              </div>
            </div>

            <button 
              onClick={() => setModalOpen(true)}
              style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '16px', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: 'var(--shadow-glow)', cursor: 'pointer', border: 'none' }}
            >
              <Star size={20} />
              <span>스타 멘토 사전 등록하기</span>
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
              <ShieldCheck color="var(--primary)" size={28} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>멘토 사전 등록</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              연락처를 남겨주시면 서비스 정식 오픈 시 <strong style={{ color: 'var(--text-primary)' }}>가장 먼저 첫 매칭 기회</strong>와 <strong style={{ color: 'var(--text-primary)' }}>3개월 수수료 면제 혜택</strong>을 안내해 드립니다.
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
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
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
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ marginTop: '12px', width: '100%', padding: '16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', fontSize: '1.1rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'background 0.2s', border: 'none' }}
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
