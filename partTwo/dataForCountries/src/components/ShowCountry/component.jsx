const ShowCountry = ({ country }) => {
  return (
    <div>
      {!country ? (
        <></>
      ) : (
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
        </div>
      )}
    </div>
  );
};

export default ShowCountry;
