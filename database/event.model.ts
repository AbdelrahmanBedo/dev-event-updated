import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for the Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: 'online' | 'offline' | 'hybrid';
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

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
        timestamps: true, // Auto-generate createdAt and updatedAt
    }
);

// Pre-save hook for slug generation and data normalization using modern async/await.
EventSchema.pre('save', async function () {
    // Helper function to generate a URL-friendly slug.
    const generateSlug = (title: string): string =>
        title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters.
            .replace(/\s+/g, '-') // Replace spaces with hyphens.
            .replace(/-+/g, '-'); // Replace multiple hyphens with a single one.

    // Generate slug only if the title has changed or it's a new event.
    if (this.isModified('title') || this.isNew) {
        this.slug = generateSlug(this.title);
    }

    // Normalize date to ISO format (YYYY-MM-DD).
    if (this.isModified('date') || this.isNew) {
        const date = new Date(this.date);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format. Please use a recognizable date string.');
        }
        this.date = date.toISOString().split('T')[0];
    }

    // Normalize time to 24-hour format (HH:MM).
    if (this.isModified('time') || this.isNew) {
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
        const match = this.time.trim().match(timeRegex);
        if (!match) {
            throw new Error('Invalid time format. Please use HH:MM or HH:MM AM/PM.');
        }
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3]?.toUpperCase();
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0; // Midnight case.
        this.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
});

// Add a compound index for performance on common queries.
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;