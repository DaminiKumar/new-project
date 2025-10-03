import React, { useState, useEffect } from "react";
import { parse } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
} from "@mui/material";
import { formatTableCellValue } from "../utils/table-data";

function EnhancedTable({ columns, rows, title, resetClicked }) {
  const [orderBy, setOrderBy] = useState(columns[0]?.id || "");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (colId) => {
    const isAsc = orderBy === colId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colId);
  };

  const getComparableValue = (value, type) => {
    if (type === "date-ddmmyyyy") {
      return parse(value, "dd/MM/yyyy", new Date());
    }
    if (type === "date-mmmyyyy") {
      return parse(value, "MMM yyyy", new Date());
    }
    return value;
  };

  const sortedRows = [...rows].sort((a, b) => {
    let type = "";
    if (orderBy === "purchaseDate") type = "date-ddmmyyyy";
    else if (orderBy === "monthYear") type = "date-mmmyyyy";

    const valA = getComparableValue(a[orderBy], type);
    const valB = getComparableValue(b[orderBy], type);

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setPage(0);
  }, [resetClicked]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {title}
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {formatTableCellValue(row, col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}

export default EnhancedTable;
