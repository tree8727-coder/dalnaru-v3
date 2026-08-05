"use client";

import { useState } from "react";
import { MapPin, Navigation, DollarSign, Mic } from "lucide-react";

export default function LocalVeteranInsight() {
  const [activeMission, setActiveMission] = useState<number | null>(null);

  const missions = [
    {
      id: 1,
      title: "강남역 4번 출구 B상가 변천사 (10년 이상 거주자)",
      requirer: "프롭테크 A사: 상권 쇠퇴 원인 분석",
      distance: "현재 위치에서 300m",
      reward: 15000,
      tags: ["역사", "상권"]
    },
    {
      id: 2,
      title: "역삼동 123-4 골목길 주말 유동인구 특성 코멘터리",
      requirer: "리테일 분석 B사",
      distance: "현재 위치에서 800m",
      reward: 20000,
      tags: ["관찰", "동네주민"]
    }
  ];

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>토박이 인사이트</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>동네의 오랜 역사와 맥락을 아는 분만 남길 수 있는 현장 코멘터리 미션입니다.</p>
      </div>

      <div className="card-toss" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
        {/* Mock Map Area */}
        <div style={{ height: '200px', background: 'var(--bg-card-hover)', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2, backgroundImage: 'radial-gradient(var(--border-color) 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <MapPin size={40} color="var(--primary)" style={{ margin: '0 auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
            <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>
              내 주변 미션
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {missions.map(mission => (
          <div key={mission.id} className="card-toss" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{mission.requirer}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>{mission.title}</h3>
              </div>
              <div style={{ background: 'rgba(50, 215, 75, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <DollarSign size={16} />
                {mission.reward.toLocaleString()}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {mission.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: 'auto' }}>
                <Navigation size={14} /> {mission.distance}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {activeMission === mission.id ? (
                <button 
                  onClick={() => {
                    alert("현장 도착 후 AI 음성 인터뷰가 시작됩니다.");
                    setActiveMission(null);
                  }}
                  className="btn-primary" 
                  style={{ background: 'var(--primary)' }}
                >
                  <Mic size={18} /> 현장 코멘터리 남기기
                </button>
              ) : (
                <button 
                  onClick={() => setActiveMission(mission.id)}
                  className="btn-primary" 
                  style={{ background: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}
                >
                  현장으로 이동하기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
