import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// This function fetches all events directly from the database
async function getAllEvents(): Promise<IEvent[]> {
    await connectDB();
    const events = await Event.find({});
    // Mongoose returns documents that need to be converted to plain objects
    return JSON.parse(JSON.stringify(events));
}

const Page = async () => {
    const events = await getAllEvents();

    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event.title} className="list-none">
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default Page;