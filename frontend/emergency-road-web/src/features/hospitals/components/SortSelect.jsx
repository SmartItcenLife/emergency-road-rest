import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; 
import "./SortSelect.css";

const SortSelect = ({ sort }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (e) => {
    searchParams.set("sort", e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <div className ="sort-container">
    <select className="sort-content" value={sort} onChange={handleChange}>
      <option value="SCORE">추천순</option>
      <option value="BED">병상여유순</option>
      <option value="DISTANCE">거리순</option>
    </select>
    </div>
  );
};
export default SortSelect;