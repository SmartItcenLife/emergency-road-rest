const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* 프론트 캐싱을 테스트 하기 위한 코드블럭 */
const AREA_CONGESTION_CACHE_TTL = 60 * 1000; // 1분
const areaCongestionCache = new Map();

function getNow(){
    return performance.now();
}

function getElapsedTime(startTime){
    return `${(performance.now() - startTime).toFixed(2)}ms`;
}

export async function getMapHospitals(category = "GENERAL", boundsParams = {}) {
    const normalizedCategory = category.toUpperCase();
    const startTime = getNow();

    const params = new URLSearchParams({
        category: normalizedCategory,
        ...boundsParams,
    });

    const response = await fetch(`${API_BASE_URL}/api/map/hospitals?${params.toString()}`);

    if (!response.ok) {
        throw new Error("병원 정보를 불러오는 데 실패했습니다.");
    }
    const result = await response.json();

    console.log(
        `[MAP API][HOSPITALS][NETWORK] ${normalizedCategory}: ${getElapsedTime(startTime)}`
    );

    return result.data;
}

export async function getAreaCongestion(category = "GENERAL") {
    /* 캐싱 적용 블럭 */
    const normalizedCategory = category.toUpperCase();
    const cacheKey = `areaCongestion:${normalizedCategory}`;
    const cached = areaCongestionCache.get(cacheKey);
    const now = Date.now();

    const startTime = getNow();


    if (cached && now - cached.cachedAt < AREA_CONGESTION_CACHE_TTL) {
    console.log(
      `[MAP API][CACHE] area congestion ${normalizedCategory}: ${getElapsedTime(startTime)}`
    );
    return cached.data;
    }

    /* 캐싱 미적용 블럭 */
    // const normalizedCategory = category.toUpperCase();
    // const startTime = performance.now();


    const params = new URLSearchParams({
        category: category.toUpperCase(),
    });

    const response = await fetch(`${API_BASE_URL}/api/map/areas/congestion?${params.toString()}`);

    if (!response.ok) {
        throw new Error("구별 혼잡도 정보를 불러오는 데 실패했습니다.");
    }
    const result = await response.json();
    /* 캐싱 적용 블럭 */
    areaCongestionCache.set(cacheKey, {
    data: result.data,
    cachedAt: now,
    });

    console.log(
    `[MAP API][NETWORK] area congestion ${normalizedCategory}: ${getElapsedTime(startTime)}`
      );
    
    // console.log(
    // `[MAP API][BEFORE][NETWORK] area congestion ${normalizedCategory}: ${(
    //   performance.now() - startTime
    //     ).toFixed(2)}ms`
    // );


    return result.data;
}
