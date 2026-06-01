import { useSearchParams, useParams } from "react-router-dom";
import HospitalList from "../../features/hospitals/components/HospitalList";
import { useHospitalList } from "../../features/hospitals/hooks/useHospitalList"
import { categoryConfig } from "../../features/hospitals/constants/categoryConfig";
import Loading from "../../shared/components/feedback/Loading";
import HospitalEmpty from "../../shared/components/feedback/HospitalEmpty";

const HospitalListPage = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const sort = searchParams.get("sort") || "SCORE";
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const categoryToUpper = category.toUpperCase();
    const config = categoryConfig[categoryToUpper];

    const { data, loading, error } = useHospitalList({category, sort, lat, lon});
   
    if (loading) {
        return (
            <Loading text="전체 응급실을 찾고 있습니다..." />
        );
}
    if (error) return <div>{error}</div>;
    // 병원이 없는 경우를 위한 처리
   if (!data?.hospitals || data.hospitals.length === 0) {
        console.log("병원 상태 :", data?.hospitals);
        return <HospitalEmpty />;   
    }
    return (
        <>
            <HospitalList hospitals={data.hospitals} userLat={lat} userLon={lon} config ={config} category = {category} sort={sort}  showRanking={false} showDistance={sort === "DISTANCE"} compact={true}/>;
        </>
    );
};

export default HospitalListPage;