export function calculatePrice(
  room_type: string,
  number_of_adults: number,
  number_of_children: number,
  number_of_rooms: number,
  start_date?: string,
  end_date?: string
) {
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

  // Calculate number of nights (default to 1 if dates are missing or invalid)
  let nights = 1;
  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diff = end.getTime() - start.getTime();
    nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return base * number_of_rooms * nights;
}

// this function calculates price based on nums of children adults and rooms (and type of room)
// it is used in createbooking and bookingstable comps