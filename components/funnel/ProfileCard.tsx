/**
 * 임원급(Executive) 프로필 카드 — 화면·티저·인쇄(PDF) 겸용.
 * PDF는 브라우저 인쇄로 뽑는다(@media print) — 의존성 0.
 * ponytail: 인쇄 품질이 부족해지면 @react-pdf/renderer로 승격 (한글 폰트 임베드 필요)
 */
import type { buildProfile } from '@/lib/funnelData';

type Profile = ReturnType<typeof buildProfile>;

export default function ProfileCard({
  profile,
  teaser = false,
}: {
  profile: Profile;
  teaser?: boolean;
}) {
  return (
    <div className={`profile-card ${teaser ? 'teaser' : ''}`} aria-hidden={teaser}>
      <div className="profile-band">
        <span className="profile-seal">🏅 {profile.seal}</span>
      </div>
      <div className="profile-body">
        <div className="profile-title">{profile.title}</div>
        <div className="profile-name">{profile.name}</div>
        <div className="profile-subtitle">{profile.subtitle}</div>
        <hr className="profile-rule" />
        <p className="profile-summary">{profile.summary}</p>
        <ul className="profile-bullets">
          {profile.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="profile-footer">
          <span>다음 목표 — {profile.goal}</span>
          <span className="profile-brand">달나루 Dalnaru</span>
        </div>
      </div>
      {teaser && <div className="profile-teaser-label">완성 예시</div>}
    </div>
  );
}
