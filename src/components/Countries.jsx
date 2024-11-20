import React from 'react';
import Country from './Country';

const Countries = ({ countries }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  };

  return (
    <div style={gridStyle}>
      {countries.length > 0 ? (
        countries.map((country) => (
          <Country key={country.cca3} country={country} />
        ))
      ) : (
        <p>No countries found.</p>
      )}
    </div>
  );
};

export default Countries;
