import { FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [countries, setCountries] = useState([]);
   //https://disease.sh/v3/covid-19/countries

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

  return (
    <div className="app">
    <div className="app__header">
    <h1>Covid 19 tracker</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" value="abc">
          {
            countries.map(country => (<MenuItem value={country.value}>{country.name}</MenuItem>))
          }
          {/*<MenuItem value="worldwide">Example 1</MenuItem>
          <MenuItem value="worldwide">Examinationsdjgni</MenuItem>
          <MenuItem value="worldwide">India</MenuItem>
          <MenuItem value="worldwide">America</MenuItem>*/}
        </Select>
      </FormControl>
    </div>
    
    </div>
  );
}

export default App;
