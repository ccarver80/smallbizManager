"use client";

import { useActionState, useState } from "react";
import { Button, Card, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { requestOrder, type OrderState } from "./actions";
import type { Product } from "@/lib/generated/prisma/client";

export function OrderSection({
  businessId,
  subdomain,
  products,
}: {
  businessId: string;
  subdomain: string;
  products: Product[];
}) {
  const action = requestOrder.bind(null, businessId, subdomain);
  const [state, formAction, pending] = useActionState<OrderState, FormData>(
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
    <section id="order" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-lg px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Request an order
        </Typography.Heading>
        <Typography.Paragraph className="mt-2 text-center text-muted">
          Let us know what you&apos;d like and we&apos;ll follow up to confirm.
        </Typography.Paragraph>

        <Card className="mt-8">
          <Card.Content>
            <form key={formKey} action={formAction} className="flex flex-col gap-4">
              {products.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="productId">Product (optional)</Label>
                  <select
                    id="productId"
                    name="productId"
                    defaultValue=""
                    className="h-10 rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none focus:border-accent"
                  >
                    <option value="">Something else / custom request</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                        {product.price != null
                          ? ` — $${Number(product.price).toLocaleString()}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="h-10 rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none focus:border-accent"
                />
                {state?.errors?.quantity && (
                  <p className="text-xs text-danger">{state.errors.quantity[0]}</p>
                )}
              </div>

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

              <TextField name="notes">
                <Label>Notes (optional)</Label>
                <TextArea rows={3} placeholder="Anything else we should know?" />
                {state?.errors?.notes && (
                  <p className="mt-1.5 text-xs text-danger">{state.errors.notes[0]}</p>
                )}
              </TextField>

              <div className="flex items-center gap-3">
                <Button type="submit" isDisabled={pending}>
                  {pending ? "Sending…" : "Request order"}
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
