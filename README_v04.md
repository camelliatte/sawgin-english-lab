# Saw & Gin English Lab v0.4 · Cloud Sync beta

## 배포
GitHub 저장소 루트의 `index.html`, `service-worker.js` 및 기타 정적 파일을 이 패키지로 교체하고 GitHub Pages 빌드 완료 후 새로고침하세요. 기존 데이터는 먼저 Settings → JSON 백업 다운로드로 백업하세요.

## 로그인
Supabase Email 인증. 첫 방문 시 로그인/가입 화면이 뜨며 닫으면 로컬 모드로 계속 사용할 수 있습니다. PC와 iPhone에서 동일한 계정을 사용하세요.

## 데이터 구조
이 베타는 기존 `lab_profiles` 테이블의 `preferences.cloud_state`에 v0.3 로컬 데이터 전체 스냅샷을 저장합니다. 이미 만든 `lab_packs`, `lab_answers`, `lab_activity` 테이블은 아직 사용하지 않습니다. 기존 RLS의 `auth.uid() = user_id` 정책이 필요합니다.

## 주의
- 동일 계정의 두 기기에서 동시에 편집하면 최신 업로드가 이전 변경을 덮어쓸 수 있습니다.
- 기기별 첫 로그인 시 서버 기록과 로컬 기록이 둘 다 있으면 선택 창이 뜹니다. 자동 병합은 지원하지 않습니다.
- 네트워크 연결이 끊긴 동안의 편집은 로컬에 남지만 자동 충돌 해결은 없습니다.
- 브라우저 캐시가 이전 버전을 표시하면 강력 새로고침하거나 PWA를 재실행하세요.
- Supabase 공개 키는 브라우저에 포함되어도 되지만 service_role/secret 키는 절대 포함하면 안 됩니다.
- CDN에서 Supabase JS를 불러오므로 첫 온라인 접속이 필요합니다.
- 실제 양쪽 기기 및 Supabase 연결 동작은 아직 실기기 검증 전입니다.
