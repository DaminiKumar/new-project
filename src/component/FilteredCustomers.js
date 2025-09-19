import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Alert,
  Box,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  errorFetchingData,
  filter,
  reset,
  filterCustomerByPurchaseDate,
  noDataFound,
} from "../utils/const";
import TableContainer from "./TableContainer";
import log from "../utils/logger";
import { threeMonthsAgo, today } from "../utils/date-constants";
import { filterCustomersByPurchaseDate } from "../utils/table-data";

export default function FilteredCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState(threeMonthsAgo);
  const [toDate, setToDate] = useState(today);

  // Fetch data from public folder
  useEffect(() => {
    fetch("/customers.json")
      .then((res) => res.json())
      .then((data) => {
        log.info("Fetched customer data:", data);
        setCustomers(data);
        setFilteredCustomers(
          filterCustomersByPurchaseDate(data, threeMonthsAgo, today)
        );
      })
      .catch((err) => {
        log.error("Error fetching data:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtering function
  const handleFilter = (from = fromDate, to = toDate) => {
    setFilteredCustomers(filterCustomersByPurchaseDate(customers, from, to));
  };

  const handleReset = () => {
    setFromDate(threeMonthsAgo);
    setToDate(today);
    setFilteredCustomers(
      filterCustomersByPurchaseDate(customers, threeMonthsAgo, today)
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">{errorFetchingData}</Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: "80%" }}>
        <Typography variant="h6" align="center" gutterBottom>
          {filterCustomerByPurchaseDate}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={3}
          >
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              maxDate={today}
              format="dd/MM/yyyy"
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              maxDate={today}
              format="dd/MM/yyyy"
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => handleFilter()}
            >
              {filter}
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleReset()}
            >
              {reset}
            </Button>
          </Stack>
        </LocalizationProvider>

        <Box mt={2}>
          {filteredCustomers && filteredCustomers.length > 0 ? (
            <TableContainer filteredCustomers={filteredCustomers} />
          ) : (
            <Alert severity="warning">{noDataFound}</Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
