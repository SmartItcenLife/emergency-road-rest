import "./AdminTable.css";
import AdminLayout from "../../features/admin/components/AdminLayout";
import PostTable from "../../features/admin/components/PostTable";
import { useEffect, useState } from "react";
import ConfirmModal from "../../shared/components/feedback/ConfirmModal";

function AdminPostListPage(){
    const [posts, setPosts] = useState([]);
    const [deleteTargetPost, setDeleteTargetPost] = useState(null);

    const handleDeletePost = (id) => {
    const targetPost = posts.find((post) => post.id === id);
    setDeleteTargetPost(targetPost);
    };

    const confirmDeletePost = async()=>{
    const response = await fetch(`http://localhost:8080/api/admin/posts/${deleteTargetPost.id}`,{
      method:"DELETE",
    });

    if(!response.ok){
      alert("게시글 삭제 처리에 실패했습니다.");
      return;
    }

    setPosts((prevPosts) =>
    prevPosts.map((post) =>
        post.id === id ? { ...post, isDeleted: true, deleted: true } : post
    )
    );

    setDeleteTargetPost(null);
    };

    useEffect(()=>{
        const fetchPosts = async()=>{
            const response = await fetch("http://localhost:8080/api/admin/posts");
            const data = await response.json();

            setPosts(data);
        };
        fetchPosts();
    }, []);

    return (
        <AdminLayout>
            <div className="admin-list-page">
            <PostTable posts={posts} onDeletePost={handleDeletePost}/>

            <ConfirmModal
            open={deleteTargetPost !== null}
            title="게시글 삭제 처리"
            message={`해당 게시글을 삭제 처리하시겠습니까?`}
            confirmText="삭제"
            onConfirm={confirmDeletePost}
            onCancel={() => setDeleteTargetPost(null)}
          />
            </div>
        </AdminLayout>
    );
}

export default AdminPostListPage;