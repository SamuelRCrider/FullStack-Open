import { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState({});

  const api_key = import.meta.env.VITE_SOME_KEY;

  const axiosCall = async () => {
    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${api_key}&units=metric`
      )
      .then((res) => {
        console.log("in promise");
        const responseData = res.data;
        setWeatherData(responseData);
      });
  };

  console.log("here we are");
  useEffect(() => {
    axiosCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("after effect", weatherData);

  return (
    <div>
      <h1>Weather in {country.capital}</h1>
      <p>Temperature: {weatherData.main.temp} C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt={weatherData.weather[0].description}
      />
      <p>Wind: {weatherData.wind.speed}m/s</p>
    </div>
  );
};

export default Weather;
