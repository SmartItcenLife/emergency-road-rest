import { useEffect, useState } from "react";
import { getHospitalList } from "../api/hospitalApi";

export const useHospitalList = ({ category, sort, lat, lon }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!category) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getHospitalList({category,sort,lat,lon,});
                setData(result);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category, sort, lat, lon]);

    return { data, loading, error };
};