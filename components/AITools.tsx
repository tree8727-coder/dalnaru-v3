"use client";

import { useState, useMemo } from "react";
import { Bookmark, Search } from "lucide-react";
import { DB } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

export default function AITools() {
  const [search, setSearch] = useState("");
  const { bookmarks, toggleBookmark } = useAuth();

  // Filter and group data
  const groupedTools = useMemo(() => {
    const filtered = DB.filter((item: any) => 
      item.title?.toLowerCase().includes(search.toLowerCase()) || 
      item.desc?.toLowerCase().includes(search.toLowerCase()) ||
      item.cat1?.toLowerCase().includes(search.toLowerCase()) ||
      item.cat2?.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50); // increased limit slightly for categories

    const groups: Record<string, typeof DB> = {};
    
    filtered.forEach((item: any) => {
      const category = item.cat1 || "기타";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return groups;
  }, [search]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="창업 도구나 키워드를 검색해보세요... (예: 마케팅, 영상, 프롬프트)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 16px 16px 48px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'white',
            fontSize: '1.1rem',
            boxShadow: 'var(--shadow-sm)',
            outline: 'none',
            transition: 'border 0.2s, box-shadow 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = 'var(--shadow-sm)';
          }}
        />
      </div>

      {Object.keys(groupedTools).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '1.1rem' }}>검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
        </div>
      ) : (
        Object.entries(groupedTools).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{category}</h3>
              <div style={{ height: '1px', background: 'var(--border-color)', flex: 1 }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
                {items.length}개
              </span>
            </div>
            
            <div className="grid">
              {items.map((item: any) => (
                <div key={item.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div className="card-title" style={{ marginBottom: 0, fontSize: '1.15rem' }}>{item.title}</div>
                    <button 
                      onClick={() => toggleBookmark(item.id)}
                      style={{ color: bookmarks.includes(item.id) ? 'var(--warning)' : 'var(--text-secondary)', transition: 'color 0.2s', padding: '4px', cursor: 'pointer', border: 'none', background: 'transparent' }}
                      title="북마크"
                    >
                      <Bookmark size={22} fill={bookmarks.includes(item.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div>
                    <span className="card-cat">{item.cat1} &gt; {item.cat2}</span>
                  </div>
                  <div className="card-desc" style={{ fontSize: '0.95rem' }}>{item.desc}</div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {item.price === 'free' && <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>무료</span>}
                    {item.price === 'paid' && <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>유료</span>}
                    {item.d_score && <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>달나루지수 {item.d_score}</span>}
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer" className="card-btn" style={{ display: 'block', textDecoration: 'none' }}>바로가기</a>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
