"use client";

import { useActionState } from "react";
import {
  Button,
  Fieldset,
  Input,
  InputGroup,
  Label,
  Radio,
  RadioGroup,
  TextArea,
  TextField,
} from "@heroui/react";
import { updateBusiness, type UpdateBusinessState } from "./actions";
import type { Business } from "@/lib/generated/prisma/client";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "mydomain.com";

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
            <Label htmlFor="subdomain">Domain</Label>
            <InputGroup>
              <InputGroup.Input
                id="subdomain"
                name="subdomain"
                defaultValue={business.subdomain}
              />
              <InputGroup.Suffix>.{ROOT_DOMAIN}</InputGroup.Suffix>
            </InputGroup>
            {state?.errors?.subdomain && (
              <p className="text-xs text-danger">{state.errors.subdomain[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Business type</Label>
            <RadioGroup name="businessType" defaultValue={business.businessType}>
              <Radio value="SERVICE">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Service — appointments &amp; bookings
                </Radio.Content>
              </Radio>
              <Radio value="PRODUCT">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Product — orders &amp; custom requests
                </Radio.Content>
              </Radio>
            </RadioGroup>
            {state?.errors?.businessType && (
              <p className="text-xs text-danger">{state.errors.businessType[0]}</p>
            )}
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
