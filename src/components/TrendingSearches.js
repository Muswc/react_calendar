import React, { useState, useEffect } from 'react';

const TrendingSearches = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        console.log('Fetching trends...');
        const response = await fetch('https://cors-proxy.fringe.zone/https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log('Raw data:', data.substring(0, 200) + '...'); // 데이터 일부만 출력

        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        console.log('Parsed XML:', xml);

        const items = xml.querySelectorAll('item');
        console.log('Found items:', items.length);

        const formattedTrends = Array.from(items).slice(0, 10).map((item, index) => {
          const keyword = item.querySelector('title')?.textContent;
          const trend = {
            rank: index + 1,
            keyword: keyword,
            traffic: item.querySelector('ht\\:approx_traffic')?.textContent,
            link: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
            newsTitle: item.querySelector('ht\\:news_item_title')?.textContent || '',
            newsSnippet: item.querySelector('ht\\:news_item_snippet')?.textContent || ''
          };
          console.log(`Trend ${index + 1}:`, trend);
          return trend;
        });

        console.log('Formatted trends:', formattedTrends);
        setTrends(formattedTrends);
        setLoading(false);
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setError(`트렌드를 가져오는데 실패했습니다: ${error.message}`);
        setLoading(false);
      }
    };

    fetchTrends();
    // 1시간마다 업데이트
    const interval = setInterval(fetchTrends, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="trending-container">
        <h3>실시간 인기 검색어</h3>
        <div className="trending-loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-container">
        <h3>실시간 인기 검색어</h3>
        <div className="trending-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="trending-container">
      <h3>실시간 인기 검색어</h3>
      <ul className="trending-list">
        {trends.map((item) => (
          <li key={item.rank} className="trending-item">
            <span className="rank">{item.rank}</span>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="keyword"
              title={`${item.newsTitle}\n\n${item.newsSnippet}`}
            >
              {item.keyword}
            </a>
            <span className="traffic">{item.traffic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingSearches; 