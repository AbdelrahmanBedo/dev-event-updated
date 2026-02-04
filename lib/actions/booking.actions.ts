'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, email }: { eventId: string; email: string; }) => {
    try {
        await connectDB();

        const newBooking = await Booking.create({ eventId, email });

        if (!newBooking) {
            throw new Error("Booking creation returned null.");
        }

        return { success: true, message: "Booking successful!" };
    } catch (e: any) {
        console.error('Create booking failed:', e);

        // Check for duplicate key error (code 11000)
        if (e.code === 11000) {
            return { success: false, message: "You have already booked this event." };
        }

        // Check for CastError (e.g., invalid ObjectId format)
        if (e.name === 'CastError') {
            return { success: false, message: `Invalid Event ID format: ${e.message}` };
        }

        // Check for other Mongoose validation errors
        if (e.name === 'ValidationError') {
            return { success: false, message: e.message };
        }

        // Fallback: return the actual error message for better debugging.
        return { success: false, message: e.message || "An unknown server error occurred." };
    }
}