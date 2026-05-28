import { useSearchParams, useParams } from "react-router-dom";
import HospitalList from "../../features/hospitals/components/HospitalList";
import { useHospitalList } from "../../features/hospitals/hooks/useHospitalList"
import { categoryConfig } from "../../features/hospitals/constants/categoryConfig";

const HospitalListPage = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const sort = searchParams.get("sort") || "SCORE";
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const categoryToUpper = category.toUpperCase();
    const config = categoryConfig[categoryToUpper];

    const { data, loading, error } = useHospitalList({category, sort, lat, lon});
    console.log(lat);
    console.log(lon);
   
    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;
    if (!data) return null;

    return (
        <>
            <HospitalList hospitals={data.hospitals} userLat={lat} userLon={lon} config ={config} category = {category} sort={sort}  showRanking={false} showDistance={sort === "DISTANCE"} compact={true}/>;
        </>
    );
};

export default HospitalListPage;