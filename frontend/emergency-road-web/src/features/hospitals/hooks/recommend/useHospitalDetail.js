import { useState } from 'react';
import { getHospitalDetail } from '../../api/hospitalDetail'

export const useHospitalDetail = (category,hpid) => {
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetail = async () => {
        // 펼치려는 상황이고, 아직 데이터를 안 받아왔을 때만 API 호출
        if (!isExpanded && !detailData) {
            setLoading(true);
            try {
                const data = await getHospitalDetail(category,hpid);
                setDetailData(data);
            } catch (error) {
                console.error("상세 정보 로드 실패", error);
            } finally {
                setLoading(false);
            }
        }
        setIsExpanded(!isExpanded);
    };

    return { detailData, loading, isExpanded, toggleDetail };
};