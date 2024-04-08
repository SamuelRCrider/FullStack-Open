import Weather from "../Weather/component";

const CountryList = ({ countries, allCountries, handleShowCountry }) => {
  if (countries.length === 1) {
    const country = countries[0];
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
        <div style={{ fontSize: "200px" }}>{country.flag}</div>
        {/* <img
              src={country.flag}
              alt={`Flag of ${country.name.common}`}
              height="150px"
            /> */}
        <Weather country={country} />
      </div>
    );
  } else if (countries.length > 10 && countries.length < allCountries.length) {
    return <div>Further Specification Required...</div>;
  } else if (countries.length <= 10) {
    return (
      <ul>
        {countries.map((current, index) => {
          return (
            <li key={index}>
              {current.name.common}{" "}
              <button onClick={() => handleShowCountry(current)}>Show</button>
            </li>
          );
        })}
      </ul>
    );
  }
};

export default CountryList;
