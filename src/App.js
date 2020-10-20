import { Card, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Map from "./Map"
import Infobox from "./Infobox";
import Table from "./Table";  
import LineGraph from "./LineGraph";
import numeral from "numeral";
import './App.css';
import { sortData, prettyPrintStat } from "./utils";
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

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
            setMapCountries(data)
            setCountries(countries);

        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value
    //setCountry(countryCode);

    const url = countryCode === "worldwide" 
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
      await fetch(url)
        .then(response => response.json())
        .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);

            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);

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
              <Infobox 
                title="Covid-19 Cases"
                isRed
                active={casesType === "cases"} 
                onClick={(e) => setCasesType("cases")}
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={numeral(countryInfo.cases).format("0.0a")}
              />
              <Infobox 
                title="Recovered" 
                active={casesType === "recovered"}
                onClick={(e) => setCasesType("recovered")}
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
              <Infobox 
                title="Total" 
                isRed
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")}
                cases={prettyPrintStat(countryInfo.todayDeaths)} 
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
        </div>
        <Map 
              countries={mapCountries}
              casesType={casesType}
              center={mapCenter}
              zoom={mapZoom}
        />
      </div>
        
      <Card className="app__right">
            <h2>World wide total cases</h2>
            <Table countries={tableData}/><br/><br/>
            <h2>World wide total {casesType}</h2><br/>
            <LineGraph className="app__graph" casesType={casesType} />
        </Card>
      
    </div>
  );
}

export default App;
