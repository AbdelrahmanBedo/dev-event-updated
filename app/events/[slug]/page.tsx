import { notFound } from 'next/navigation';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';

// This function fetches a single event by its slug directly from the database
async function getEvent(slug: string): Promise<IEvent | null> {
    await connectDB();
    const event = await Event.findOne({ slug });
    if (!event) return null;
    // Mongoose returns a document that needs to be converted to a plain object
    return JSON.parse(JSON.stringify(event));
}

// This is the main page component
export default async function EventDetailsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = await paramsPromise;
    const event = await getEvent(params.slug);

    // If no event is found, render the 404 page
    if (!event) {
        notFound();
    }

    return (
        <main id="event">
            <div className="header">
                <h1>{event.title}</h1>
                <p className="p-regular-20 md:p-regular-24">{event.overview}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={800}
                        height={500}
                        className="banner"
                    />
                    <div className="agenda">
                        <h2>Agenda</h2>
                        <ul>
                            {event.agenda.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="booking">
                    <div className="signup-card">
                        <h3>Book This Event</h3>
                        {/* Booking form will go here */}
                    </div>
                </div>
            </div>
        </main>
    );
}