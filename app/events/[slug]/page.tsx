import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';
import EventDetails from '@/components/EventDetails';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';

// This function fetches a single event by its slug directly from the database.
async function getEvent(slug: string): Promise<IEvent | null> {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
}

// This is the main page component.
export default async function EventDetailsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = await paramsPromise;
    const event = await getEvent(params.slug);

    if (!event) {
        notFound();
    }

    const similarEvents = await getSimilarEventsBySlug(params.slug);

    return (
        <main>
            <EventDetails event={event} similarEvents={similarEvents} />
        </main>
    );
}