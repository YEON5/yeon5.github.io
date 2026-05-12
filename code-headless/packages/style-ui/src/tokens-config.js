// ─────────────────────────────────────────────────────────
// ✏️  Tailwind 클래스 접두사 설정 (단일 관리 포인트)
// 이 값을 바꾸면 generate-tokens.js, tailwind.config.js 양쪽에 자동 반영됩니다.
//
// 현재: "pds"  →  bg-pds-mint-500, text-pds-xl, rounded-pds-md ...
// 빈 문자열: "" → bg-mint-500, text-xl, rounded-md ...
// ─────────────────────────────────────────────────────────
const PREFIX = ""; // 문자열 필요시 원하는 문자열 넣기

// PREFIX가 있으면 "pds-", 없으면 "" (빈 문자열) 반환
const PREFIX_DASH = PREFIX ? `${PREFIX}-` : "";

module.exports = { PREFIX, PREFIX_DASH };