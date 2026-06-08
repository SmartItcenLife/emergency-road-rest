import { useState } from "react";
import { Icon } from "../../../shared/components/ui";
import "./MoreMenu.css";

/**
 * MoreMenu — 점점점 메뉴 (게시글/댓글 공용)
 * @param {function} onEdit
 * @param {function} onDelete
 * @param {number} size - 아이콘 크기 (기본 20)
 * @param {number} topOffset - 드롭다운 top 위치 (기본 36)
 */
export function MoreMenu({ onEdit, onDelete, size = 20, topOffset = 36 }) {
  const [open, setOpen] = useState(false);
  const sm = size !== 20;
  return (
    <div className="more-menu">
      <button
        onClick={() => setOpen((s) => !s)}
        className={`more-menu__btn${sm ? " more-menu__btn--sm" : ""}`}
      >
        <Icon name="more" size={size} />
      </button>
      {open && (
        <>
          <div className="more-menu__backdrop" onClick={() => setOpen(false)} />
          <div
            className={`more-menu__dropdown${sm ? " more-menu__dropdown--sm" : ""}`}
            style={{ top: topOffset }}
          >
            {onEdit && (
              <button
                className={`more-menu__item${sm ? " more-menu__item--sm" : ""}`}
                onClick={() => { setOpen(false); onEdit(); }}
              >
                수정
              </button>
            )}
            <button
              className={`more-menu__item more-menu__item--delete${sm ? " more-menu__item--sm" : ""}`}
              onClick={() => { setOpen(false); onDelete(); }}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MoreMenu;
