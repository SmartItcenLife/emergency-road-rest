const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getMapHospitals(boundsParams) {
    const params = new URLSearchParams({
        category: "GENERAL",
        ...boundsParams,
    });

    const response = await fetch(`${API_BASE_URL}/api/map/hospitals?${params.toString()}`);

    if (!response.ok) {
        throw new Error("병원 정보를 불러오는 데 실패했습니다.");
    }
    const result = await response.json();
    return result.data;
}

export async function getAreaCongestion() {
    const params = new URLSearchParams({
        category: "GENERAL",
    });

    const response = await fetch(`${API_BASE_URL}/api/map/areas/congestion?${params.toString()}`);

    if (!response.ok) {
        throw new Error("구별 혼잡도 정보를 불러오는 데 실패했습니다.");
    }
    const result = await response.json();
    return result.data;
}