import React, { useState, useEffect } from 'react';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermissionButton, setShowPermissionButton] = useState(false);

  const checkPermissionAndGetLocation = async () => {
    try {
      if (!navigator.geolocation) {
        throw new Error("이 브라우저에서는 위치 정보를 지원하지 않습니다");
      }
      
      setShowPermissionButton(true);
      setLoading(false);
      
    } catch (error) {
      console.error("위치 정보 처리 중 오류:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('현재 프로토콜:', window.location.protocol);
    
    checkPermissionAndGetLocation();
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
      if (!API_KEY) {
        throw new Error('날씨 API 키가 설정되지 않았습니다');
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API 응답 에러:', errorData);
        throw new Error(`날씨 정보 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name
      });
      setLoading(false);
      setShowPermissionButton(false);
    } catch (err) {
      console.error('날씨 데이터 요청 실패:', err);
      setError('날씨 정보를 가져오는데 실패했습니다');
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        });
      });
      
      console.log('위치 정보 획득 성공:', position.coords);
      const { latitude, longitude } = position.coords;
      await getWeatherData(latitude, longitude);
      
    } catch (error) {
      console.error("위치 정보 처리 중 오류:", error);
      setError(error.message || "위치 정보를 가져오는데 실패했습니다");
      setLoading(false);
    }
  };

  if (showPermissionButton) {
    return (
      <div className="weather-widget">
        <h3>오늘의 날씨는?</h3>
        <div className="weather-prompt">
          <p>날씨 정보를 보려면 위치 권한이 필요합니다</p>
          <button 
            onClick={requestLocationPermission} 
            className="location-button"
            style={{ cursor: 'pointer' }}
          >
            위치 권한 허용하기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="weather-widget">
        <h3>오늘의 날씨는?</h3>
        <div className="weather-loading">날씨 정보를 가져오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <h3>오늘의 날씨는?</h3>
        <div className="weather-error">{error}</div>
        <button 
          onClick={requestLocationPermission} 
          className="location-button"
          style={{ marginTop: '10px', cursor: 'pointer' }}
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <h3>
        오늘의 날씨는?
        {weather && <span className="location">({weather.location})</span>}
      </h3>
      {weather && (
        <div className="weather-info">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
            alt={weather.description}
          />
          <span className="temp">{weather.temp}°C</span>
          <span className="desc">{weather.description}</span>
        </div>
      )}
    </div>
  );
};

export default Weather;