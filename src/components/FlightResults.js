import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, CircularProgress, Grid, Box, Divider} from '@mui/material';

function FlightResults() {
  const { searchResults, status } = useSelector((state) => state.flights);

  if (status === 'loading') {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  if (status === 'failed') {
    return <p>Failed to load flights. Try again.</p>;
  }

  return (
    <Grid container spacing={3} sx={{ marginTop: 2 }}>
      {searchResults.map((flight) => (
        <Grid item xs={12} key={flight.id}>
          <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                {/* Flight Details */}
                <Grid item xs={6}>
                  <Typography variant="h6" fontWeight="bold">
                    {flight.airline}
                  </Typography>
                  <Typography variant="body2">
                    {flight.departureTime} - {flight.arrivalTime} ({flight.duration})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin} → {flight.destination}
                  </Typography>
                </Grid>

                {/* Price */}
                <Grid item xs={2} textAlign="right">
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ${flight.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.tripType}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginTop: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default FlightResults;
