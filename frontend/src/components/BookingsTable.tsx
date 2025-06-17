import React, { useEffect, useState } from 'react';
import '../styles/BookingsTable.css';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowId, GridRowModel } from '@mui/x-data-grid';
import { calculatePrice } from '../utils/price';

//========================================= API endpoint =========================================

const api = 'http://127.0.0.1:5000/';

//========================================= fetch bookings function =========================================

export const fetchBookings = async () => {
  const response = await fetch(api);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

//========================================= update booking function =========================================

const updateBooking = async (id: GridRowId, updatedRow: GridRowModel) => {
  const response = await fetch(`${api}update-booking/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedRow),
  });
  if (!response.ok) throw new Error('Failed to update booking');
  return response.json();
};

//========================================= delete booking function =========================================

const deleteBooking = async (id: number) => {
  const response = await fetch(`${api}delete-booking/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete booking');
  return response.json();
}

//========================================= the real stuff =========================================

export default function BookingsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });

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

  //====================== handle loading, error, and empty state ======================

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (rows.length === 0) return <div>No bookings found.</div>;

  //====================== render bookings table ======================

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Booking ID', width: 80 },
    { field: 'first_name', headerName: 'First Name', width: 120, editable: true },
    { field: 'last_name', headerName: 'Last Name', width: 120, editable: true },
    { field: 'number_of_adults', headerName: 'Adults', width: 80, editable: false, type: 'number', align: 'right', headerAlign: 'right' },
    { field: 'number_of_children', headerName: 'Children', width: 80, editable: false, type: 'number', align: 'right', headerAlign: 'right' },
    { field: 'number_of_rooms', headerName: 'Rooms', width: 80, editable: false, type: 'number', align: 'right', headerAlign: 'right' },
    {
      field: 'room_type',
      headerName: 'Room Type',
      width: 120,
      editable: false,
      type: 'singleSelect',
      valueOptions:
        [
          { value: 'Standard', label: 'Standard' },
          { value: 'Deluxe', label: 'Deluxe' },
          { value: 'Suite', label: 'Suite' },
          { value: 'Family', label: 'Family' },
          { value: 'Presidential', label: 'Presidential' },
        ]
    },
    {
      field: 'status',
      headerName: 'status',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions:
        [
          { value: 'paid', label: 'paid' },
          // { value: 'partially paid', label: 'partially paid' }, // hotel policy is to pay fully before checking in
          { value: 'not paid', label: 'not paid' },
          { value: 'cancelled', label: 'cancelled' },
          { value: 'checked in', label: 'checked in' },
          { value: 'checked out', label: 'checked out' },
        ]
    },
    { field: 'email', headerName: 'Email', width: 180, editable: true },
    { field: 'phone', headerName: 'Phone', width: 140, editable: true },
    { field: 'start_date', headerName: 'Start Date', width: 110, editable: false },
    { field: 'end_date', headerName: 'End Date', width: 110, editable: false },
    {
      field: 'price', headerName: 'Price', width: 100, editable: false, type: 'number', align: 'center', headerAlign: 'center',
      valueFormatter: (params: number) => `£${Number(params).toFixed(2)}`
    },
  ];

  //====================== render the DataGrid ======================

  return (
    <div style={{ height: '100%', width: '100%', padding: 16 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 100]}
        disableRowSelectionOnClick
        onCellClick={(params, event) => {
          if (params.field === 'id') {
            event.defaultMuiPrevented = true;
          }
        }}

        // delete booking on delete key press (best thing i could come up with...)
        onCellKeyDown={async (params, event) => {
          if (
            params.field === 'id' &&
            event.key === 'Delete'
          ) {
            event.preventDefault();
            if (window.confirm(`Delete booking with ID ${params.value}?`)) {
              try {
                await deleteBooking(Number(params.value));
                setRows((prevRows) => prevRows.filter((row) => row.id !== params.value));
                alert('Booking deleted!');
              } catch (err) {
                alert('Failed to delete booking');
              }
            }
          }
        }}

        // thus is to edit the booking
        onCellEditStop={(params: any, event: any) => {
          if (params.reason === 'cellFocusOut') {
            event.defaultMuiPrevented = true;
          }
        }}

        processRowUpdate={async (newRow, oldRow) => {
          if (!newRow.id) {
            return newRow;
          }
          //===================================
          // to format time as HH:MM and pass it to the backend
          const now = new Date();
          const hh = String(now.getHours()).padStart(2, '0');
          const mm = String(now.getMinutes()).padStart(2, '0');
          const currentTime = `${hh}:${mm}`;
          //===================================

          const payload = { // idk why it's called "payload", but thats how the website says it...
            first_name: newRow.first_name,
            last_name: newRow.last_name,
            number_of_adults: newRow.number_of_adults,
            number_of_children: newRow.number_of_children,
            number_of_rooms: newRow.number_of_rooms,
            room_type: newRow.room_type,
            status: newRow.status,
            email: newRow.email,
            phone: newRow.phone,
            start_date: newRow.start_date,
            end_date: newRow.end_date,
            booking_time: currentTime,
            price: calculatePrice(
              newRow.room_type,
              Number(newRow.number_of_adults),
              Number(newRow.number_of_children),
              Number(newRow.number_of_rooms),
              newRow.start_date,
              newRow.end_date
            ),
          };

          //===================================
          try {
            await updateBooking(newRow.id, payload); // can we update the booking with the new data?
            alert('Booking updated successfully'); // if it worked, show a success message
            setRows((prevRows) => prevRows.map((row) => row.id === newRow.id ? { ...row, ...newRow } : row)); // update state (the table) with new updated data
            return { ...newRow };
          } catch (err) {
            alert('Failed to update booking'); // you messed up like you messed your life up..
            return oldRow; // show older data
          }
        }
        }
      />
    </div>
  );
}
// ok im done here now moving on to the CreateBooking component