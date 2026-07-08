"use client";

import { useActionState, useState } from "react";
import { Button, Card, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { sendMessage, type MessageState } from "./actions";

export function MessageSection({
  businessId,
  slug,
  businessName,
}: {
  businessId: string;
  slug: string;
  businessName: string;
}) {
  const action = sendMessage.bind(null, businessId, slug);
  const [state, formAction, pending] = useActionState<MessageState, FormData>(
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
    <section id="message" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-lg px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Send a message
        </Typography.Heading>
        <Typography.Paragraph className="mt-2 text-center text-muted">
          Have a question for {businessName}? Send them a message directly.
        </Typography.Paragraph>

        <Card className="mt-8">
          <Card.Content>
            <form key={formKey} action={formAction} className="flex flex-col gap-4">
              <TextField name="contact_email" type="email" isRequired>
                <Label>Your email</Label>
                <Input placeholder="you@example.com" />
                {state?.errors?.contact_email && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.contact_email[0]}
                  </p>
                )}
              </TextField>

              <TextField name="body" isRequired>
                <Label>Message</Label>
                <TextArea rows={4} placeholder="How can they help you?" />
                {state?.errors?.body && (
                  <p className="mt-1.5 text-xs text-danger">{state.errors.body[0]}</p>
                )}
              </TextField>

              <div className="flex items-center gap-3">
                <Button type="submit" isDisabled={pending}>
                  {pending ? "Sending…" : "Send message"}
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
