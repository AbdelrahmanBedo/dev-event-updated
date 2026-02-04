import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

// Handler for GET requests to fetch a single event by its slug
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await connectDB();
        const { slug } = params;

        const event = await Event.findOne({ slug });

        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch event', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}