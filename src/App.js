import React from 'react';
import FlightSearchForm from './components/FlightSearchForm';
import FlightResults from './components/FlightResults';
import { Container } from '@mui/material';

function App() {
  return (
    <Container>
      <FlightSearchForm />
      <FlightResults />
    </Container>
  );
}

export default App;
