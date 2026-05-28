
function RecentPostTable({posts}){
    return(
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>최근 게시글</h2>
            <a href="/admin/posts">전체보기</a>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>글 번호</th>
                <th>병원 이름</th>
                <th>글 제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => {
                const deleted = post.isDeleted ?? post.deleted;

                return (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.hospitalName}</td>
                    <td>{post.title}</td>
                    <td>{post.userName}</td>
                    <td>{post.createdAt?.replace("T", " ").slice(0, 16)}</td>
                    <td>{deleted ? "삭제됨" : "정상"}</td>
                  </tr>
                );
              })
              }
            </tbody>
          </table>
        </section>

    )
  }

export default RecentPostTable;