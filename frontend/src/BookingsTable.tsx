import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {use} from 'react';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'Booking ID', minWidth: 50, align: 'left' },
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
//   { id: 'start_time', label: 'Time', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100, align: 'center', format: (value) => `$${value.toFixed(2)}` },
];

const fetchBookings = async () => {
    const api = 'http://127.0.0.1:5000/';
  const response = await fetch(api);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export default function BookingsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  
    

   React.useEffect(() => {
    fetchBookings()
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (rows.length === 0) {
        return <div>No bookings found.</div>;
    }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{
    width: '100%',
    maxWidth: '100%',
    minWidth: '600px',
    margin: '0 auto',
    overflow: 'hidden',
  }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="bookings table">
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
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={0} key={index}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align ?? 'left'}>
                        {/* need to add custom  context menu here to edit the fields. https://youtu.be/moj-hTXBgz4?si=akf2HoWeb6nMzoQn*/}
                        {column.format && value !== undefined
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
