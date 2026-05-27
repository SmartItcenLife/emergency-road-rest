import "./AdminPostListPage.css";
import AdminLayout from "../../features/admin/components/AdminLayout";
import PostTable from "../../features/admin/components/PostTable";
import { useEffect, useState } from "react";

function AdminPostListPage(){
    const [posts, setPosts] = useState([]);

    const handleDeletePost = async(id)=>{
    const ok = window.confirm("정말 이 게시을을 삭제 처리 하시겠습니까?");
    if(!ok) return;

    const response = await fetch(`http://localhost:8080/api/admin/posts/${id}`,{
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
            <div className="admin-post-page">
            <PostTable posts={posts} onDeletePost={handleDeletePost}/>
            </div>
        </AdminLayout>
    );
}

export default AdminPostListPage;