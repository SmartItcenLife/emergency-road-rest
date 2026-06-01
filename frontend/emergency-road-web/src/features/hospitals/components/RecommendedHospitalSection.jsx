import React, { useState, useEffect } from 'react';
import HospitalList from './HospitalList';
import {useHospitalRecommend} from '../hooks/recommend/useHospitalRecommend';
import { categoryConfig } from '../constants/categoryConfig';
import Loading from '../../../shared/components/feedback/Loading';

const RecommendedHospitalSection = ({ category, lat, lon }) => {
    console.log("Section으로 전달된 lat:", lat, "lon:", lon);
    const { data, loading, error } = useHospitalRecommend(category, lat, lon);
    
     if (loading) {
        return (
        <Loading text="가장 적합한 응급실을 찾고 있습니다..." />
        );
    }

    const config = categoryConfig[category];

    if (error) return <div>오류가 발생했습니다: {error.message}</div>;
    // 추천 리스트일 때는 showRanking true, 거리 소요시간 보여주기 
    return <HospitalList hospitals={data} userLat={lat} userLon={lon} config ={config} category = {category}  showRanking={true} showDistance={true} />;
};

export default RecommendedHospitalSection;