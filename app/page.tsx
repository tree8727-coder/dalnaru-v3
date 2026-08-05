"use client";

import { useState } from "react";
import DigitalTwin from "@/components/DigitalTwin";
import PersonaRAG from "@/components/PersonaRAG";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"twin" | "rag">("twin");

  return (
    <main className="container animate-fade-up">
      <div className="header-area">
        <h1 className="header-title">달나루 V60</h1>
        <p className="header-desc">내 삶의 디지털 쌍둥이 & 페르소나 RAG</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === "twin" ? "active" : ""}`}
          onClick={() => setActiveTab("twin")}
        >
          나의 디지털 쌍둥이 (B2C)
        </button>
        <button 
          className={`tab ${activeTab === "rag" ? "active" : ""}`}
          onClick={() => setActiveTab("rag")}
        >
          페르소나 리서치 (B2B)
        </button>
      </div>

      <div style={{ minHeight: '60vh', position: 'relative' }}>
        {activeTab === "twin" && <DigitalTwin />}
        {activeTab === "rag" && <PersonaRAG />}
      </div>
    </main>
  );
}
