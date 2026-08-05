"use client";

import { useState } from "react";
import { PenTool, Image as ImageIcon, Check, Loader2 } from "lucide-react";

export default function AIWorkflows() {
  const [runningId, setRunningId] = useState<number | null>(null);
  const [completedId, setCompletedId] = useState<number | null>(null);

  const workflows = [
    {
      id: 1,
      icon: <PenTool size={28} color="var(--primary)" />,
      title: "취미로 수익형 블로그 글쓰기",
      desc: "사진 한 장과 짧은 메모만 올리면, 네이버 검색 상위에 노출되는 블로그 글로 자동 변환합니다.",
      inputLabel: "오늘 한 일이나 취미를 적어주세요",
      placeholder: "예) 오늘 집 앞 산에서 등산하고 백숙 먹음."
    },
    {
      id: 2,
      icon: <ImageIcon size={28} color="var(--accent)" />,
      title: "흐릿한 옛날 사진 고화질 복원",
      desc: "앨범 속 빛바랜 옛날 사진을 스마트폰으로 대충 찍어 올리면, 스튜디오 급 초고화질로 복원합니다.",
      inputLabel: "복원할 사진 업로드",
      placeholder: "갤러리에서 사진 선택..."
    }
  ];

  const handleRun = (id: number) => {
    setRunningId(id);
    setCompletedId(null);
    
    // Simulate API call
    setTimeout(() => {
      setRunningId(null);
      setCompletedId(id);
    }, 2000);
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>원클릭 자동화 파이프라인</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>복잡한 프롬프트나 툴 학습 없이, 버튼 하나로 결과를 얻으세요.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {workflows.map(wf => (
          <div key={wf.id} className="card-toss" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '16px' }}>
                {wf.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{wf.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>{wf.desc}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                {wf.inputLabel}
              </label>
              <input 
                type="text" 
                placeholder={wf.placeholder}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem' }}
                disabled={runningId === wf.id}
              />
            </div>

            <button 
              onClick={() => handleRun(wf.id)}
              disabled={runningId !== null}
              className="btn-primary"
              style={{ 
                background: completedId === wf.id ? 'var(--success)' : (runningId === wf.id ? 'var(--bg-card-hover)' : 'var(--primary)'),
                color: runningId === wf.id ? 'var(--text-secondary)' : '#fff'
              }}
            >
              {runningId === wf.id ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>AI가 작업 중입니다...</span>
                </>
              ) : completedId === wf.id ? (
                <>
                  <Check size={20} />
                  <span>작업 완료! 갤러리에 저장되었습니다.</span>
                </>
              ) : (
                <span>결과물 만들기</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
