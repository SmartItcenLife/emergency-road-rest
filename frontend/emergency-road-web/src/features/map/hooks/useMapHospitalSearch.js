import { useCallback, useEffect, useRef, useState } from "react";
import { getAreaCongestion, getMapHospitals } from "../api/mapApi";

export function useMapHospitalSearch({
  initialCategory = "GENERAL",
  initialHospital = null,
}) {
  const normalizedCategory = initialCategory?.toUpperCase() || "GENERAL";
  const hasSearchedOnceRef = useRef(false);

  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(initialHospital);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingBounds, setPendingBounds] = useState(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [areaCongestions, setAreaCongestions] = useState([]);

  useEffect(() => {
    async function loadAreaCongestions() {
      try {
        const data = await getAreaCongestion(normalizedCategory);
        setAreaCongestions(data);
      } catch (err) {
        console.error("구별 혼잡도 정보를 불러오는 중 오류가 발생했습니다:", err);
        setAreaCongestions([]);
      }
    }

    loadAreaCongestions();
  }, [normalizedCategory]);

  const searchHospitals = useCallback(
    async (boundsParams) => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMapHospitals(normalizedCategory, boundsParams);
        setHospitals(data);
        setSelectedHospital((prev) => {
          if (!prev?.hpid) {
            return prev;
          }

          const matchedHospital = data.find(
            (hospital) => hospital.hpid === prev.hpid
          );

          if (!matchedHospital) {
            return prev;
          }

          return {
            ...prev,
            ...matchedHospital,
            latitude: matchedHospital.latitude ?? prev.latitude,
            longitude: matchedHospital.longitude ?? prev.longitude,
          };
        });
        setShowSearchButton(false);
      } catch (err) {
        console.error("병원 데이터를 불러오는 중 오류가 발생했습니다:", err);
        setError("병원 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [normalizedCategory]
  );

  const handleBoundsChange = useCallback(
    (boundsParams) => {
      setPendingBounds(boundsParams);

      if (!hasSearchedOnceRef.current) {
        hasSearchedOnceRef.current = true;
        searchHospitals(boundsParams);
        return;
      }

      setShowSearchButton(true);
    },
    [searchHospitals]
  );

  const handleSearchCurrentMap = useCallback(() => {
    if (!pendingBounds) {
      return;
    }

    searchHospitals(pendingBounds);
  }, [pendingBounds, searchHospitals]);

  const handleSelectHospital = useCallback((hospital) => {
    setSelectedHospital((prev) => {
      if (prev?.hpid === hospital?.hpid) {
        return null;
      }

      return hospital;
    });
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedHospital(null);
  }, []);

  return {
    hospitals,
    selectedHospital,
    loading,
    error,
    areaCongestions,
    showSearchButton,
    handleBoundsChange,
    handleSearchCurrentMap,
    handleSelectHospital,
    handleBackToList,
  };
}
