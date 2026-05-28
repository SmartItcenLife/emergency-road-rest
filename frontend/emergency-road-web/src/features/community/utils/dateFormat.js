/** 2026.05.27 형식 */
export function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** 방금 / N분 전 / N시간 전 / M월 D일 형식 */
export function formatDateShort(str) {
  if (!str) return "";
  const d = new Date(str),
    now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
