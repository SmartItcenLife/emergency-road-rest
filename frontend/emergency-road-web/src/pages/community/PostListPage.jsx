import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { usePostList } from "../../features/community/hooks/usePostList";
import { HospitalHeader } from "../../features/community/components/HospitalHeader";
import { PostCard } from "../../features/community/components/PostCard";
import { PostSearchBar } from "../../features/community/components/PostSearchBar";
import {
  AppBar,
  Avatar,
  Icon,
  Wordmark,
} from "../../shared/components/ui/Primitives";

const SURFACE = "#FFFFFF";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK2 = "#404757";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

function getPageNumbers(current, total) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages = [];

  pages.push(0);

  if (current > 2) pages.push("...");

  for (
    let i = Math.max(1, current - 1);
    i <= Math.min(total - 2, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");

  pages.push(total - 1);

  return pages;
}

export default function PostListPage() {
  const { hpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const {
    posts,
    hospitalName,
    page,
    totalPages,
    loading,
    keyword,
    onKeywordChange,
    onSearch,
    onPageChange,
    totalElements,
  } = usePostList(hpid);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: SURFACE,
        display: "flex",
        flexDirection: "column",
        maxWidth: 430,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <AppBar
        title="커뮤니티"
        leftAction={
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              padding: 6,
              cursor: "pointer",
              display: "flex",
            }}
          >
            <Wordmark size={26} withText={false} />
          </button>
        }
        rightAction={
          user ? (
            <button
              onClick={() => navigate("/mypage")}
              style={{
                background: "transparent",
                border: "none",
                padding: 6,
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Avatar
                name={user.nickname}
                src={user.profileImageUrl}
                size={28}
              />
            </button>
          ) : (
            <button
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
              style={{
                background: "transparent",
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: ACCENT,
              }}
            >
              로그인
            </button>
          )
        }
      />

      <HospitalHeader hospitalName={hospitalName || hpid} />
      <PostSearchBar
        keyword={keyword}
        onChange={onKeywordChange}
        onSubmit={onSearch}
      />

      {/* 목록 헤더 */}
      <div
        style={{
          padding: "16px 20px 10px",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          background: SURFACE,
          borderBottom: `1px solid ${BORDER1}`,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: INK1 }}>
          후기 갯수 :{" "}
          <span style={{ color: ACCENT, fontVariantNumeric: "tabular-nums" }}>
            {totalElements}
          </span>
        </h3>
        <span style={{ fontSize: 12, color: INK3 }}>최신순</span>
      </div>

      {/* 목록 */}
      <div style={{ flex: 1, background: "#fff" }}>
        {loading && posts.length === 0 ? (
          <div
            style={{ padding: "60px 24px", textAlign: "center", color: INK3 }}
          >
            불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              fontSize: 14,
              color: INK2,
            }}
          >
            아직 후기가 없어요.
            <br />첫 번째로 남겨 주세요.
          </div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onOpen={() => navigate(`/community/${hpid}/posts/${p.id}`)}
            />
          ))
        )}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "20px 0 28px",
            }}
          >
            {/* 이전 버튼 */}
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${BORDER1}`,
                background: "transparent",
                color: page === 0 ? INK3 : INK1,
                cursor: page === 0 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: page === 0 ? 0.4 : 1,
              }}
            >
              <Icon name="arrowLeft" size={16} />
            </button>

            {/* 페이지 번호 버튼 */}
            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  style={{ color: INK3, fontSize: 14, padding: "0 4px" }}
                >
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `1px solid ${p === page ? ACCENT : BORDER1}`,
                    background: p === page ? ACCENT : "transparent",
                    color: p === page ? "#fff" : INK1,
                    fontWeight: p === page ? 600 : 400,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p + 1} {/* ← 0-based → 1-based 표시 */}
                </button>
              ),
            )}

            {/* 다음 버튼 */}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages - 1}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${BORDER1}`,
                background: "transparent",
                color: page === totalPages - 1 ? INK3 : INK1,
                cursor: page === totalPages - 1 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: page === totalPages - 1 ? 0.4 : 1,
              }}
            >
              <Icon
                name="arrowLeft"
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
          </div>
        )}
      </div>

      {/* FAB */}
      {user && (
        <div
          style={{
            position: "sticky",
            bottom: 24,
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 20px",
            pointerEvents: "none",
          }}
        >
          <button
            onClick={() => navigate(`/community/${hpid}/posts/new`)}
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: ACCENT,
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px -8px rgba(37,99,235,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <Icon name="plus" size={26} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
