"use client";

import { useActionState, useRef, useState } from "react";
import {
  Button,
  Card,
  Input,
  Label,
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";
import { requestOrder, type OrderState } from "./actions";
import type { Product } from "@/lib/generated/prisma/client";

const fieldClassName =
  "h-10 rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none focus:border-accent";

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
  const [rowIds, setRowIds] = useState<number[]>([0]);
  const nextRowId = useRef(1);

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setFormKey((key) => key + 1);
      setRowIds([0]);
    }
  }

  return (
    <section id="order" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-lg px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Request an order
        </Typography.Heading>
        <Typography.Paragraph className="mt-2 text-center text-muted">
          Let us know what you&apos;d like — add as many items as you need.
        </Typography.Paragraph>

        <Card className="mt-8">
          <Card.Content>
            <form
              key={formKey}
              action={formAction}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-3">
                <Label>Items</Label>
                {rowIds.map((rowId) => (
                  <div
                    key={rowId}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-end"
                  >
                    {products.length > 0 && (
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Label
                          htmlFor={`productId-${rowId}`}
                          className="text-xs"
                        >
                          Product
                        </Label>
                        <select
                          id={`productId-${rowId}`}
                          name="productId[]"
                          defaultValue=""
                          className={fieldClassName}
                        >
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

                    {/* <div className="flex flex-1 flex-col gap-1.5">
                      <Label htmlFor={`description-${rowId}`} className="text-xs">
                        {products.length > 0 ? "Description (if custom)" : "Description"}
                      </Label>
                      <input
                        id={`description-${rowId}`}
                        name="description[]"
                        placeholder="Custom item description"
                        className={fieldClassName}
                      />
                    </div> */}

                    <div className="flex w-full flex-col gap-1.5 sm:w-20">
                      <Label htmlFor={`quantity-${rowId}`} className="text-xs">
                        Qty
                      </Label>
                      <input
                        id={`quantity-${rowId}`}
                        name="quantity[]"
                        type="number"
                        min={1}
                        defaultValue={1}
                        className={fieldClassName}
                      />
                    </div>

                    {rowIds.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onPress={() =>
                          setRowIds((ids) => ids.filter((id) => id !== rowId))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onPress={() =>
                    setRowIds((ids) => [...ids, nextRowId.current++])
                  }
                >
                  + Add another item
                </Button>

                {state?.errors?.items && (
                  <p className="text-xs text-danger">{state.errors.items[0]}</p>
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
                <TextArea
                  rows={3}
                  placeholder="Anything else we should know?"
                />
                {state?.errors?.notes && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.notes[0]}
                  </p>
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
