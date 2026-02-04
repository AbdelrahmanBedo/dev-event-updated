import { notFound } from 'next/navigation';
import { unstable_cache as cache } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { IEvent } from '@/lib/types';
import EventDetails from '@/components/EventDetails';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';

// This function generates the static paths for each event at build time.
export async function generateStaticParams() {
    await connectDB();
    const events = await Event.find({}, 'slug').lean();
    return events.map((event) => ({
        slug: event.slug,
    }));
}

// This function fetches a single event by its slug, wrapped in a cache.
const getEvent = cache(
    async (slug: string): Promise<IEvent | null> => {
        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        if (!event) return null;
        return JSON.parse(JSON.stringify(event));
    },
    ['event-by-slug'], // Cache key prefix
    {
        tags: ['events'], // Cache tag
    }
);

// This is the main page component.
export default async function EventDetailsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = await paramsPromise;
    const event = await getEvent(params.slug);

    if (!event) {
        notFound();
    }

    // Wrap the similar events fetch in a cache as well.
    const getCachedSimilarEvents = cache(
        async (slug: string) => getSimilarEventsBySlug(slug),
        ['similar-events'],
        { tags: ['events'] }
    );

    const similarEvents = await getCachedSimilarEvents(params.slug);

    return (
        <main>
            <EventDetails event={event} similarEvents={similarEvents} />
        </main>
    );
}