import React, { useState, useEffect } from 'react';
import HospitalList from './HospitalList';
import {useHospitalRecommend} from '../hooks/recommend/useHospitalRecommend';

const RecommendedHospitalSection = ({ category, lat, lon }) => {
console.log("Section으로 전달된 lat:", lat, "lon:", lon);
    const { data, loading, error } = useHospitalRecommend(category, lat, lon);

    if (loading) return <div>병원 목록을 불러오는 중입니다...</div>;
    if (error) return <div>오류가 발생했습니다: {error.message}</div>;

    return <HospitalList hospitals={data} userLat={lat} userLon={lon} />;
};

export default RecommendedHospitalSection;