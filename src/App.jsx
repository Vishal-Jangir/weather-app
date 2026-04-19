import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 
  // console.log(API_KEY)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  }, []);

  const fetchWeatherByCoords = (lat, lon) => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setError("");
      })
      .catch(() => setError("Failed to fetch location weather"))
      .finally(() => setLoading(false));
  };

  const getWeather = (e) => {
    e.preventDefault();

    if (!city.trim()) return;

    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.cod !== 200) {
          setError("City not found");
          setData(null);
        } else {
          setData(res);
          setError("");
        }
        setCity("");
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-3">🌤 Weather App</h2>

            <form onSubmit={getWeather} className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>

            {loading && (
              <div className="text-center">
                <div className="spinner-border" role="status"></div>
              </div>
            )}

            {error && <p className="text-danger text-center">{error}</p>}

            {data && (
              <div className="text-center">
                <h4>{data.name}</h4>
                <h1>{data.main.temp}°C</h1>

                <img
                  src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt=""
                />

                <p className="text-capitalize">{data.weather[0].description}</p>

                <div className="row mt-3">
                  <div className="col-6">
                    <div className="border rounded p-2">
                      <p className="mb-0">💧</p>
                      <small>Humidity</small>
                      <h6>{data.main.humidity}%</h6>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="border rounded p-2">
                      <p className="mb-0">🌬</p>
                      <small>Wind</small>
                      <h6>{data.wind.speed} km/h</h6>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
