"use client";

import { useActionState } from "react";
import {
  Button,
  Fieldset,
  Input,
  InputGroup,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import { updateBusiness, type UpdateBusinessState } from "./actions";
import type { Business } from "@/lib/generated/prisma/client";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "mybiz.host";

export function EditBusinessForm({ business }: { business: Business }) {
  const [state, action, pending] = useActionState<UpdateBusinessState, FormData>(
    updateBusiness,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      <Fieldset className="flex flex-col gap-5">
        <Fieldset.Legend>Business info</Fieldset.Legend>
        <Fieldset.Group className="flex flex-col gap-5">
          <TextField name="name" defaultValue={business.name} isRequired>
            <Label>Business name</Label>
            <Input />
            {state?.errors?.name && (
              <p className="mt-1.5 text-xs text-danger">{state.errors.name[0]}</p>
            )}
          </TextField>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Your URL</Label>
            <InputGroup>
              <InputGroup.Prefix>{ROOT_DOMAIN}/</InputGroup.Prefix>
              <InputGroup.Input
                id="slug"
                name="slug"
                defaultValue={business.slug}
              />
            </InputGroup>
            {state?.errors?.slug && (
              <p className="text-xs text-danger">{state.errors.slug[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Services</Label>
            <p className="text-xs text-muted">Enable the features you want on your page. You can change these anytime.</p>
            <div className="mt-1 flex flex-col gap-2">
              {([
                { name: "appointment_service", defaultChecked: business.appointment_service, label: "Appointments", description: "Customers can book a time with you" },
                { name: "quote_service", defaultChecked: business.quote_service, label: "Quote requests", description: "Customers describe a job and you send a price" },
                { name: "product_service", defaultChecked: business.product_service, label: "Products & orders", description: "Customers browse and order what you sell" },
                { name: "message_service", defaultChecked: business.message_service, label: "Messages", description: "Customers can send you a direct message" },
                { name: "event_service", defaultChecked: business.event_service, label: "Events", description: "Promote upcoming vendor shows, craft fairs, and more" },
              ] as const).map((service) => (
                <label
                  key={service.name}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-checked:border-foreground"
                >
                  <input
                    type="checkbox"
                    name={service.name}
                    defaultChecked={service.defaultChecked}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">{service.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{service.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <TextField name="tagline" defaultValue={business.tagline ?? ""}>
            <Label>Tagline</Label>
            <Input placeholder="Timeless portraits, real moments." />
            {state?.errors?.tagline && (
              <p className="mt-1.5 text-xs text-danger">{state.errors.tagline[0]}</p>
            )}
          </TextField>

          <TextField name="aboutText" defaultValue={business.aboutText ?? ""}>
            <Label>About</Label>
            <TextArea rows={4} placeholder="Tell customers about your business." />
            {state?.errors?.aboutText && (
              <p className="mt-1.5 text-xs text-danger">{state.errors.aboutText[0]}</p>
            )}
          </TextField>

          <TextField
            name="contactEmail"
            type="email"
            defaultValue={business.contactEmail ?? ""}
          >
            <Label>Contact email</Label>
            <Input placeholder="hello@example.com" />
            {state?.errors?.contactEmail && (
              <p className="mt-1.5 text-xs text-danger">{state.errors.contactEmail[0]}</p>
            )}
          </TextField>

          <TextField name="contactPhone" defaultValue={business.contactPhone ?? ""}>
            <Label>Contact phone</Label>
            <Input placeholder="+1 (555) 019-2288" />
            {state?.errors?.contactPhone && (
              <p className="mt-1.5 text-xs text-danger">{state.errors.contactPhone[0]}</p>
            )}
          </TextField>

          <TextField name="address" defaultValue={business.address ?? ""}>
            <Label>Address</Label>
            <Input placeholder="Springfield, IL" />
            {state?.errors?.address && (
              <p className="mt-1.5 text-xs text-danger">{state.errors.address[0]}</p>
            )}
          </TextField>
        </Fieldset.Group>

        <Fieldset.Actions className="flex items-center gap-3">
          <Button type="submit" isDisabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
          {state?.success && <span className="text-sm text-success">{state.message}</span>}
          {!state?.success && state?.message && (
            <span className="text-sm text-danger">{state.message}</span>
          )}
        </Fieldset.Actions>
      </Fieldset>
    </form>
  );
}
