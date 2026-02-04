import { Document, Types } from 'mongoose';

export interface IEvent extends Document {
    _id: string;
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

export interface IBooking extends Document {
    _id: string;
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
