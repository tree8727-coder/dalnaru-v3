"use client";

import { useState } from "react";
import MyStoryBank from "@/components/MyStoryBank";
import LocalVeteranInsight from "@/components/LocalVeteranInsight";
import CommunityPipelines from "@/components/CommunityPipelines";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"story" | "insight" | "pipeline">("story");

  return (
    <main className="container animate-fade-up">
      <div className="header-area">
        <h1 className="header-title">달나루 V50</h1>
        <p className="header-desc">세상의 모든 지혜와 맥락을 모으다</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === "story" ? "active" : ""}`}
          onClick={() => setActiveTab("story")}
        >
          마이 스토리 뱅크
        </button>
        <button 
          className={`tab ${activeTab === "insight" ? "active" : ""}`}
          onClick={() => setActiveTab("insight")}
        >
          토박이 인사이트
        </button>
        <button 
          className={`tab ${activeTab === "pipeline" ? "active" : ""}`}
          onClick={() => setActiveTab("pipeline")}
        >
          AI 블록 공작소
        </button>
      </div>

      <div style={{ minHeight: '60vh', position: 'relative' }}>
        {activeTab === "story" && <MyStoryBank />}
        {activeTab === "insight" && <LocalVeteranInsight />}
        {activeTab === "pipeline" && <CommunityPipelines />}
      </div>
    </main>
  );
}
