# Hotel Booking Management System

A full-stack hotel booking management system with a modern React frontend and a Flask/SQLite backend. The app allows you to create, view, edit, and delete hotel bookings, with live price calculation based on room type, number of guests, rooms, and length of stay.

---

## Features

### Frontend (React + MUI)
- **Bookings Table**: View all bookings in a styled, editable, and keyboard-navigable table (MUI DataGrid).
  - Edit fields inline (name, status, email, phone).
  - Delete bookings with the Delete key.
  - Table refreshes automatically after changes.
- **Create Booking Form**: Add new bookings with validation and live price calculation.
  - Price updates as you change room type, guest count, or dates.
  - Form layout matches the table for a consistent look.
- **Modern UI**: Dark theme, responsive design, and consistent styling using CSS and MUI.
- **Shared Logic**: Price calculation is shared between table and form.

### Backend (Flask + SQLite)
- **REST API**: Endpoints for CRUD operations on bookings.
- **Validation**: All fields validated on the backend.
- **Persistent Storage**: Uses SQLite for easy setup and portability.
- **CORS Enabled**: Allows frontend-backend communication during development.

---

## Project Structure

```
frontend/
  src/
    components/
      BookingsTable.tsx
      CreateBooking.tsx
    styles/
      BookingsTable.css
      CreateBooking.css
    utils/
      price.ts
    App.tsx
    main.tsx
backend/
  api.py
  bookings.db
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.8+

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. (Optional) Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install Flask and Flask-CORS:
   ```sh
   pip install flask flask-cors
   ```
4. Run the backend server:
   ```sh
   python api.py
   ```
   The API will be available at `http://127.0.0.1:5000/`

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173/` (or as shown in your terminal)

---

## API Endpoints

- `GET /` — List all bookings
- `POST /booking` — Create a new booking
- `PUT /update-booking/<id>` — Update a booking
- `DELETE /delete-booking/<id>` — Delete a booking

All booking fields are required. Price is calculated on the frontend and validated on the backend.

---

## Customization & Extending
- **Price Logic**: Edit `frontend/src/utils/price.ts` to change how prices are calculated.
- **Styling**: Tweak CSS in `frontend/src/styles/` for a different look.
- **Database**: The backend uses SQLite by default. You can switch to another DB by updating `api.py`.

---

## Testing
- Use Postman or similar tools to test API endpoints directly (see backend/api.py for details).
- The frontend will show errors if the backend is not running or if validation fails.

---

## License

This project is for educational/demo purposes. Use and modify as you wish.
