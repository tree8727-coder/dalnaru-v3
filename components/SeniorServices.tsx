"use client";

import { Users, PhoneCall, CheckCircle2, ChevronRight, BookOpen, ShieldCheck } from "lucide-react";

export default function SeniorServices() {
  const handleApply = (serviceName: string) => {
    alert(`[MVP 데모] ${serviceName} 사전 예약 폼으로 이동합니다. (현재 준비 중)`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. 시니어 전문가 멘토링 */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', padding: '32px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px', color: 'white' }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>사전 모집 중</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>시니어 현직자 멘토링 클럽</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>
                나의 20년 경력이 누군가에게는 가장 절실한 정답이 됩니다.<br />
                대기업/전문직 은퇴 후, 업계의 진짜 이야기(하체)를 취업 준비생과 주니어들에게 들려주세요.
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>이런 분들께 추천합니다</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
              <CheckCircle2 color="var(--success)" size={20} />
              <span style={{ fontSize: '0.95rem' }}>인터넷 검색으로는 안 나오는 <strong>업계 실무 동향</strong>을 아시는 분</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
              <CheckCircle2 color="var(--success)" size={20} />
              <span style={{ fontSize: '0.95rem' }}>단순 치킨집 창업 대신 <strong>품위 있는 지식 나눔</strong>을 원하시는 분</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
              <CheckCircle2 color="var(--success)" size={20} />
              <span style={{ fontSize: '0.95rem' }}>젊은 세대와 소통하며 <strong>새로운 활력과 소득</strong>을 원하시는 분</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleApply("시니어 멘토")}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'white', color: 'black', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <span>멘토 사전 등록하고 혜택받기</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 2. AI 텔레마켓 */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(4DD4BF, 0.1))', padding: '32px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--success)', padding: '12px', borderRadius: '12px', color: 'white' }}>
              <PhoneCall size={28} />
            </div>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>출시 예정</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>5060 전용 AI 전화 비서 (텔레마켓)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>
                복잡한 모바일 앱, 귀찮은 검색은 그만!<br />
                전화 한 통이면 AI 비서가 KTX 예매부터 세금 고지서 처리 방법까지 척척 해결해 드립니다.
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>어떤 것을 도와드릴까요?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ margin: '0 auto', color: 'var(--accent-light)' }}><BookOpen size={24} /></div>
              <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>기차표/공연 예매 대행</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ margin: '0 auto', color: 'var(--warning)' }}><ShieldCheck size={24} /></div>
              <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>보이스피싱/사기 번호 판독</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ margin: '0 auto', color: 'var(--primary)' }}><PhoneCall size={24} /></div>
              <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>가전제품 A/S 접수 대행</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleApply("AI 전화 비서")}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-card-hover)', border: '1px solid var(--success)', color: 'var(--success)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <span>오픈 알림 신청하기</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
