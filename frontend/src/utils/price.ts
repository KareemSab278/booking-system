export function calculatePrice(room_type: string, number_of_adults: number, number_of_children: number, number_of_rooms: number) {
  let base = 0;
  if (room_type === 'Standard') {
    base = 100 + number_of_adults * 10 + number_of_children * 5;
  } else if (room_type === 'Deluxe') {
    base = 150 + number_of_adults * 15 + number_of_children * 7;
  } else if (room_type === 'Suite') {
    base = 200 + number_of_adults * 20 + number_of_children * 10;
  } else if (room_type === 'Family') {
    base = 250 + number_of_adults * 25 + number_of_children * 12;
  } else if (room_type === 'Presidential') {
    base = 300 + number_of_adults * 30 + number_of_children * 15;
  }
  return base * number_of_rooms;
}

// this function calculates price based on nums of children adults and rooms (and type of room)
// it is used in createbooking and bookingstable comps