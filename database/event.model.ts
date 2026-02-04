import { Schema, model, models } from 'mongoose';
import { IEvent } from '@/lib/types';

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true, trim: true, maxlength: 100 },
        slug: { type: String, unique: true, lowercase: true, trim: true },
        description: { type: String, required: true, trim: true, maxlength: 1000 },
        overview: { type: String, required: true, trim: true, maxlength: 500 },
        image: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        mode: {
            type: String,
            required: true,
            enum: ['online', 'offline', 'hybrid'],
        },
        audience: { type: String, required: true, trim: true },
        agenda: {
            type: [String],
            required: true,
            validate: (v: string[]) => Array.isArray(v) && v.length > 0,
        },
        organizer: { type: String, required: true, trim: true },
        tags: {
            type: [String],
            required: true,
            validate: (v: string[]) => Array.isArray(v) && v.length > 0,
        },
    },
    {
        timestamps: true,
    }
);

EventSchema.pre('save', async function () {
    const generateSlug = (title: string): string =>
        title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    if (this.isModified('title') || this.isNew) {
        this.slug = generateSlug(this.title);
    }

    if (this.isModified('date') || this.isNew) {
        const date = new Date(this.date);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format.');
        }
        this.date = date.toISOString().split('T')[0];
    }

    if (this.isModified('time') || this.isNew) {
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
        const match = this.time.trim().match(timeRegex);
        if (!match) {
            throw new Error('Invalid time format.');
        }
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3]?.toUpperCase();
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        this.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
});

EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;