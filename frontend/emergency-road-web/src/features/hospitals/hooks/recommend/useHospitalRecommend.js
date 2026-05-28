import { useState, useEffect } from "react";
import { getHospitalRecommend } from "../../api/recommendApi"


export function useHospitalRecommend(category, lat, lon) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        // 위치와 카테고리가 모두 유효할 때만 호출
        if (!lat || !lon || !category) return;

      const fetchRecommend = async () => {
            try {
                setLoading(true);
                const result = await getHospitalRecommend(category, lat, lon);
                setData(result);
                setError(null); // 새로운 요청 시 에러 초기화
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommend();
    }, [category, lat, lon]); // category, lat, lon이 변할 때만 다시 실행

    return { data, loading, error };
}