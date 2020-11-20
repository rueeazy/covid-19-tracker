import React, { useState, useEffect } from "react";
import "./App.css";
import { FormControl, Select, MenuItem } from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  // Get list of countries
  useEffect(() => {
    const getCountriesData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      if (response.ok) {
        const results = await response.json();
        const countries = results.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        setCountries(countries);
      } else {
        console.log(response.error);
      }
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__header">
        <h1>Covid 19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* header */}
      {/* title * select dropdown field */}
      {/* infobox */}
      {/* infobox */}
      {/* infobox */}

      {/* table */}
      {/* table */}

      {/* map */}
    </div>
  );
}

export default App;
