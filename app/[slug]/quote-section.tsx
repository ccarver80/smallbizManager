"use client";

import { useActionState, useState } from "react";
import { Button, Card, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { requestQuote, type QuoteState } from "./actions";

export function QuoteSection({
  businessId,
  slug,
}: {
  businessId: string;
  slug: string;
}) {
  const action = requestQuote.bind(null, businessId, slug);
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(
    action,
    undefined,
  );
  const [formKey, setFormKey] = useState(0);

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setFormKey((key) => key + 1);
    }
  }

  return (
    <section id="quote" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-lg px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Request a quote
        </Typography.Heading>
        <Typography.Paragraph className="mt-2 text-center text-muted">
          Describe what you need and we&apos;ll get back to you with a price.
        </Typography.Paragraph>

        <Card className="mt-8">
          <Card.Content>
            <form key={formKey} action={formAction} className="flex flex-col gap-4">
              <TextField name="customerName" isRequired>
                <Label>Your name</Label>
                <Input placeholder="Jane D." />
                {state?.errors?.customerName && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.customerName[0]}
                  </p>
                )}
              </TextField>

              <TextField name="customerEmail" type="email" isRequired>
                <Label>Email</Label>
                <Input placeholder="you@example.com" />
                {state?.errors?.customerEmail && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.customerEmail[0]}
                  </p>
                )}
              </TextField>

              <TextField name="customerPhone">
                <Label>Phone (optional)</Label>
                <Input placeholder="+1 (555) 019-2288" />
                {state?.errors?.customerPhone && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.customerPhone[0]}
                  </p>
                )}
              </TextField>

              <TextField name="description" isRequired>
                <Label>What do you need done?</Label>
                <TextArea rows={4} placeholder="Describe the job or service you're looking for…" />
                {state?.errors?.description && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.description[0]}
                  </p>
                )}
              </TextField>

              <TextField name="serviceAddress">
                <Label>Service address (optional)</Label>
                <Input placeholder="123 Main St, Springfield, IL" />
                {state?.errors?.serviceAddress && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.serviceAddress[0]}
                  </p>
                )}
              </TextField>

              <TextField name="timeline">
                <Label>Preferred timeline (optional)</Label>
                <Input placeholder="e.g. ASAP, within 2 weeks, flexible…" />
                {state?.errors?.timeline && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.timeline[0]}
                  </p>
                )}
              </TextField>

              <TextField name="notes">
                <Label>Anything else? (optional)</Label>
                <TextArea rows={2} placeholder="Additional details, access instructions, etc." />
                {state?.errors?.notes && (
                  <p className="mt-1.5 text-xs text-danger">{state.errors.notes[0]}</p>
                )}
              </TextField>

              <div className="flex items-center gap-3">
                <Button type="submit" isDisabled={pending}>
                  {pending ? "Sending…" : "Request quote"}
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
    </section>
  );
}
