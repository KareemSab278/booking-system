import * as React from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import type {SelectChangeEvent } from '@mui/material';
import '../styles/CreateBooking.css';
import { calculatePrice } from '../utils/price';


// const api = 'http://127.0.0.1:5000/booking';
const api = 'https://booking-system-zvr3.onrender.com/booking';


const roomTypes = [
  'Standard', 'Deluxe', 'Suite', 'Family', 'Presidential'
];
const statuses = [
  'paid', 'not paid', 'cancelled', 'checked in', 'checked out'
];

export default function CreateBooking() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    number_of_adults: 1,
    number_of_children: 0,
    number_of_rooms: 1,
    room_type: 'Standard',
    status: 'not paid',
    email: '',
    phone: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name!]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const booking_time = `${hh}:${mm}`;
    const payload = {
      ...form,
      number_of_adults: Number(form.number_of_adults),
      number_of_children: Number(form.number_of_children),
      number_of_rooms: Number(form.number_of_rooms),
      price: calculatePrice(
        form.room_type,
        Number(form.number_of_adults),
        Number(form.number_of_children),
        Number(form.number_of_rooms),
        form.start_date,
        form.end_date
      ),
      booking_time,
    };
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      setSuccess('Booking created successfully!');
      window.location.reload(); // refresh the page to show the new booking because my dumass cant figure out how to update the bookings table
      setForm({
        first_name: '', last_name: '', number_of_adults: 1, number_of_children: 0, number_of_rooms: 1,
        room_type: 'Standard', status: 'not paid', email: '', phone: '', start_date: '', end_date: ''
      });
    } catch (err: any) {
      setError(err.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  // Calculate price based on current form values
  const calculatedPrice = calculatePrice(
    form.room_type,
    Number(form.number_of_adults),
    Number(form.number_of_children),
    Number(form.number_of_rooms),
    form.start_date,
    form.end_date
  );

  return (
    <form className="create-booking-form" onSubmit={handleSubmit}>
      <TextField label="First Name" name="first_name" value={form.first_name} onChange={handleInputChange} required />
      <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleInputChange} required />
      <TextField label="Adults" name="number_of_adults" type="number" value={form.number_of_adults} onChange={handleInputChange} required />
      <TextField label="Children" name="number_of_children" type="number" value={form.number_of_children} onChange={handleInputChange} required />
      <TextField label="Rooms" name="number_of_rooms" type="number" value={form.number_of_rooms} onChange={handleInputChange} required />
      <FormControl required>
        <InputLabel>Room Type</InputLabel>
        <Select name="room_type" value={form.room_type} onChange={handleSelectChange} label="Room Type">
          {roomTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField label="Phone" name="phone" value={form.phone} onChange={handleInputChange} required />
      <FormControl required>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={form.status} onChange={handleSelectChange} label="Status">
          {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField label="Email" name="email" value={form.email} onChange={handleInputChange} required />
      <TextField label="Price" value={calculatedPrice} InputProps={{ readOnly: true }} />
      <TextField label="Start Date" name="start_date" type="date" value={form.start_date} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
      <TextField label="End Date" name="end_date" type="date" value={form.end_date} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
      <Button type="submit" variant="contained" color="primary" disabled={loading} className="form-full">{loading ? 'Creating...' : 'Create Booking'}</Button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </form>
  );
}
