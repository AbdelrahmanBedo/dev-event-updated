'use client';

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string; }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null); // State to hold error messages

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on new submission

        const { success, message } = await createBooking({ eventId, email });

        if (success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            // Set the error message from the server to be displayed in the UI
            setError(message || 'An unknown error occurred.');
            console.error('Booking creation failed:', message);
            posthog.captureException(new Error(message));
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {/* Display the error message if it exists */}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent;