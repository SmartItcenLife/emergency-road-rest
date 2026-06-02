import axios from "axios";

const ENDPOINTS = {
    PEDIATRIC: "/api/hospitals/pediatric",
    GENERAL: "/api/hospitals/general",
    PREGNANT: "/api/hospitals/pregnant"
};

const HOSPITAL_DETAIL_CACHE_TTL = 60 * 1000;
const hospitalDetailCache = new Map();

function getElapsedTime(startTime) {
  return `${(performance.now() - startTime).toFixed(2)}ms`;
}

export const getHospitalDetail = async (category,hpid) => {
    const normalizedCategory = category.toUpperCase();
    const cacheKey = `hospitalDetail:${normalizedCategory}:${hpid}`;
    const cached = hospitalDetailCache.get(cacheKey);
    const now = Date.now();
    const startTime = performance.now();

    if (cached && now - cached.cachedAt < HOSPITAL_DETAIL_CACHE_TTL) {
      console.log(
        `[HOSPITAL DETAIL][CACHE] ${normalizedCategory}:${hpid}: ${getElapsedTime(startTime)}`
      );

      return cached.data;
    }

    const url =`${ENDPOINTS[category.toUpperCase()]}/${hpid}/detail`;
    const response = await axios.get(url);

    const data = response.data.data;

    hospitalDetailCache.set(cacheKey, {
        data,
        cachedAt: now,
      });

      console.log(
        `[HOSPITAL DETAIL][NETWORK] ${normalizedCategory}:${hpid}: ${getElapsedTime(startTime)}`
      );

      return data;
};