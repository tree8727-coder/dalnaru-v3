export interface CertData {
  id: string;
  n: string;
  d: number;
  p: number;
  dens: number;
  gap?: number;
  yoy?: number;
}

export const certRawData: CertData[] = [
 {id: 'c1', n:"산업안전기사",d:163.2,p:184.5,dens:34315},
 {id: 'c2', n:"사회복지사2급",d:108.8,p:123.2,dens:191789},
 {id: 'c3', n:"요양보호사",d:96.5,p:103.5,dens:109591},
 {id: 'c4', n:"정보처리기사",d:79.7,p:111.6,dens:55645},
 {id: 'c5', n:"주택관리사",d:79.0,p:93.4,dens:33414},
 {id: 'c6', n:"전기기사",d:73.2,p:96.8,dens:57554},
 {id: 'c7', n:"공인중개사",d:72.4,p:111.9,dens:420745},
 {id: 'c8', n:"전기기능사",d:70.8,p:75.9,dens:39921},
 {id: 'c9', n:"컴퓨터활용능력",d:45.6,p:58.3,dens:114995},
 {id: 'c10', n:"소방설비기사",d:45.0,p:57.3,dens:25354},
 {id: 'c11', n:"산업안전산업기사",d:43.5,p:60.2,dens:13389},
 {id: 'c12', n:"경비지도사",d:30.5,p:38.1,dens:18893},
 {id: 'c13', n:"물류관리사",d:30.0,p:43.4,dens:17196},
 {id: 'c14', n:"조경기능사",d:29.0,p:37.5,dens:8600},
 {id: 'c15', n:"위험물기능사",d:28.2,p:36.1,dens:4745},
 {id: 'c16', n:"청소년상담사",d:24.5,p:35.5,dens:27421},
 {id: 'c17', n:"임상심리사2급",d:23.7,p:31.7,dens:10891},
 {id: 'c18', n:"직업상담사",d:23.3,p:33.7,dens:83118},
 {id: 'c19', n:"건축기사",d:20.3,p:32.0,dens:37580},
 {id: 'c20', n:"한식조리기능사",d:19.8,p:22.4,dens:16190},
 {id: 'c21', n:"자동차정비기능사",d:17.4,p:23.0,dens:7643},
 {id: 'c22', n:"지게차운전기능사",d:16.3,p:32.2,dens:11795},
 {id: 'c23', n:"건축도장기능사",d:14.1,p:18.4,dens:7668},
 {id: 'c24', n:"가스기능사",d:14.1,p:20.5,dens:4087},
 {id: 'c25', n:"토목기사",d:14.0,p:19.9,dens:13756},
 {id: 'c26', n:"보육교사",d:13.0,p:18.8,dens:28557},
 {id: 'c27', n:"방수기능사",d:10.8,p:14.2,dens:6239},
 {id: 'c28', n:"전기공사기사",d:9.3,p:12.1,dens:10138},
 {id: 'c29', n:"굴착기운전기능사",d:8.2,p:9.0,dens:3995},
 {id: 'c30', n:"미용사",d:5.2,p:7.7,dens:145801},
 {id: 'c31', n:"제과기능사",d:5.2,p:7.7,dens:43820}
];

export const certData = certRawData.map(x => {
  return {
    ...x,
    gap: +(x.d / Math.log10(x.dens + 10)).toFixed(1),
    yoy: x.p > 0 ? +(((x.d - x.p) / x.p) * 100).toFixed(1) : 0,
  };
});

export const getCertStats = () => {
  const mD = Math.max(...certData.map(x => x.d));
  const mG = Math.max(...certData.map(x => x.gap || 0));
  const mDens = Math.max(...certData.map(x => x.dens));
  return { mD, mG, mDens };
};

export function getReadOut(x: CertData) {
  const hiD = x.d >= 60;
  const lowDens = x.dens < 20000;
  const held = (x.yoy || 0) > -15;
  let s = "";
  if (hiD && lowDens) s = "찾는 사람은 많은데 정리된 정보가 적습니다. 근거를 스스로 모아야 하는 상태입니다.";
  else if (hiD) s = "관심도 정보량도 많습니다. 정보는 충분하나 대부분 판매자가 만든 것일 수 있으니 출처를 확인하십시오.";
  else if (lowDens && x.d < 20) s = "관심도 정보도 적습니다. 틈새이거나 수요 자체가 크지 않은 영역입니다.";
  else s = "관심 대비 정보가 많은 편입니다. 정보 부족보다 선별이 과제입니다.";
  
  s += held ? " 다른 자격에 비해 관심이 잘 유지되고 있습니다."
            : " 다만 다른 자격 대비 상대적 관심은 빠지는 추세입니다.";
  return s;
}
