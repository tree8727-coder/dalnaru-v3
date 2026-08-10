/**
 * Firestore 연결만 둔다.
 *
 * 2026-08-11: Auth(getAuth·구글 로그인)를 걷어냈다. v1 북마크 기능의 잔재였고
 * 쓰는 화면이 하나도 없었는데, 이 파일이 최상단에서 getAuth()를 부르는 탓에
 * 퍼널을 여는 것만으로 firebase/auth가 딸려오고 매 페이지 로드마다
 * identitytoolkit 요청이 400으로 떨어졌다(프로덕션 실측).
 * 로그인이 필요해지면 그때 되살린다 — 지금 없는 기능의 값을 5060 사용자의
 * 낡은 폰이 대신 치르고 있었다.
 *
 * 아래 설정값은 Firebase 웹 클라이언트 키다. 공개되는 것이 정상이며,
 * 실제 보호는 `firestore.rules`가 한다 (funnel_sessions는 쓰기 전용).
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh_deQwmKC8_iHa9uUn5-u9TJr-s7FGng",
  authDomain: "dalnaru.firebaseapp.com",
  projectId: "dalnaru",
  storageBucket: "dalnaru.firebasestorage.app",
  messagingSenderId: "464527963320",
  appId: "1:464527963320:web:854efde70bcfb721cef04d",
  measurementId: "G-DLEFZWSEHZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db, doc, setDoc };
