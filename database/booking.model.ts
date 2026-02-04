import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: (email: string) =>
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email),
                message: 'Please provide a valid email address',
            },
        },
    },
    {
        timestamps: true, // Auto-generate createdAt and updatedAt
    }
);

// Pre-save hook to validate that the referenced event exists using modern async/await.
// This function does NOT use the `next` callback.
BookingSchema.pre('save', async function () {
    if (this.isModified('eventId') || this.isNew) {
        const eventExists = await Event.findById(this.eventId);
        if (!eventExists) {
            // Throwing an error automatically stops the save and propagates the error.
            throw new Error(`Event with ID ${this.eventId} does not exist`);
        }
    }
    // If the function completes without throwing, the save operation proceeds.
});

// Add indexes for performance
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ email: 1 });
// Enforce that a user can only book a specific event once.
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;