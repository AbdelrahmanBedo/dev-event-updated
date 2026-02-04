import { Schema, model, models } from 'mongoose';
import Event from './event.model';
import { IBooking } from '@/lib/types';

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
        timestamps: true,
    }
);

BookingSchema.pre('save', async function () {
    if (this.isModified('eventId') || this.isNew) {
        const eventExists = await Event.findById(this.eventId);
        if (!eventExists) {
            throw new Error(`Event with ID ${this.eventId} does not exist`);
        }
    }
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;