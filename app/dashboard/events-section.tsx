"use client";

import { useActionState } from "react";
import { Button, Card, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { createEvent, deleteEvent, type EventState } from "./event-actions";

type BusinessEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
};

export function EventsSection({ events }: { events: BusinessEvent[] }) {
  const [state, action, pending] = useActionState<EventState, FormData>(createEvent, undefined);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header>
          <Card.Title>Upcoming events</Card.Title>
          <Card.Description>
            Add vendor shows, craft fairs, pop-ups, or any other events you want customers to know about.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {events.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border p-4 text-sm"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted">
                      {event.startsAt.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {event.location && <p className="text-xs text-muted">📍 {event.location}</p>}
                    {event.description && <p className="text-xs text-muted">{event.description}</p>}
                  </div>
                  <form
                    action={async () => {
                      await deleteEvent(event.id);
                    }}
                  >
                    <Button type="submit" variant="outline" size="sm" className="border-danger text-danger hover:bg-danger/10">
                      Remove
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <Typography.Paragraph size="sm" className="py-4 text-center text-muted">
              No upcoming events yet
            </Typography.Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Add an event</Card.Title>
        </Card.Header>
        <Card.Content>
          <form action={action} className="flex flex-col gap-4">
            <TextField name="title" isRequired>
              <Label>Event name</Label>
              <Input placeholder="Springfield Craft Fair" />
              {state?.errors?.title && (
                <p className="mt-1 text-xs text-danger">{state.errors.title[0]}</p>
              )}
            </TextField>

            <TextField name="location">
              <Label>Location</Label>
              <Input placeholder="Downtown Convention Center, Springfield, IL" />
              {state?.errors?.location && (
                <p className="mt-1 text-xs text-danger">{state.errors.location[0]}</p>
              )}
            </TextField>

            <div className="grid grid-cols-2 gap-4">
              <TextField name="startsAt" isRequired>
                <Label>Start date &amp; time</Label>
                <Input type="datetime-local" />
                {state?.errors?.startsAt && (
                  <p className="mt-1 text-xs text-danger">{state.errors.startsAt[0]}</p>
                )}
              </TextField>

              <TextField name="endsAt">
                <Label>End date &amp; time (optional)</Label>
                <Input type="datetime-local" />
                {state?.errors?.endsAt && (
                  <p className="mt-1 text-xs text-danger">{state.errors.endsAt[0]}</p>
                )}
              </TextField>
            </div>

            <TextField name="description">
              <Label>Description (optional)</Label>
              <TextArea rows={2} placeholder="Come find us at booth 14!" />
              {state?.errors?.description && (
                <p className="mt-1 text-xs text-danger">{state.errors.description[0]}</p>
              )}
            </TextField>

            <div className="flex items-center gap-3">
              <Button type="submit" isDisabled={pending}>
                {pending ? "Adding…" : "Add event"}
              </Button>
              {state?.success && (
                <span className="text-sm text-success">{state.message}</span>
              )}
              {!state?.success && state?.message && (
                <span className="text-sm text-danger">{state.message}</span>
              )}
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
