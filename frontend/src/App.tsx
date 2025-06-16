import { useState, useEffect } from 'react'
import './styles/App.css';
import BookingsTable from './components/BookingsTable.tsx';
import CreateBooking from './components/CreateBooking.tsx';

function App() {
  return (
    <>
      <div>
        
      <BookingsTable />
      <CreateBooking />
      </div>
    </>
  )
}

export default App
