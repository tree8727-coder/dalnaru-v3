"use client";

import { useState } from "react";
import Certifications from "@/components/Certifications";
import PensionCalculator from "@/components/PensionCalculator";
import SeniorMentoring from "@/components/SeniorMentoring";
import AITelemarket from "@/components/AITelemarket";
import AITools from "@/components/AITools";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pension" | "mentoring" | "jobs" | "ai" | "telemarket">("pension");

  return (
    <main className="container animate-fade-in">
      <div className="header-area">
        <h1 className="header-title">5060 반퇴자를 위한 두 번째 항해, 달나루</h1>
        <p className="header-desc">필요한 정보를 입력할 필요 없이, 접속하자마자 즉시 원하는 콘텐츠를 찾아보세요.</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === "pension" ? "active" : ""}`}
          onClick={() => setActiveTab("pension")}
        >
          📊 은퇴 자산 진단기
        </button>
        <button 
          className={`tab ${activeTab === "mentoring" ? "active" : ""}`}
          onClick={() => setActiveTab("mentoring")}
        >
          🤝 시니어 전문가 매칭
        </button>
        <button 
          className={`tab ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          💼 5060 유망 자격증 분석
        </button>
        <button 
          className={`tab ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          🛠️ AI 창업 도구 & 레시피
        </button>
        <button 
          className={`tab ${activeTab === "telemarket" ? "active" : ""}`}
          onClick={() => setActiveTab("telemarket")}
        >
          🎙️ AI 텔레마켓 비서
        </button>
      </div>

      <div style={{ minHeight: '60vh' }}>
        {activeTab === "pension" && <PensionCalculator />}
        {activeTab === "mentoring" && <SeniorMentoring />}
        {activeTab === "jobs" && <Certifications />}
        {activeTab === "ai" && <AITools />}
        {activeTab === "telemarket" && <AITelemarket />}
      </div>
    </main>
  );
}
