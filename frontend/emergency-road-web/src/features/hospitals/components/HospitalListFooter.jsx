import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalListFooter.css';

const HospitalListFooter = ({ category }) => {
    const navigate = useNavigate();
    const categoryLowerCase = category?.toLowerCase();

    return (
        <div className={`hospital-footer ${categoryLowerCase}`}>
            <p className="hospital-footer__text">
                원하는 병원이 없거나 추천 결과가 만족스럽지 않다면<br />
                전체 병원 목록에서 직접 확인해보세요.
            </p>

            <button
                className="hospital-footer__button"
                onClick={() => navigate(`/${categoryLowerCase}/hospitals`)}
                disabled={!categoryLowerCase}
            >
                전체 병원 보기
            </button>
        </div>
    );
};

export default HospitalListFooter;