import { Card, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Map from "./Map"
import Infobox from "./Infobox";
import './App.css';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

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

            setCountries(countries);

        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countyrCode = event.target.value
    //console.log(countyrCode);
    setCountry(countyrCode);
  }

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
              <Infobox title="CoronaVirus Cases" cases={123456} total={456123}/>
              <Infobox title="Recovered" cases={123456} total={456123}/>
              <Infobox title="Total" cases={123456} total={456123}/>
        </div>
        <Map/>
      </div>
      <Card className="app__right">
          <h1>World wide total cases</h1>
          <h1>World wide total cases graph</h1>
      </Card>
    </div>
  );
}

export default App;
