import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

// Handler for GET requests to fetch all events
export async function GET() {
    try {
        await connectDB();
        const events = await Event.find({});
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch events', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// Handler for POST requests to create a new event
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const eventData = Object.fromEntries(formData.entries());

        // The 'agenda' and 'tags' fields might come in as comma-separated strings
        // and need to be converted to arrays.
        if (typeof eventData.agenda === 'string') {
            eventData.agenda = eventData.agenda.split(',').map(item => item.trim());
        }
        if (typeof eventData.tags === 'string') {
            eventData.tags = eventData.tags.split(',').map(item => item.trim());
        }

        const createdEvent = await Event.create(eventData);

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        // Provide more specific error messages for validation errors
        if (e instanceof Error && e.name === 'ValidationError') {
            return NextResponse.json({ message: 'Validation Failed', error: e.message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 });
    }
}