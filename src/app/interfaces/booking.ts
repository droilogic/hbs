export interface Booking {
  id: string;
	rv: number;
	user_id: string;
	hotel_id: string;
	guest_name: string;
	guest_email: string;
	guest_address: string;
	guest_phone: string;
	room: string;
	persons: number;
	checkin: Date;
	checkout: Date;
	price: number;
	comments: string;
}