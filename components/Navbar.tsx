"use client";

import { useAuth } from "@/context/AuthContext";
import { Bookmark, LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, login, logout, bookmarks } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-emoji">🚀</span>
          <span className="logo-text">달나루 V30</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={18} />
            찜한 레시피 ({bookmarks.length})
          </button>
          {user ? (
            <button className="nav-btn" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={18} />
              로그아웃
            </button>
          ) : (
            <button className="nav-btn" onClick={login} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', borderColor: 'var(--primary)' }}>
              <LogIn size={18} />
              구글 로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
