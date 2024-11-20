import React, { useState, useEffect } from 'react';
import Countries from './components/Countries';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [continents, setContinents] = useState([]); // State for unique continents
  const [subregions, setSubregions] = useState([]); // State for unique subregions
  const [continentFilter, setContinentFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [top10Option, setTop10Option] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);

        const uniqueContinents = Array.from(
          new Set(data.flatMap((country) => country.continents))
        ).sort();
        setContinents(uniqueContinents);

        const uniqueSubregions = Array.from(
          new Set(data.map((country) => country.subregion).filter(Boolean))
        ).sort();
        setSubregions(uniqueSubregions);
      });
  }, []);

  useEffect(() => {
    let filtered = [...countries];

    if (continentFilter) {
      filtered = filtered.filter((country) =>
        country.continents?.includes(continentFilter)
      );
      setSubregionFilter('');
    }

    if (subregionFilter) {
      filtered = filtered.filter(
        (country) => country.subregion === subregionFilter
      );
      setContinentFilter('');
    }

    if (sortOption === 'alphabetically') {
      filtered.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    }

    if (top10Option) {
      const sortKey = top10Option === 'population' ? 'population' : 'area';
      filtered = filtered
        .filter((country) => country[sortKey])
        .sort((a, b) => b[sortKey] - a[sortKey])
        .slice(0, 10);
    }

    setFilteredCountries(filtered);
  }, [countries, continentFilter, subregionFilter, top10Option, sortOption]);

  return (
    <div>
      <h1>Countries of the Wolrd</h1>

      <div style={{ marginBottom: '20px' }}>
        <div>
          <label>Filter by Continent: </label>
          <select
            value={continentFilter}
            onChange={(e) => setContinentFilter(e.target.value)}
          >
            <option value="">All</option>
            {continents.map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Filter by Subregion: </label>
          <select
            value={subregionFilter}
            onChange={(e) => setSubregionFilter(e.target.value)}
          >
            <option value="">All</option>
            {subregions.map((subregion) => (
              <option key={subregion} value={subregion}>
                {subregion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Top 10: </label>
          <input
            type="radio"
            name="top10"
            value="population"
            checked={top10Option === 'population'}
            onChange={() => setTop10Option('population')}
          />
          By Population
          <input
            type="radio"
            name="top10"
            value="area"
            checked={top10Option === 'area'}
            onChange={() => setTop10Option('area')}
          />
          By Area
        </div>

        <div>
          <label>Sort Alphabetically: </label>
          <input
            type="checkbox"
            checked={sortOption === 'alphabetically'}
            onChange={(e) =>
              setSortOption(e.target.checked ? 'alphabetically' : '')
            }
          />
        </div>

        <div>
          <button
            onClick={() => {
              setContinentFilter('');
              setSubregionFilter('');
              setTop10Option('');
              setSortOption('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <Countries countries={filteredCountries} />
    </div>
  );
};

export default App;
