import axios from "axios";


const CATEGORY_URLS = {
    GENERAL: "/api/recommend/general",
    PEDIATRIC: "/api/recommend/pediatric",
    PREGNANT: "/api/recommend/pregnant"
};


export const getHospitalRecommend = async (category, lat, lon) => {
    // 1. 카테고리 대문자 변환 후 URL 선택
    const url = CATEGORY_URLS[category?.toUpperCase()];
    
    if (!url) {
        throw new Error(`지원하지 않는 카테고리입니다: ${category}`);
    }

    // 2. 동적 URL로 API 호출
    const response = await axios.get(url, {
        params: { lat, lon }
    });

    // 3. 백엔드 ApiResponseDto 구조에 맞게 데이터 반환
    // 백엔드가 { success: true, data: [...] } 형태라면 response.data.data를 반환
    return response.data.data; 
};