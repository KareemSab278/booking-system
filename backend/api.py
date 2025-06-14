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


#=============================== READ BOOKINGS ===============================

@app.route('/')
def index():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM bookings ORDER BY id")  #fetch all bookings
        rows = c.fetchall()
        bookings = [dict(row) for row in rows]
        return jsonify(bookings)

#=============================== CREATE BOOKING ===============================

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

# this needs to handle any errors (duplicate email/phone number OR invalid date/time OR price not number)
# frontend should handle types and validation using TS and field validation

#=============================== UPDATE BOOKING ===============================



#=============================== DELETE BOOKING ===============================

if __name__ == '__main__':
    app.run(debug=True)

#=============================================================