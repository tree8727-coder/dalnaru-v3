const pptxgen = require('pptxgenjs');

let pres = new pptxgen();

// Slide 1: Title
let slide1 = pres.addSlide();
slide1.background = { color: "111111" };
slide1.addText("달나루 (Dalnaru)", { x: 1, y: 1.5, w: 8, h: 1, fontSize: 44, color: "FFFFFF", bold: true, align: "center" });
slide1.addText("The First Persona RAG Network for the Silver Economy\n시니어의 '디지털 쌍둥이'로 완성하는 초고속 B2B 마켓 리서치 플랫폼", { x: 1, y: 2.5, w: 8, h: 1, fontSize: 18, color: "AAAAAA", align: "center" });
slide1.addImage({ path: "C:/Users/tree0/.gemini/antigravity/brain/da6edb8d-529e-41fe-8991-f1f797501773/dalnaru_logo_1785921820979.jpg", x: 4, y: 3.5, w: 2, h: 2 });
slide1.addText("Demo: https://dalnaru-v3.vercel.app/", { x: 1, y: 6, w: 8, h: 0.5, fontSize: 14, color: "00BFFF", align: "center" });

// Slide 2: Problem
let slide2 = pres.addSlide();
slide2.background = { color: "111111" };
slide2.addText("The Problem: 거대한 시장, 존재하지 않는 데이터", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide2.addText([
    { text: "• The Wealth Gap: 5060 액티브 시니어는 전체 자산의 60% 이상을 통제하는 핵심 소비층.\n", options: { fontSize: 20, color: "DDDDDD", breakLine: true } },
    { text: "• The Data Blackhole: 하지만 이들은 인스타그램에 '진짜 속마음'과 소비 패턴을 텍스트로 남기지 않음.\n", options: { fontSize: 20, color: "DDDDDD", breakLine: true } },
    { text: "• Current Failure: 대기업은 수억 원을 들여 3개월씩 걸리는 오프라인 FGI를 하거나, 시니어의 진짜 뉘앙스를 모르는 '가짜 합성 AI'에 의존 중.", options: { fontSize: 20, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 2, w: 9, h: 3, valign: "top" });

// Slide 3: Solution
let slide3 = pres.addSlide();
slide3.background = { color: "111111" };
slide3.addText("The Solution: 100% 리얼 데이터 기반 '디지털 쌍둥이'", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide3.addText([
    { text: "달나루 엔진: 가짜 AI가 아닌, 실제 시니어의 기억을 100% 복제한 RAG 네트워크\n\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "• B2C (Data Ingestion): 시니어가 앱과 매일 대화하며 자신의 '자서전 AI'를 육성\n", options: { fontSize: 20, color: "DDDDDD", breakLine: true } },
    { text: "• B2B (Data Query): 대기업은 수천 명의 시니어 쌍둥이에게 동시에 질문을 던지고 단 1분 만에 시뮬레이션 결과 획득", options: { fontSize: 20, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 2, w: 9, h: 3, valign: "top" });

// Slide 4: Product
let slide4 = pres.addSlide();
slide4.background = { color: "111111" };
slide4.addText("Product & Traction: 에이전틱 리서치 대시보드", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide4.addImage({ path: "C:/Users/tree0/.gemini/antigravity/brain/da6edb8d-529e-41fe-8991-f1f797501773/dalnaru_ui_mockup_1785921841464.jpg", x: 1, y: 1.5, w: 8, h: 4.5 });
slide4.addText("1 Minute Insight: 5,000명의 RAG 기반 쌍둥이가 즉시 토론하여 리얼 데이터 도출", { x: 0.5, y: 6.2, w: 9, h: 0.5, fontSize: 18, color: "DDDDDD", align: "center" });

// Slide 5: Why Now
let slide5 = pres.addSlide();
slide5.background = { color: "111111" };
slide5.addText("Why Now? 왜 지금 달나루인가?", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide5.addText([
    { text: "1. AI & LLM의 성숙 (RAG 상용화)\n", options: { fontSize: 22, color: "00BFFF", bold: true, breakLine: true } },
    { text: "환각(Hallucination) 없이 개인의 기억만을 정확히 검색해 답변하는 RAG 기술이 완벽해짐.\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "2. 은퇴 인구의 폭발 (은퇴의 정점)\n", options: { fontSize: 22, color: "00BFFF", bold: true, breakLine: true } },
    { text: "자신의 경험을 남기고 싶어 하는 5060 베이비붐 세대의 스마트폰 활용 능력이 최상위.", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 2, w: 9, h: 3, valign: "top" });

// Slide 6: Moat
let slide6 = pres.addSlide();
slide6.background = { color: "111111" };
slide6.addText("The Unfair Advantage (Moat)", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide6.addImage({ path: "C:/Users/tree0/.gemini/antigravity/brain/da6edb8d-529e-41fe-8991-f1f797501773/dalnaru_mascot_1785921831768.jpg", x: 6, y: 2, w: 3, h: 3 });
slide6.addText([
    { text: "• Proprietary Data (독점적 데이터)\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "인터넷 크롤링으로 얻을 수 없는 딥(Deep) 메모리 데이터.\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "• Infinite Switching Cost (무한대의 전환 비용)\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "6개월간 학습시킨 완벽한 분신 '자서전 AI'를 버리고 이탈할 유저는 0명.", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 2, w: 5, h: 3, valign: "top" });

// Slide 7: Business Model & Vision
let slide7 = pres.addSlide();
slide7.background = { color: "111111" };
slide7.addText("Business Model & Vision", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide7.addText([
    { text: "B2B SaaS + Revenue Share\n", options: { fontSize: 22, color: "FF5555", bold: true, breakLine: true } },
    { text: "• 기업: Pay-per-Query 기반 리서치 과금 및 구독 모델\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "• 시니어: 리서치 수익 배당으로 자발적 데이터 입력 유도 (Financial Lock-in)\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "Vision: 세대 간 지식을 잇는 인프라\n", options: { fontSize: 22, color: "FF5555", bold: true, breakLine: true } },
    { text: "인터넷에 없던 5060의 암묵지를 세계 최초로 디지털 자산화(Digital Asset)하는 글로벌 에이지테크 인프라.", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 2, w: 9, h: 3, valign: "top" });

pres.writeFile({ fileName: "Dalnaru_V60_Pitch.pptx" }).then(() => {
    console.log("PPTX created successfully!");
});
