import { Icon } from "../../../shared/components/ui";
import "./PostSearchBar.css";

export function PostSearchBar({ keyword, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="post-search-bar">
      <div className="post-search-bar__wrapper">
        <span className="post-search-bar__icon">
          <Icon name="search" size={16} />
        </span>
        <input
          value={keyword}
          onChange={onChange}
          placeholder="게시글 검색"
          className="post-search-bar__input"
        />
      </div>
    </form>
  );
}

export default PostSearchBar;
