"use client";

import { useState } from "react";
import MicroTaskMatching from "@/components/MicroTaskMatching";
import AIWorkflows from "@/components/AIWorkflows";
import AIVoiceConcierge from "@/components/AIVoiceConcierge";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"tasks" | "workflows" | "voice">("tasks");

  return (
    <main className="container animate-fade-up">
      <div className="header-area">
        <h1 className="header-title">달나루 V30</h1>
        <p className="header-desc">경험을 가치로, 일상을 더 편하게</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          경험으로 돈벌기
        </button>
        <button 
          className={`tab ${activeTab === "workflows" ? "active" : ""}`}
          onClick={() => setActiveTab("workflows")}
        >
          AI 파이프라인
        </button>
        <button 
          className={`tab ${activeTab === "voice" ? "active" : ""}`}
          onClick={() => setActiveTab("voice")}
        >
          일상 비서
        </button>
      </div>

      <div style={{ minHeight: '60vh', position: 'relative' }}>
        {activeTab === "tasks" && <MicroTaskMatching />}
        {activeTab === "workflows" && <AIWorkflows />}
        {activeTab === "voice" && <AIVoiceConcierge />}
      </div>
    </main>
  );
}
