import React, { useEffect, useState } from 'react';
import '../styles/BookingsTable.css';
import OptionsMenu from './OptionsMenu';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'Booking ID', minWidth: 80 },
  { id: 'first_name', label: 'First Name', minWidth: 120 },
  { id: 'last_name', label: 'Last Name', minWidth: 120 },
  { id: 'number_of_adults', label: 'Adults', minWidth: 80, align: 'right' },
  { id: 'number_of_children', label: 'Children', minWidth: 80, align: 'right' },
  { id: 'number_of_rooms', label: 'Rooms', minWidth: 80, align: 'right' },
  { id: 'room_type', label: 'Room Type', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'phone', label: 'Phone', minWidth: 140 },
  { id: 'start_date', label: 'Start Date', minWidth: 110 },
  { id: 'end_date', label: 'End Date', minWidth: 110 },
  { id: 'price', label: 'Price', minWidth: 100, align: 'center', format: (value) => `$${value.toFixed(2)}`},
  { id: 'options', label: 'Options', minWidth: 100, align: 'center', format: () => <OptionsMenu></OptionsMenu>}
];

const fetchBookings = async () => {
  const response = await fetch('http://127.0.0.1:5000/');
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

export default function BookingsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings()
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (rows.length === 0) return <div>No bookings found.</div>;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className="container">
      <TableContainer className="tableContainer">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align ?? 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow hover key={idx}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align ?? 'left'}>
                        {column.format
                          ? column.format(value)
                          : value}
                      </TableCell>
                      
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 100]}
      />
    </Paper>
  );
}
