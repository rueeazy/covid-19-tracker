import React, { useState, useEffect } from "react";
import "./App.css";
import { sortData } from "../../util.js";
import InfoBox from "../InfoBox/InfoBox";
import Map from "../Map/Map";
import LineGraph from "../LineGraph/LineGraph";
import Table from "../Table/Table";
import "leaflet/dist/leaflet.css";

import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);

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
        const sortedData = sortData(results);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(results);
      } else {
        console.log(response.error);
      }
    };
    getCountriesData();
  }, []);

  // On load up grab world data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data))
      .catch((error) => console.log(error.message));
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // fetch country data for selected country
    const response = await fetch(url);
    const data = await response.json();
    setCountryInfo(data);

    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            total={countryInfo.todayCases}
            cases={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            total={countryInfo.todayRecovered}
            cases={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            total={countryInfo.todayDeaths}
            cases={countryInfo.deaths}
          />
        </div>
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
