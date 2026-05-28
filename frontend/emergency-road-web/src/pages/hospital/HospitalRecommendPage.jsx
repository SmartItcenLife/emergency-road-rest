import React from 'react';
import RecommendedHospitalSection from '../../features/hospitals/components/RecommendedHospitalSection';
import { useParams, useSearchParams } from 'react-router-dom'; // useSearchParams 추가


const HospitalRecommendPage = () => {
  // 현재 위치 정보는 추후 Context API나 Geolocation API로 관리 예정
  const { category } = useParams();
    const [searchParams] = useSearchParams();
    
  // URL에서 직접 좌표를 가져옵니다 (로딩/getLocation 불필요)
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    // 위치 정보를 새로 가져올 필요가 없으므로 바로 컴포넌트 렌더링
    return (
        <div className="page">
            <RecommendedHospitalSection 
                category={category} 
                lat={lat} 
                lon={lon} 
            />
        </div>
    );
};

export default HospitalRecommendPage;