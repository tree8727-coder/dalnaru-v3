"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Briefcase, Star, Search } from "lucide-react";

export default function MicroTaskMatching() {
  const [acceptedTask, setAcceptedTask] = useState<number | null>(null);

  const tasks = [
    {
      id: 1,
      company: "A 핀테크 스타트업",
      title: "시니어 대상 간편 송금 앱 사용성 테스트 (QA)",
      desc: "은퇴하신 은행원, 금융업 종사자 선호. 새로 출시할 송금 화면이 직관적인지 피드백 부탁드립니다.",
      reward: "50,000원",
      time: "약 30분 소요",
      tags: ["금융", "비대면", "QA"]
    },
    {
      id: 2,
      company: "B 제조업 B2B 플랫폼",
      title: "공장 설비 유지보수 관련 데스크 리서치 및 인터뷰",
      desc: "제조/생산 공장장 출신 시니어님들의 생생한 현장 경험이 필요합니다.",
      reward: "150,000원",
      time: "1시간 화상 인터뷰",
      tags: ["제조", "인터뷰", "전문가"]
    }
  ];

  const handleAccept = (id: number) => {
    setAcceptedTask(id);
    setTimeout(() => {
      alert("작업이 매칭되었습니다! 카카오톡으로 안내 메시지를 발송했습니다.");
    }, 500);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>나의 경력이 필요한 곳</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>회원님의 과거 경력(금융, 제조)과 매칭된 소일거리입니다.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.map(task => (
          <div key={task.id} className="card-toss">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                  {task.company}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4 }}>
                  {task.title}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>
                  {task.reward}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {task.time}
                </div>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
              {task.desc}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {task.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>

            <button 
              onClick={() => handleAccept(task.id)}
              disabled={acceptedTask === task.id}
              className="btn-primary"
              style={{ background: acceptedTask === task.id ? 'var(--bg-card-hover)' : 'var(--primary)', color: acceptedTask === task.id ? 'var(--success)' : '#fff' }}
            >
              {acceptedTask === task.id ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>매칭 완료됨</span>
                </>
              ) : (
                <>
                  <span>이 작업 지원하기</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
