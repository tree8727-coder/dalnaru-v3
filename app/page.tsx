"use client";

import { useState } from "react";
import MyStoryBank from "@/components/MyStoryBank";
import LocalObserver from "@/components/LocalObserver";
import CommunityPipelines from "@/components/CommunityPipelines";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"story" | "observer" | "pipeline">("story");

  return (
    <main className="container animate-fade-up">
      <div className="header-area">
        <h1 className="header-title">달나루 V40</h1>
        <p className="header-desc">우리의 경험이 세상의 데이터가 됩니다</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === "story" ? "active" : ""}`}
          onClick={() => setActiveTab("story")}
        >
          마이 스토리 뱅크
        </button>
        <button 
          className={`tab ${activeTab === "observer" ? "active" : ""}`}
          onClick={() => setActiveTab("observer")}
        >
          동네 옵저버
        </button>
        <button 
          className={`tab ${activeTab === "pipeline" ? "active" : ""}`}
          onClick={() => setActiveTab("pipeline")}
        >
          블록 파이프라인
        </button>
      </div>

      <div style={{ minHeight: '60vh', position: 'relative' }}>
        {activeTab === "story" && <MyStoryBank />}
        {activeTab === "observer" && <LocalObserver />}
        {activeTab === "pipeline" && <CommunityPipelines />}
      </div>
    </main>
  );
}
