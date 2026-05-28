import { useState, useEffect } from "react";
import { getPosts } from "../api/api";

export function usePostList(hpid) {
  const [posts, setPosts] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  // 병원 이름 조회 — 게시글 없어도 표시
  useEffect(() => {
    fetch(`/api/hospitals/${hpid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data?.hospitalName) setHospitalName(data.data.hospitalName);
      })
      .catch(() => setHospitalName(hpid));
  }, [hpid]);

  async function fetchPosts(p = 0, kw = "", reset = false) {
    setLoading(true);
    try {
      const data = await getPosts(hpid, { page: p, keyword: kw });
      const list = data.content ?? [];
      setPosts((prev) => (reset ? list : [...prev, ...list]));
      setHasMore(!data.last);
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
    fetchPosts(0, keyword, true);
  }

  function onLoadMore() {
    fetchPosts(page + 1, keyword);
  }

  return {
    posts,
    hospitalName,
    page,
    hasMore,
    loading,
    keyword,
    onKeywordChange: (e) => setKeyword(e.target.value),
    onSearch,
    onLoadMore,
  };
}

export default usePostList;
