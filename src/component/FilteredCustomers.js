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
  filterCustomerByPurchaseDate,
  noDataFound,
} from "../utils/const";
import TableContainer from "./TableContainer";
import log from "../utils/logger";

export default function FilteredCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Today, 3 months ago, 3 years ago
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(today.getFullYear() - 3);

  // Date state with defaults
  const [fromDate, setFromDate] = useState(threeMonthsAgo);
  const [toDate, setToDate] = useState(today);

  // Fetch data from public folder
  useEffect(() => {
    fetch("/customers.json")
      .then((res) => res.json())
      .then((data) => {
        log.info("Fetched customer data:", data);
        setCustomers(data);
        setLoading(false);
        handleFilter(data, threeMonthsAgo, today);
      })
      .catch((err) => {
        log.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Filtering function
  const handleFilter = (data = customers, from = fromDate, to = toDate) => {
    const filtered = data.filter((cust) => {
      if (!cust.purchaseDate) return false;
      const txnDate = new Date(cust.purchaseDate);
      return txnDate >= from && txnDate <= to;
    });
    setFilteredCustomers(filtered);
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
              minDate={threeYearsAgo}
              maxDate={today}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              minDate={threeYearsAgo}
              maxDate={today}
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => handleFilter()}
            >
              {filter}
            </Button>
          </Stack>
        </LocalizationProvider>

        <Box mt={2}>
          {filteredCustomers.length > 0 ? (
            <TableContainer filteredCustomers={filteredCustomers} />
          ) : (
            <Alert severity="warning">{noDataFound}</Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
