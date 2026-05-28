import axios from "axios";
export const getHospitalList = async ({ category, sort, lat, lon }) => {
  
  const url = `/api/hospitals/${category}?sort=${sort}&lat=${lat}&lon=${lon}`
  const response = await axios.get(url);    
  
  if (response.status !== 200) {
  throw new Error("병원 리스트 조회 실패");
}

  return response.data.data;
};