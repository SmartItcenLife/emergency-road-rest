import "./AdminTable.css";
import AdminLayout from "../../features/admin/components/AdminLayout";
import PostTable from "../../features/admin/components/PostTable";
import { useEffect, useState } from "react";
import ConfirmModal from "../../shared/components/feedback/ConfirmModal";
import Pagination from "../../shared/components/ui/Pagination";
import { deleteAdminPost, getPostList } from "../../features/admin/api/adminApi";

function AdminPostListPage(){
    const [posts, setPosts] = useState([]);
    const [deleteTargetPost, setDeleteTargetPost] = useState(null);
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);

    const handleDeletePost = (id) => {
    const targetPost = posts.find((post) => post.id === id);
    setDeleteTargetPost(targetPost);
    };

    const confirmDeletePost = async()=>{
        try{
            const response = await deleteAdminPost(deleteTargetPost.id);

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === deleteTargetPost.id 
                    ? { ...post, isDeleted: true, deleted: true }
                    : post
                )
                );
                setDeleteTargetPost(null);
        }catch(error){
            console.error(error);
            alert(error.message);
        }

    
    };

    useEffect(()=>{
        const fetchPosts = async()=>{
            try{
            const data = await getPostList();
            setPosts(data);
            }
            catch(error){
                console(error.message);
                alert(error.message);
            }
        };
        fetchPosts();
    }, []);

    return (
        <AdminLayout>
            <div className="admin-list-page">
            <PostTable posts={pagedPosts} onDeletePost={handleDeletePost}/>

            <ConfirmModal
            open={deleteTargetPost !== null}
            title="게시글 삭제 처리"
            message="해당 게시글을 삭제 처리하시겠습니까?"
            confirmText="삭제"
            onConfirm={confirmDeletePost}
            onCancel={() => setDeleteTargetPost(null)}
            />

            <Pagination
            currentPage={currentPage}
            totalItems={posts.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            />
            </div>
        </AdminLayout>
    );
}

export default AdminPostListPage;