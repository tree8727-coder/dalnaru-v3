"use client";

import { useState } from "react";
import { certData, getCertStats, getReadOut } from "@/lib/certData";
import { useAuth } from "@/context/AuthContext";
import { Bookmark } from "lucide-react";

export default function Certifications() {
  const [fee, setFee] = useState(1200000);
  const [rate, setRate] = useState(85);
  const [mon, setMon] = useState(3);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"gap" | "demand" | "yoy" | "density">("gap");
  
  const { bookmarks, toggleBookmark } = useAuth();
  const { mD, mG, mDens } = getCertStats();

  const won = (n: number) => n.toLocaleString("ko-KR") + "원";
  const num = (n: number) => n.toLocaleString("ko-KR");

  const own = Math.round(fee * (100 - rate) / 100);

  let sortedData = certData.filter(x => x.n.includes(query));
  sortedData.sort((a, b) => {
    if (sortKey === "gap") return (b.gap || 0) - (a.gap || 0);
    if (sortKey === "demand") return b.d - a.d;
    if (sortKey === "yoy") return (b.yoy || 0) - (a.yoy || 0);
    return a.dens - b.dens;
  });

  return (
    <div className="animate-fade-in" style={{ fontSize: '1.15rem' }}>
      
      {/* Cost Calculator Section */}
      <section style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '32px' 
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>💰 내가 실제로 내는 돈 (내일배움카드)</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem' }}>
          국민내일배움카드는 훈련비의 일부를 정부가 부담합니다. 총액이 아니라 자기부담금으로 계산해보세요.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>훈련비 총액 (원)</label>
            <input 
              type="number" 
              value={fee} 
              onChange={e => setFee(Number(e.target.value))}
              style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white' }} 
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>정부 지원율 (%)</label>
            <select 
              value={rate} 
              onChange={e => setRate(Number(e.target.value))}
              style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white' }}
            >
              <option value="45">45% — 일반 (하한)</option>
              <option value="55">55% — 일반</option>
              <option value="65">65% — 일반 상위</option>
              <option value="75">75% — 구직자·저소득</option>
              <option value="85">85% — 구직자·저소득 (상한)</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>예상 소요 개월</label>
            <input 
              type="number" 
              value={mon} 
              onChange={e => setMon(Number(e.target.value))}
              style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white' }} 
            />
          </div>
        </div>

        <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-highlight)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '8px' }}>
            {won(own)}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            총액 {won(fee)} 중 정부 지원 {won(fee - own)} ({rate}%) · <strong>자기부담 {won(own)}</strong><br />
            월 환산 <strong>{won(Math.round(own / mon))}</strong> · 하루 약 {won(Math.round(own / (mon * 30)))}
          </div>
        </div>
      </section>

      {/* Certifications Search and Filter */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="자격증 이름을 검색해보세요... (어르신들도 보기 쉽게 큰 글씨입니다)" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-color)',
            color: 'white',
            fontSize: '1.3rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { key: "gap", label: "정보 공백 큰 순" },
          { key: "demand", label: "찾는 사람 많은 순" },
          { key: "yoy", label: "점유율 상승 순" },
          { key: "density", label: "정보 적은 순" }
        ].map(tab => (
          <button 
            key={tab.key}
            onClick={() => setSortKey(tab.key as any)}
            style={{
              padding: '12px 24px',
              borderRadius: '99px',
              fontSize: '1.1rem',
              fontWeight: 700,
              background: sortKey === tab.key ? 'var(--primary)' : 'var(--bg-card)',
              color: sortKey === tab.key ? 'white' : 'var(--text-secondary)',
              border: `2px solid ${sortKey === tab.key ? 'var(--primary)' : 'var(--border-color)'}`,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {sortedData.map((x, i) => {
          const isBookmarked = bookmarks.includes(x.id);
          const barG = ((x.d / mD) * 100).toFixed(1) + '%';
          const barW = ((Math.log10(x.dens + 10) / Math.log10(mDens + 10)) * 100).toFixed(1) + '%';
          const barGap = (((x.gap || 0) / mG) * 100).toFixed(1) + '%';
          
          return (
            <div key={x.id} style={{
              background: 'var(--bg-card)',
              border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--border-color)'}`,
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '20px',
              transition: 'transform 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px' }}>
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>{x.n}</h3>
                </div>
                <button 
                  onClick={() => toggleBookmark(x.id)}
                  style={{ color: isBookmarked ? 'var(--warning)' : 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Bookmark size={32} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {x.gap! >= 15 ? (
                  <span style={{ padding: '6px 12px', background: 'var(--primary)', color: 'white', borderRadius: '99px', fontSize: '1rem', fontWeight: 700 }}>정보 공백 큼</span>
                ) : x.gap! >= 7 ? (
                  <span style={{ padding: '6px 12px', background: 'var(--text-secondary)', color: 'white', borderRadius: '99px', fontSize: '1rem', fontWeight: 700 }}>보통</span>
                ) : (
                  <span style={{ padding: '6px 12px', background: 'var(--border-color)', color: 'var(--text-secondary)', borderRadius: '99px', fontSize: '1rem', fontWeight: 700 }}>정보 충분</span>
                )}
                
                <span style={{ 
                  padding: '6px 12px', 
                  border: `2px solid ${x.yoy! > -15 ? 'var(--success)' : 'var(--danger)'}`, 
                  color: x.yoy! > -15 ? 'var(--success)' : 'var(--danger)', 
                  borderRadius: '99px', 
                  fontSize: '1rem', 
                  fontWeight: 700 
                }}>
                  점유율 {x.yoy! > 0 ? '+' : ''}{x.yoy}%
                </span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>찾는 사람 (요양보호사=100)</span>
                    <strong style={{ color: 'white' }}>{x.d}</strong>
                  </div>
                  <div style={{ height: '12px', background: 'var(--bg-color)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', width: barG, borderRadius: '99px' }}></div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>관련 문서 수</span>
                    <strong style={{ color: 'white' }}>{num(x.dens)}건</strong>
                  </div>
                  <div style={{ height: '12px', background: 'var(--bg-color)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--warning)', width: barW, borderRadius: '99px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>정보 공백 지수</span>
                    <strong style={{ color: 'white' }}>{x.gap}</strong>
                  </div>
                  <div style={{ height: '12px', background: 'var(--bg-color)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'white', width: barGap, borderRadius: '99px' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {getReadOut(x)}
              </div>
            </div>
          );
        })}
        {sortedData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '1.3rem' }}>
            해당하는 자격증이 없습니다. 다른 이름으로 검색해 보세요.
          </div>
        )}
      </div>

    </div>
  );
}
