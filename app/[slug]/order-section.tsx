"use client";

import { useActionState, useRef, useState } from "react";
import {
  Button,
  Card,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  Typography,
  useOverlayState,
} from "@heroui/react";
import { requestOrder, type OrderState } from "./actions";
import type { Product } from "@/lib/generated/prisma/client";

type ProductSummary = Omit<Product, "price"> & { price: number | null };
type RowValue = { productId: string; quantity: number };

const fieldClassName =
  "h-10 rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none focus:border-accent";

export function OrderSection({
  businessId,
  slug,
  products,
}: {
  businessId: string;
  slug: string;
  products: ProductSummary[];
}) {
  const action = requestOrder.bind(null, businessId, slug);
  const [state, formAction, pending] = useActionState<OrderState, FormData>(
    action,
    undefined,
  );
  const defaultProductId = products[0]?.id ?? "";
  const [formKey, setFormKey] = useState(0);
  const [rowIds, setRowIds] = useState<number[]>([0]);
  const [rowValues, setRowValues] = useState<Record<number, RowValue>>({
    0: { productId: defaultProductId, quantity: 1 },
  });
  const nextRowId = useRef(1);
  const successModal = useOverlayState();

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setFormKey((key) => key + 1);
      setRowIds([0]);
      setRowValues({ 0: { productId: defaultProductId, quantity: 1 } });
      successModal.open();
    }
  }

  function updateRow(rowId: number, patch: Partial<RowValue>) {
    setRowValues((values) => ({
      ...values,
      [rowId]: {
        ...(values[rowId] ?? { productId: defaultProductId, quantity: 1 }),
        ...patch,
      },
    }));
  }

  function removeRow(rowId: number) {
    setRowIds((ids) => ids.filter((id) => id !== rowId));
    setRowValues((values) =>
      Object.fromEntries(Object.entries(values).filter(([key]) => key !== String(rowId))),
    );
  }

  function addRow() {
    const newRowId = nextRowId.current++;
    setRowIds((ids) => [...ids, newRowId]);
    setRowValues((values) => ({
      ...values,
      [newRowId]: { productId: defaultProductId, quantity: 1 },
    }));
  }

  let total = 0;
  let hasUnpricedItems = false;
  for (const rowId of rowIds) {
    const row = rowValues[rowId];
    const product = products.find((p) => p.id === row?.productId);
    if (product?.price != null) {
      total += product.price * (row?.quantity ?? 1);
    } else if (row) {
      hasUnpricedItems = true;
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
            <form key={formKey} action={formAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label>Items</Label>
                {rowIds.map((rowId) => (
                  <div
                    key={rowId}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-end"
                  >
                    {products.length > 0 && (
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor={`productId-${rowId}`} className="text-xs">
                          Product
                        </Label>
                        <select
                          id={`productId-${rowId}`}
                          name="productId[]"
                          defaultValue={defaultProductId}
                          onChange={(event) =>
                            updateRow(rowId, { productId: event.target.value })
                          }
                          className={fieldClassName}
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.title}
                              {product.price != null
                                ? ` — $${product.price.toLocaleString()}`
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

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
                        onChange={(event) =>
                          updateRow(rowId, { quantity: Number(event.target.value) || 1 })
                        }
                        className={fieldClassName}
                      />
                    </div>

                    {rowIds.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onPress={() => removeRow(rowId)}
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
                  onPress={addRow}
                >
                  + Add another item
                </Button>

                {state?.errors?.items && (
                  <p className="text-xs text-danger">{state.errors.items[0]}</p>
                )}

                {products.length > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-surface-secondary px-3 py-2 text-sm">
                    <span className="text-muted">Estimated total</span>
                    <span className="font-medium text-foreground">
                      $
                      {total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {hasUnpricedItems && "+"}
                    </span>
                  </div>
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
                {!state?.success && state?.message && (
                  <span className="text-sm text-danger">{state.message}</span>
                )}
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>

      <Modal state={successModal}>
        <Modal.Backdrop variant="opaque">
          <Modal.Container size="sm" placement="center">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Thank you for your order!</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                <Typography.Paragraph className="text-muted">
                  When it gets looked at, someone will be in touch on the next steps.
                </Typography.Paragraph>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={successModal.close}>Close</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}
