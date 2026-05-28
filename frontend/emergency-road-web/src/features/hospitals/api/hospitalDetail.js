import axios from "axios";

const ENDPOINTS = {
    PEDIATRIC: "/api/hospitals/pediatric",
    GENERAL: "/api/hospitals/general",
    PREGNANT: "/api/hospitals/pregnant"
};

export const getHospitalDetail = async (category,hpid) => {
    const url =`${ENDPOINTS[category.toUpperCase()]}/${hpid}/detail`;
    const response = await axios.get(url);    
    return response.data.data;
};