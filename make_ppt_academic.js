const pptxgen = require('pptxgenjs');

let pres = new pptxgen();

// Slide 1: Title
let slide1 = pres.addSlide();
slide1.background = { color: "111111" };
slide1.addText("정보 서비스 햄스터 프로젝트", { x: 1, y: 1.2, w: 8, h: 1, fontSize: 24, color: "00BFFF", bold: true, align: "center" });
slide1.addText("달나루 (Dalnaru)\n반퇴시장(5060) 페르소나 RAG 정보 서비스", { x: 1, y: 2, w: 8, h: 1.5, fontSize: 36, color: "FFFFFF", bold: true, align: "center" });
slide1.addImage({ path: "C:/Users/tree0/.gemini/antigravity/brain/da6edb8d-529e-41fe-8991-f1f797501773/dalnaru_logo_1785921820979.jpg", x: 4, y: 3.8, w: 2, h: 2 });

// Slide 2: Seeding
let slide2 = pres.addSlide();
slide2.background = { color: "111111" };
slide2.addText("Seeding: 타겟 및 전략 기초 수립", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide2.addText([
    { text: "• 타겟 고객 (반퇴시장)\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "  B2C: 은퇴와 자녀 부양 사이에 낀 '5060 끼인 세대'\n  B2B: 5060의 속마음 데이터가 절실한 대기업 및 금융사\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "• 니즈 및 제공 가치\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "  B2C: 외로움 해소를 위한 'AI 라이프 코칭 (홀리스틱 플래닝)'\n  B2B: 1분 만에 끝나는 초고속 '에이전틱 마켓 리서치'\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "• 포지셔닝 (차별화)\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "  기존 금융사가 못하는 '정서적 케어'를 미끼로 독점적 딥(Deep) 데이터를 구축.", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 1.8, w: 9, h: 4, valign: "top" });

// Slide 3: Step 1 & 2
let slide3 = pres.addSlide();
slide3.background = { color: "111111" };
slide3.addText("1~2단계: 고객 니즈 조사 및 데이터 정제", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide3.addText([
    { text: "크롤링의 한계 극복: 앱 내부의 은밀한 대화를 데이터화\n", options: { fontSize: 22, color: "00BFFF", bold: true, breakLine: true } },
    { text: "5060은 인터넷 커뮤니티에 진짜 자산 규모나 속마음을 쓰지 않습니다.\n기존 웹 크롤링 대신, 달나루 앱의 'AI 라이프 코치'와의 1:1 대화 자체가\n순도 100%의 니즈 조사 창구(First-party Data)가 됩니다.\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "데이터 발견 및 추출 방법론 (LLM 정제)\n", options: { fontSize: 22, color: "00BFFF", bold: true, breakLine: true } },
    { text: "감정이 섞인 하소연이나 파편화된 비정형 대화를 LLM을 통해\n'키워드, 성향 태그, 자산 규모' 등의 정형화된 데이터로 1차 정제합니다.", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 1.8, w: 9, h: 4, valign: "top" });

// Slide 4: Step 3 (with UI)
let slide4 = pres.addSlide();
slide4.background = { color: "111111" };
slide4.addText("3단계: 지식화 및 주요 정보 DB 구축 (Persona RAG)", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: "FFFFFF", bold: true });
slide4.addImage({ path: "C:/Users/tree0/.gemini/antigravity/brain/da6edb8d-529e-41fe-8991-f1f797501773/dalnaru_ui_mockup_1785921841464.jpg", x: 0.5, y: 1.5, w: 4.5, h: 2.5 });
slide4.addText([
    { text: "기술적 해자: 벡터 DB와 디지털 쌍둥이\n", options: { fontSize: 20, color: "FF5555", bold: true, breakLine: true } },
    { text: "단순 관계형 DB가 아닌 벡터 DB에 유저의 기억을 저장하여 '페르소나 쌍둥이'를 구축.\n\n", options: { fontSize: 16, color: "DDDDDD", breakLine: true } },
    { text: "지식의 활용 (시뮬레이션)\n", options: { fontSize: 20, color: "FF5555", bold: true, breakLine: true } },
    { text: "대기업이 질문을 던지면, 5,000명의 쌍둥이가 각자의 DB를 바탕으로 추론/토론하여 1분 만에 리서치 결과를 도출합니다.", options: { fontSize: 16, color: "DDDDDD", breakLine: true } }
], { x: 5.2, y: 1.5, w: 4.5, h: 3, valign: "top" });

// Slide 5: Step 4 & 5
let slide5 = pres.addSlide();
slide5.background = { color: "111111" };
slide5.addText("4~5단계: 유지 관리 및 웹서비스 개발", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide5.addText([
    { text: "4단계: 업데이트, 확장, 유지 관리 전략\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "유저가 앱을 계속 써야 최신 데이터가 유지됩니다. B2B 리서치 수익의 일부를 데이터 제공자인 시니어에게 '금융 치료(배당)' 형태로 지급하여 폭발적인 자발적 업데이트를 유도합니다.\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "5단계: 프론트/백엔드 웹서비스 구축\n", options: { fontSize: 22, color: "00FF88", bold: true, breakLine: true } },
    { text: "Next.js 및 AI(RAG) 연동 기반의 실시간 대시보드 구축 완료.\n현재 프로토타입 라이브 연동: https://dalnaru-v3.vercel.app/", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 1.8, w: 9, h: 4, valign: "top" });

// Slide 6: Step 6
let slide6 = pres.addSlide();
slide6.background = { color: "111111" };
slide6.addText("6단계: 브랜딩 및 수익화 전략", { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: "FFFFFF", bold: true });
slide6.addImage({ path: "C:/Users/tree0/.gemini/antigravity/brain/da6edb8d-529e-41fe-8991-f1f797501773/dalnaru_mascot_1785921831768.jpg", x: 6.5, y: 1.5, w: 3, h: 3 });
slide6.addText([
    { text: "브랜딩 (달나루)\n", options: { fontSize: 22, color: "00BFFF", bold: true, breakLine: true } },
    { text: "• 브랜드명: 세대와 세대를 잇는 나루터\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "• 마스코트: 지혜와 기술(Digital Twin)의 상징\n\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "수익화 모델 (B2B)\n", options: { fontSize: 22, color: "00BFFF", bold: true, breakLine: true } },
    { text: "• Pay-per-Query: 기업의 1회 시뮬레이션 당 리서치 수수료\n", options: { fontSize: 18, color: "DDDDDD", breakLine: true } },
    { text: "• Enterprise 구독: 자사 전용 페르소나 그룹 모니터링", options: { fontSize: 18, color: "DDDDDD", breakLine: true } }
], { x: 0.5, y: 1.8, w: 6, h: 4, valign: "top" });

pres.writeFile({ fileName: "Dalnaru_Academic_Pitch.pptx" }).then(() => {
    console.log("Academic PPTX created successfully!");
});
