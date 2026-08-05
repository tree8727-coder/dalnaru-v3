"use client";

import { useState } from "react";
import { MapPin, Camera, Navigation, DollarSign } from "lucide-react";

export default function LocalObserver() {
  const [activeMission, setActiveMission] = useState<number | null>(null);

  const missions = [
    {
      id: 1,
      title: "강남역 4번 출구 B상가 임대 문의 현수막 촬영",
      requirer: "프롭테크 스타트업 A",
      distance: "현재 위치에서 300m",
      reward: 3000,
    },
    {
      id: 2,
      title: "역삼동 123-4 골목길 보행자 통행량 5분 체크",
      requirer: "상권 분석 솔루션 B",
      distance: "현재 위치에서 800m",
      reward: 5000,
    }
  ];

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>동네 옵저버 미션</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>산책 겸 동네의 생생한 현장 정보를 수집하고 용돈을 벌어보세요.</p>
      </div>

      <div className="card-toss" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
        {/* Mock Map Area */}
        <div style={{ height: '200px', background: 'var(--bg-card-hover)', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2, backgroundImage: 'radial-gradient(var(--border-color) 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <MapPin size={40} color="var(--primary)" style={{ margin: '0 auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
            <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>
              현재 내 위치
            </div>
          </div>
          
          {/* Mock Pins */}
          <div style={{ position: 'absolute', top: '40px', right: '60px' }}>
            <div style={{ width: '20px', height: '20px', background: 'var(--warning)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}></div>
          </div>
          <div style={{ position: 'absolute', bottom: '60px', left: '80px' }}>
            <div style={{ width: '20px', height: '20px', background: 'var(--warning)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}></div>
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
              <div style={{ background: 'rgba(255, 159, 10, 0.1)', color: 'var(--warning)', padding: '6px 12px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <DollarSign size={16} />
                {mission.reward.toLocaleString()}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={14} /> {mission.distance}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {activeMission === mission.id ? (
                <button 
                  onClick={() => {
                    alert("카메라 앱이 실행됩니다. (데모)");
                    setActiveMission(null);
                  }}
                  className="btn-primary" 
                  style={{ background: 'var(--success)' }}
                >
                  <Camera size={18} /> 촬영 후 미션 완료하기
                </button>
              ) : (
                <button 
                  onClick={() => setActiveMission(mission.id)}
                  className="btn-primary" 
                  style={{ background: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}
                >
                  이 미션 수락하기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
