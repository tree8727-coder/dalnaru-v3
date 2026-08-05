"use client";

import { useState } from "react";
import { DB } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { Bookmark } from "lucide-react";
import Certifications from "@/components/Certifications";
import PensionCalculator from "@/components/PensionCalculator";
import SeniorServices from "@/components/SeniorServices";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"ai" | "jobs" | "pension" | "services">("ai");
  const [search, setSearch] = useState("");
  const { bookmarks, toggleBookmark } = useAuth();

  const filteredDB = DB.filter((item: any) => 
    item.title?.includes(search) || item.desc?.includes(search)
  ).slice(0, 30); // show only first 30 for performance

  return (
    <main className="container animate-fade-in">
      <div className="header-area">
        <h1 className="header-title">5060 반퇴자를 위한 두 번째 항해, 달나루</h1>
        <p className="header-desc">필요한 정보를 입력할 필요 없이, 접속하자마자 즉시 원하는 콘텐츠를 찾아보세요.</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          🛠️ AI 창업 도구 & 레시피
        </button>
        <button 
          className={`tab ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          💼 5060 유망 자격증 분석
        </button>
        <button 
          className={`tab ${activeTab === "pension" ? "active" : ""}`}
          onClick={() => setActiveTab("pension")}
        >
          📊 은퇴 자산 진단기
        </button>
        <button 
          className={`tab ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          🤝 시니어 전문가 매칭
        </button>
      </div>

      {activeTab === "ai" && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '24px' }}>
            <input 
              type="text" 
              placeholder="창업 도구나 키워드를 검색해보세요... (예: 마케팅, 영상)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'white',
                fontSize: '1.1rem'
              }}
            />
          </div>
          
          <div className="grid">
            {filteredDB.map((item: any) => (
              <div key={item.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div className="card-title" style={{ marginBottom: 0 }}>{item.title}</div>
                  <button 
                    onClick={() => toggleBookmark(item.id)}
                    style={{ color: bookmarks.includes(item.id) ? 'var(--warning)' : 'var(--text-secondary)' }}
                  >
                    <Bookmark size={20} fill={bookmarks.includes(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div><span className="card-cat">{item.cat1} &gt; {item.cat2}</span></div>
                <div className="card-desc">{item.desc}</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {item.price === 'free' && <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>무료</span>}
                  {item.price === 'paid' && <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>유료</span>}
                  {item.d_score && <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>달나루지수 {item.d_score}</span>}
                </div>
                <a href={item.link} target="_blank" rel="noreferrer" className="card-btn">바로가기</a>
              </div>
            ))}
            {filteredDB.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1' }}>검색 결과가 없습니다.</p>}
          </div>
        </div>
      )}

      {activeTab === "jobs" && <Certifications />}
      {activeTab === "pension" && <PensionCalculator />}
      {activeTab === "services" && <SeniorServices />}
    </main>
  );
}
