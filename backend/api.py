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
                        email TEXT NOT NULL,
                        phone TEXT NOT NULL,
                        date TEXT NOT NULL,
                        time TEXT NOT NULL,
                        price REAL NOT NULL
                )''')
        conn.commit()
#apparently you use REAL for prices in sqlite3...
init_db()

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

    #============== Validation start =================

    required_fields = ['first_name', 'last_name', 'number_of_adults',
    'number_of_children', 'number_of_rooms', 'room_type',
    'email', 'phone', 'date', 'time', 'price'] #fields that are NOT NULL in db
    #=====
    if not data:
        return jsonify({"error": "No data provided"}), 400 # check if !data
    #=====
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400 # check if all field in fields are in data
    #=====
    if data.get('price') is None or not isinstance(data['price'], (int, float)):
        return jsonify({"error": "Price must be a number!"}), 400
    
    #============== Validation end =================
    
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

#=============================== UPDATE BOOKING ===============================

@app.route('/update-booking/<int:id>', methods=['PUT'])
def update_booking(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    with sqlite3.connect(DB_PATH) as conn:                  #theoretically i should get all data fields from the form... my frontend SHOULD HANDLE THIS...
        c = conn.cursor()
        valid = (
    isinstance(data.get('first_name'), str) and data['first_name'] and
    isinstance(data.get('last_name'), str) and data['last_name'] and
    isinstance(data.get('number_of_adults'), int) and data['number_of_adults'] >= 0 and
    isinstance(data.get('number_of_children'), int) and data['number_of_children'] >= 0 and
    isinstance(data.get('number_of_rooms'), int) and data['number_of_rooms'] > 0 and
    isinstance(data.get('room_type'), str) and data['room_type'] and
    isinstance(data.get('email'), str) and data['email'] and
    isinstance(data.get('phone'), str) and data['phone'] and
    isinstance(data.get('date'), str) and data['date'] and
    isinstance(data.get('time'), str) and data['time'] and
    (isinstance(data.get('price'), float) or isinstance(data.get('price'), int)) and data['price'] >= 0
)
        if not valid: 
            return jsonify({"error": "Invalid data format"}), 400
        else:
            c.execute('''UPDATE bookings
    SET first_name = ?, last_name = ?, number_of_adults = ?, number_of_children = ?,
        number_of_rooms = ?, room_type = ?, email = ?, phone = ?, date = ?, time = ?, price = ?
    WHERE id = ?''', (
                data['first_name'], data['last_name'], data['number_of_adults'],            #i need to check if all fields are in correct format... maybe frontend should handle this???
                data['number_of_children'], data['number_of_rooms'], data['room_type'], 
                data['email'], data['phone'], data['date'], data['time'], data['price'], id
            ))
            conn.commit()
        return jsonify({"status": "success"}), 200 # success update

#=============================== DELETE BOOKING ===============================

@app.route('/delete-booking/<int:id>', methods=['DELETE'])
def delete_booking(id):
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()

        #===== Validation start =====
        if not isinstance(id, int) or not id or id <= 0:
            return jsonify({"error": "ID must be an integer"}), 400
        #===== Validation end =====
        
        c.execute('DELETE FROM bookings WHERE id = ?', (id,))
        conn.commit()
        if c.rowcount == 0: #if no rows were deleted, booking with this id does not exist
            return jsonify({"error": "Booking not found"}), 404
    return jsonify({"status": "success"}), 200 # success delete

#================================== END ===============================

if __name__ == '__main__':
    app.run(debug=True)

#=============================================================