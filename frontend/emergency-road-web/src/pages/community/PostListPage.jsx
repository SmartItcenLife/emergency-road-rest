import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { usePostList } from "../../features/community/hooks/usePostList";
import { HospitalHeader } from "../../features/community/components/HospitalHeader";
import { PostCard } from "../../features/community/components/PostCard";
import { PostSearchBar } from "../../features/community/components/PostSearchBar";
import { AppBar, Avatar, Icon, Wordmark } from "../../shared/components/ui";
import "./PostListPage.css";

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
    <div className="post-list-page">
      <AppBar
        title="커뮤니티"
        leftAction={
          <button onClick={() => navigate("/")} className="post-list-page__home-btn">
            <Wordmark size={26} withText={false} />
          </button>
        }
        rightAction={
          user ? (
            <button
              onClick={() => navigate("/mypage")}
              className="post-list-page__avatar-btn"
            >
              <Avatar name={user.nickname} src={user.profileImageUrl} size={28} />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login", { state: { from: location.pathname } })}
              className="post-list-page__login-btn"
            >
              로그인
            </button>
          )
        }
      />

      <HospitalHeader hospitalName={hospitalName || hpid} />
      <PostSearchBar keyword={keyword} onChange={onKeywordChange} onSubmit={onSearch} />

      <div className="post-list-page__list-header">
        <h3 className="post-list-page__count-label">
          후기 갯수 :{" "}
          <span className="post-list-page__count-value">{totalElements}</span>
        </h3>
        <span className="post-list-page__sort-label">최신순</span>
      </div>

      <div className="post-list-page__feed">
        {loading && posts.length === 0 ? (
          <div className="post-list-page__loading">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="post-list-page__empty">
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
          <div className="post-list-page__pagination">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className={`post-list-page__page-btn${page === 0 ? " post-list-page__page-btn--disabled" : ""}`}
            >
              <Icon name="arrowLeft" size={16} />
            </button>

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="post-list-page__dots">···</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`post-list-page__page-btn${p === page ? " post-list-page__page-btn--active" : ""}`}
                >
                  {p + 1}
                </button>
              ),
            )}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages - 1}
              className={`post-list-page__page-btn${page === totalPages - 1 ? " post-list-page__page-btn--disabled" : ""}`}
            >
              <Icon name="arrowLeft" size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        )}
      </div>

      {user && (
        <div className="post-list-page__fab-wrap">
          <button
            onClick={() => navigate(`/community/${hpid}/posts/new`)}
            className="post-list-page__fab"
          >
            <Icon name="plus" size={26} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
