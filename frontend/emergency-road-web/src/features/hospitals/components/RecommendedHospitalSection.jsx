import React, { useState, useEffect } from 'react';
import HospitalList from './HospitalList';
import {useHospitalRecommend} from '../hooks/recommend/useHospitalRecommend';
import { categoryConfig } from '../constants/categoryConfig';

const RecommendedHospitalSection = ({ category, lat, lon }) => {
    console.log("Section으로 전달된 lat:", lat, "lon:", lon);
    const { data, loading, error } = useHospitalRecommend(category, lat, lon);
    
    const config = categoryConfig[category];

    if (loading) return <div>병원 목록을 불러오는 중입니다...</div>;
    if (error) return <div>오류가 발생했습니다: {error.message}</div>;
    // 추천 리스트일 때는 showRanking true, 거리 소요시간 보여주기 
    return <HospitalList hospitals={data} userLat={lat} userLon={lon} config ={config} category = {category}  showRanking={true} showDistance={true} />;
};

export default RecommendedHospitalSection;