// ─────────────────────────────────────────────────────────
// ✏️  Tailwind 클래스 접두사 설정 (단일 관리 포인트)
// 이 값을 바꾸면 generate-tokens.js, tailwind.config.js 양쪽에 자동 반영됩니다.
//
// 현재: "pds"  →  bg-pds-mint-500, text-pds-xl, rounded-pds-md ...
// 변경 예: "ds" →  bg-ds-mint-500,  text-ds-xl,  rounded-ds-md ...
// ─────────────────────────────────────────────────────────
const PREFIX = "pds";

module.exports = { PREFIX };
