import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFlights } from '../redux/flightSlice';
import {Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Paper, Alert} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';

function FlightSearchForm() {
  const [formData, setFormData] = useState({
    tripType: 'round-trip',
    travelers: 1,
    travelClass: 'economy',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
  });

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target.name === 'tripType' && e.target.value === 'one-way') {
      setFormData({ ...formData, [e.target.name]: e.target.value, returnDate: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { origin, destination, departureDate, returnDate, tripType } = formData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!origin) newErrors.origin = 'Origin is required';
    if (!destination) newErrors.destination = 'Destination is required';
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else {
      const departure = new Date(departureDate);
      if (departure < today) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }

    if (tripType === 'round-trip' && !returnDate) {
      newErrors.returnDate = 'Return date is required for a round trip';
    }

    if (tripType === 'round-trip' && departureDate && returnDate) {
      const departure = new Date(departureDate);
      const returnDt = new Date(returnDate);
      if (returnDt <= departure) {
        newErrors.returnDate = 'Return date must be after the departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateForm()) {
      setShowError(false);
      dispatch(fetchFlights(formData));
    } else {
      setShowError(true);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        borderRadius: 4,
        maxWidth: 900,
        margin: '20px auto',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          marginBottom: 3,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Flight Search
      </Typography>

      {showError && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          Please provide correct/complete information for searching.
        </Alert>
      )}

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4} sx={{ paddingTop: '8px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Trip Type</InputLabel>
            <Select
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              label="Trip Type"
            >
              <MenuItem value="round-trip">Round Trip</MenuItem>
              <MenuItem value="one-way">One Way</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ paddingTop: '8px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Travelers</InputLabel>
            <Select
              name="travelers"
              value={formData.travelers}
              onChange={(e) =>
                setFormData({ ...formData, travelers: parseInt(e.target.value, 10) })
              }
              label="Travelers"
            >
              {[...Array(10).keys()].map((num) => (
                <MenuItem key={num + 1} value={num + 1}>
                  {num + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ paddingTop: '8px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Class</InputLabel>
            <Select
              name="travelClass"
              value={formData.travelClass}
              onChange={handleChange}
              label="Class"
            >
              <MenuItem value="economy">Economy</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="first-class">First Class</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            label="Origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.origin}
            helperText={errors.origin}
          />
        </Grid>
        <Grid item xs={12} sm={2} textAlign="center">
          <IconButton onClick={handleSwap} color="primary" size="large">
            <SwapHorizIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.destination}
            helperText={errors.destination}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Departure"
            name="departureDate"
            type="date"
            value={formData.departureDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            error={!!errors.departureDate}
            helperText={errors.departureDate}
            inputProps={{
              min: today,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Return"
            name="returnDate"
            type="date"
            value={formData.returnDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="outlined"
            error={!!errors.returnDate}
            helperText={errors.returnDate}
            disabled={formData.tripType === 'one-way'}
            inputProps={{
              min: formData.departureDate || today,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            fullWidth
            sx={{
              fontWeight: 'bold',
              padding: 1.5,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Search Flights
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FlightSearchForm;
