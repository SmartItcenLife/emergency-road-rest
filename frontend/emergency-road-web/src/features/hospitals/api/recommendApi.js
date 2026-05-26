import axios from "axios";


export const getHospitalRecommend =
    async ( category, lat, lon ) => {

        const response =
            await axios.get("/recommend/rank",
                {
                    params: {
                        category,
                        lat,
                        lon
                    }
                }
            );
        return response.data;
    };