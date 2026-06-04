import "./MapPage.css";
import MapLayout from "../../features/map/components/MapLayout";
import { useSearchParams } from "react-router-dom";

function MapPage() {

  const [searchParams ] = useSearchParams();

  const initialCategory = searchParams.get("category") || "GENERAL";
  const initialHpid = searchParams.get("hpid");
  const initialHospitalLat = searchParams.get("hospitalLat");
  const initialHospitalLon = searchParams.get("hospitalLon");

  const initialHospital = initialHpid && initialHospitalLat && initialHospitalLon ? {
    hpid : initialHpid,
    category : initialCategory.toUpperCase(),
    latitude : Number(initialHospitalLat),
    longitude: Number(initialHospitalLon)
  } : null;

  return (
    <div className="map-page">
      <MapLayout
        initialCategory = {initialCategory.toUpperCase()}
        initialHospital={initialHospital} />
    </div>
  );
}

export default MapPage;
