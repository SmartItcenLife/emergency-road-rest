import { useState, useEffect } from "react";

import { getHospitalRecommend } from "../api/recommendApi";


export function useHospitalRecommend(
    category,
    lat,
    lon
) {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    useEffect(() => {

        async function fetchRecommend() {

            try {

                setLoading(true);

                const result =

                    await getHospitalRecommend(category, lat, lon);

                setData(result);
            }

            catch (err) {
                setError(err);
            }

            finally {
                setLoading(false);
            }
        }

        if (lat && lon && category) {
            fetchRecommend();
        }
    },
        [category,lat,lon]);

    return {data,loading,error};

}