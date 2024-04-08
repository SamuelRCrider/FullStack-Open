import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList/component";
import ShowCountry from "./components/ShowCountry/component";

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [showCountry, setShowCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => {
        setAllCountries(res.data);
      });
  }, []);

  const filteredCountries = allCountries.filter(
    (current) => current.name.common.toLowerCase().search(country) >= 0
  );

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleShowCountry = (country) => {
    setShowCountry(country);
  };

  return (
    <div>
      <input
        placeholder="find country..."
        value={country}
        onChange={handleCountryChange}
      />
      <CountryList
        countries={filteredCountries}
        allCountries={allCountries}
        handleShowCountry={handleShowCountry}
      />
      <ShowCountry country={showCountry} />
    </div>
  );
};

export default App;
