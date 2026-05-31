// 좌표를 받기 위한 함수
export function getHospitalLatitude(hospital) {
    return hospital?.hospitalLatitude ?? hospital?.latitude ?? null; 
}

export function getHospitalLongitude(hospital){
    return hospital?.hospitalLongitude ?? hospital?.longitude ?? null;
}

export function buildHospitalMapUrl({hospital, category}) {
    const params = new URLSearchParams(); // 쿼리문자열을 다루기 위함

    const processedCategory = category?.toUpperCase();
    const hospitalLat = getHospitalLatitude(hospital);
    const hospitalLon = getHospitalLongitude(hospital);

    if(processedCategory){
        params.set("category",processedCategory);
    }
    if (hospital?.hpid){
        params.set("hpid",hospital.hpid);
    }
    if (hospitalLat !== null && hospitalLat !== undefined ){
        params.set("hospitalLat", hospitalLat)
    }
    if (hospitalLon !== null && hospitalLon !== undefined ){
        params.set("hospitalLon", hospitalLon)
    }

    const queryString = params.toString();

    return queryString ? `/map?${queryString}` : `/map`;
}

export function canNavigateToHospitalMap(hospital){
    return Boolean(
        hospital?.hpid && getHospitalLatitude(hospital) !== null &&
         getHospitalLatitude(hospital) !== undefined &&
         getHospitalLongitude(hospital) !== null &&
         getHospitalLongitude(hospital) !== undefined
    )
}