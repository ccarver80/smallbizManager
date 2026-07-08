import { Typography } from "@heroui/react";

type BusinessEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
};

export function EventSection({ events }: { events: BusinessEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section id="events" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-3xl px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Upcoming Events
        </Typography.Heading>
        <ul className="mt-10 flex flex-col gap-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-2 rounded-xl border border-border p-6"
            >
              <p className="text-lg font-semibold text-foreground">{event.title}</p>
              <p className="text-sm text-muted">
                {event.startsAt.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {event.startsAt.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                }) !== "12:00 AM" && (
                  <>
                    {" "}
                    at{" "}
                    {event.startsAt.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </>
                )}
                {event.endsAt && (
                  <>
                    {" — "}
                    {event.endsAt.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                    })}
                  </>
                )}
              </p>
              {event.location && (
                <p className="text-sm text-muted">📍 {event.location}</p>
              )}
              {event.description && (
                <p className="mt-1 text-sm text-muted">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
