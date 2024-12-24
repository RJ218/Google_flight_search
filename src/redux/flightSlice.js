import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFlights = createAsyncThunk('flights/fetchFlights', async (searchParams) => {
  const { origin, destination, departureDate, returnDate, travelClass } = searchParams;

  const baseFlights = [
    {
      id: 1,
      airline: 'Airline A',
      airlineLogo: 'https://via.placeholder.com/50',
      origin,
      destination,
      departureTime: '06:10 AM',
      arrivalTime: '08:55 AM',
      duration: '2 hr 45 min',
      stops: 0,
      price: { 'economy': 150, 'business': 300, 'first-class': 500 },
    },
    {
      id: 2,
      airline: 'Airline B',
      airlineLogo: 'https://via.placeholder.com/50',
      origin,
      destination,
      departureTime: '07:45 AM',
      arrivalTime: '10:30 AM',
      duration: '2 hr 45 min',
      stops: 1,
      price: { 'economy': 200, 'business': 400, 'first-class': 600 },
    },
    {
      id: 3,
      airline: 'Airline C',
      airlineLogo: 'https://via.placeholder.com/50',
      origin,
      destination,
      departureTime: '12:30 PM',
      arrivalTime: '03:15 PM',
      duration: '2 hr 45 min',
      stops: 0,
      emissions: '115 kg CO₂',
      price: { 'economy': 180, 'business': 350, 'first-class': 550 },
    },
  ];

  const flights = baseFlights.map((flight) => ({
    ...flight,
    price: flight.price[travelClass],
    date: departureDate,
  }));

  if (returnDate) {
    const returnFlights = baseFlights.map((flight, index) => ({
      ...flight,
      id: flight.id + baseFlights.length,
      origin: destination,
      destination: origin,
      departureTime: '06:00 PM',
      arrivalTime: '08:45 PM',
      date: returnDate,
      price: flight.price[travelClass],
    }));
    return [...flights, ...returnFlights];
  }

  return flights;
});

const flightSlice = createSlice({
  name: 'flights',
  initialState: {
    searchResults: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(fetchFlights.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default flightSlice.reducer;
