import { Card, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Map from "./Map"
import Infobox from "./Infobox";
import Table from "./Table";  
import './App.css';
import { sortData } from "./utils";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
            const countries = data.map((country) => (
              {
                name: country.country, // this returns the name of the country
                value: country.countryInfo.iso3, // this returns the 3 letter valuse of the country like IND, USA, etc... 
              }
            ));
            
            const sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);

        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value
    setCountry(countryCode);

    const url = countryCode === "worldwide" 
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
      await fetch(url)
        .then(response => response.json())
        .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
        });
  };
  // console.log("CountryInfo",countryInfo)

  return (

    <div className="app">
      <div className="app__left">
        <div className="app__header">
        <h1>Covid 19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map(country => (<MenuItem value={country.value}>{country.name}</MenuItem>))
              }          
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
              <Infobox title="Covid-19 Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
              <Infobox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
              <Infobox title="Total" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map/>
      </div>
      <Card className="app__right">
          <h2>World wide total cases</h2>
          <Table countries={tableData}/>
          <h2>World wide total cases graph</h2>
      </Card>
    </div>
  );
}

export default App;
