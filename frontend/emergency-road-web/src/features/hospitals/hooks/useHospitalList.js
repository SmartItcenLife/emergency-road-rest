import { useEffect, useState } from "react";
import { getHospitalList } from "../api/hospitalApi";
import Loading from "../../../shared/components/feedback/Loading";

export const useHospitalList = ({ category, sort, lat, lon }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!category) return;

        const fetchData = async () => {
            const startTime = Date.now(); 
            try {
                setLoading(true);
                const result = await getHospitalList({category,sort,lat,lon,});
                setData(result);
            } catch (e) {
                setError(e.message);
            } finally {
                   const elapsed = Date.now() - startTime;
                    const minLoadingTime = 1500;

                    if (elapsed < minLoadingTime) {
                        await new Promise(resolve =>
                            setTimeout(resolve, minLoadingTime - elapsed)
                        );
                    }

            setLoading(false);
            }
        };

        fetchData();
    }, [category, sort, lat, lon]);

    return { data, loading, error };
};