import "./Pagination.css";

function Pagination({ currentPage, totalItems, pageSize = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  // 왜 리턴 안에 리턴이 있는 거임??
  return (
    <div className="pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >이전</button>

      {/* {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
        <button 
          key={page}
          type="button"
          className={currentPage === page ? "active" : ""}
          onClick={()=>onPageChange(page)}
          >{page}</button>);
      })} */}

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            className={currentPage === page ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >다음</button>
    </div>
  );
}

export default Pagination;