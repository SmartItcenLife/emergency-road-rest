import { useState, useEffect } from "react";
import { getHospital, getPosts } from "../api/api";
import { saveLastCommunityLocation } from "../utils/communityLocation";

export function usePostList(hpid) {
  const [posts, setPosts] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  // 병원 이름 조회 — 게시글 없어도 표시
  useEffect(() => {
    saveLastCommunityLocation({ hpid, postId: null });

    getHospital(hpid)
      .then((hospital) => {
        const name = hospital?.hospitalName;
        if (name) {
          setHospitalName(name);
          saveLastCommunityLocation({ hpid, postId: null, hospitalName: name });
        }
      })
      .catch(() => setHospitalName(hpid));
  }, [hpid]);

  async function fetchPosts(p = 0, kw = "") {
    setLoading(true);
    try {
      const data = await getPosts(hpid, { page: p, keyword: kw, size: 5 });
      setPosts(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts(0, "", true);
  }, [hpid]);

  function onSearch(e) {
    e.preventDefault();
    fetchPosts(0, keyword);
  }

  function onPageChange(p) {
    fetchPosts(p, keyword);
  }

  return {
    posts,
    hospitalName,
    page,
    totalPages,
    loading,
    keyword,
    onKeywordChange: (e) => setKeyword(e.target.value),
    onSearch,
    onPageChange,
    totalElements,
  };
}

export default usePostList;
