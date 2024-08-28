import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const SportsCenter = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 필터링된 시설 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minSize, setMinSize] = useState(0); // 최소 시설 크기 필터링
  const [sort, setSort] = useState({
    by: 'default',
    order: 'asc',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 로컬 백엔드 서버에서 데이터를 가져옵니다.
        const response = await fetch(`/sportscenter/get?pageNo=1&numOfRows=10`);
        
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const result = await response.json();

        if (result && result.length > 0) {
          setData(result);
          setFilteredData(result); // 처음엔 모든 시설 데이터를 필터링 데이터로 설정
        } else {
          setError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
        setLoading(false);
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다: ' + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilter = (size) => {
    if (minSize === size) {
      setMinSize(0);
      setFilteredData(data);
    } else {
      setMinSize(size);
      const filtered = data.filter((item) => item.faci_gfa >= size);
      setFilteredData(filtered);
    }
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (sort.by !== 'default') {
      const sortedData = _.orderBy(filteredData, [sort.by], [sort.order]);
      setFilteredData(sortedData);
    }
  }, [sort]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="sports_center">
      <header className="align_center sports_center_header">
        <h2 className="align_center sports_center_heading">
          시설 정보 목록
        </h2>

        <div className="align_center sports_center_fs">
          <ul className="align_center sports_center_filter">
            <li
              className={minSize === 500 ? 'sports_center_filter_item active' : 'sports_center_filter_item'}
              onClick={() => handleFilter(500)}
            >
              500+ 평방미터
            </li>
            <li
              className={minSize === 1000 ? 'sports_center_filter_item active' : 'sports_center_filter_item'}
              onClick={() => handleFilter(1000)}
            >
              1000+ 평방미터
            </li>
            <li
              className={minSize === 2000 ? 'sports_center_filter_item active' : 'sports_center_filter_item'}
              onClick={() => handleFilter(2000)}
            >
              2000+ 평방미터
            </li>
          </ul>

          <select name="by" id="by" onChange={handleSort} className="sports_center_sorting">
            <option value="default">SortBy</option>
            <option value="faci_nm">이름</option>
            <option value="updt_dt">갱신일</option>
          </select>
          <select name="order" id="order" onChange={handleSort} className="sports_center_sorting">
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </header>

      <div className="sports_center_cards">
        {filteredData.map((item, index) => (
          <div key={index} className="sports_center_card">
            <h2>{item.faci_nm}</h2>
            <p>시설구분명: {item.faci_gb_nm}</p>
            <p>업종명: {item.fcob_nm}</p>
            <p>시설유형명: {item.ftype_nm}</p>
            <p>시도명: {item.cp_nm}</p>
            <p>시군구명: {item.cpb_nm}</p>
            <p>시설 주소: {item.faci_addr}</p>
            <p>도로명 주소: {item.faci_road_addr}</p>
            <p>상태: {item.faci_stat_nm}</p>
            <p>갱신일: {item.updt_dt}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SportsCenter;
