import React, { useState, useEffect } from 'react';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermissionButton, setShowPermissionButton] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("위치 정보 획득 성공:", position);
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("위치 정보 획득 실패:", error);
          setShowPermissionButton(true);
          setLoading(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("위치 정보 접근이 거부되었습니다. 다시 시도해주세요.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("위치 정보를 사용할 수 없습니다");
              break;
            case error.TIMEOUT:
              setError("위치 정보 요청 시간이 초과되었습니다");
              break;
            default:
              setError("위치 정보를 가져오는데 실패했습니다");
          }
        },
        {
          maximumAge: 0,
          timeout: 5000
        }
      );
    } else {
      setError("이 브라우저에서는 위치 정보를 지원하지 않습니다");
      setLoading(false);
    }
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = "64a7ed474b36514b8f39c5709835817f";
      console.log("API KEY:", API_KEY);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API 응답 에러:', errorData);
        throw new Error(`날씨 정보 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("날씨 데이터:", data);
      setWeather({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name
      });
      setLoading(false);
    } catch (err) {
      console.error('날씨 데이터 요청 실패:', err);
      setError('날씨 정보를 가져오는데 실패했습니다');
      setLoading(false);
    }
  };

  const requestLocationPermission = () => {
    setLoading(true);
    setShowPermissionButton(false);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          setShowPermissionButton(true);
          setLoading(false);
          setError("위치 정보 접근이 거부되었습니다. 다시 시도해주세요.");
        }
      );
    }
  };

  if (showPermissionButton) {
    return (
      <div className="weather-widget">
        <h3>오늘의 날씨는?</h3>
        <div className="weather-prompt">
          <p>날씨 정보를 보려면 위치 권한이 필요합니다</p>
          <button onClick={requestLocationPermission} className="location-button">
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
            src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
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