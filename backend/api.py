from flask import Flask, jsonify, request, redirect, session, url_for
import sqlite3
import os

#=============================================================

app = Flask(__name__)
app.secret_key = 'supersecretkey'
# DB_PATH = '/mnt/data/bookings.db'
DB_PATH = 'bookings.db'

#=============================================================

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS bookings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        first_name TEXT  NOT NULL,
                        last_name TEXT NOT NULL,
                        number_of_adults INTEGER NOT NULL,
                        number_of_children INTEGER NOT NULL,
                        number_of_rooms INTEGER NOT NULL,
                        room_type TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        phone TEXT UNIQUE NOT NULL,
                        date TEXT NOT NULL,
                        time TEXT NOT NULL,
                        price REAL NOT NULL
                )''')
        conn.commit()

init_db()


#============================================================= TEST DATA


# def add_test_data():
#     test_bookings = [
#         ("John", "Doe", 2, 0, 1, "Deluxe", "john@example.com", "1234567890", "2025-06-20", "14:00", 200.0),
#         ("Jane", "Smith", 2, 2, 2, "Family", "jane@example.com", "0987654321", "2025-06-21", "15:30", 350.0),
#         ("Alice", "Brown", 1, 0, 1, "Single", "alice@example.com", "1112223333", "2025-06-22", "12:00", 120.0)
#     ]
#     with sqlite3.connect(DB_PATH) as conn:
#         c = conn.cursor()
#         c.executemany('''
#             INSERT INTO bookings (
#                 first_name, last_name, number_of_adults, number_of_children, number_of_rooms, 
#                 room_type, email, phone, date, time, price
#             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', test_bookings)
#         conn.commit()

# add_test_data()


#============================================================= GET ALL BOOKINGS

@app.route('/')
def index():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM bookings ORDER BY id")  #fetch all bookings
        rows = c.fetchall()
        bookings = [dict(row) for row in rows]
        return jsonify(bookings)

#=============================================================

@app.route('/booking', methods=['POST'])
def create_booking():
    data = request.get_json()
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute('''
            INSERT INTO bookings (
                first_name, last_name, number_of_adults, number_of_children, 
                number_of_rooms, room_type, email, phone, date, time, price
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['first_name'], data['last_name'], data['number_of_adults'], 
            data['number_of_children'], data['number_of_rooms'], data['room_type'], 
            data['email'], data['phone'], data['date'], data['time'], data['price']
        ))
        conn.commit()
    return jsonify({"status": "success"}), 201

# tested with:
# {
#   "first_name": "Alice",
#   "last_name": "Smith",
#   "number_of_adults": 2,
#   "number_of_children": 1,
#   "number_of_rooms": 1,
#   "room_type": "Deluxe",
#   "email": "alice1@example.com",
#   "phone": "+1234567890",
#   "date": "2025-07-10",
#   "time": "15:00",
#   "price": 200.00
# }

# this needs to handle any errors that might occur during the booking process, like duplicate email or existing phone number entries or adding a booking with an invalid date or time or price is string or invalid int (friontend will vlaidate types)

#=============================================================

#=============================================================

#=============================================================

@app.route('/admin/delete/<int:product_id>', methods=['POST'])
def delete_product(product_id):
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM bookings WHERE id=?", (product_id,))
        conn.commit()
    return redirect(url_for('admin'))

#=============================================================

if __name__ == '__main__':
    app.run(debug=True)

#=============================================================