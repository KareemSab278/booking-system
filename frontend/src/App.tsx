import { useState, useEffect } from 'react'
import './styles/App.css';
import BookingsTable from './components/BookingsTable.tsx';
import CreateBooking from './components/CreateBooking.tsx';

function App() {
  return (
    <>
      <div>
        <h1>Hotel Booking System</h1>
      Welcome to the Hotel Booking POS System. You can create, view, update, and delete bookings.
      <BookingsTable />
      To delete, click on a booking ID and press the delete key. To update, click on a field and edit the field then press enter.<br />
      Use the form below to create a new booking, and the table above shows existing bookings.
      <CreateBooking />
      (This service is not meant to work on mobile devices yet)
      </div>
    </>
  )
}

export default App
