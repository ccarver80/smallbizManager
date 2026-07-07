"use client";

import { useActionState, useState } from "react";
import { Button, Card, Modal, useOverlayState } from "@heroui/react";
import { createOrder, type CreateOrderState } from "./order-actions";
import { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Product } from "@/lib/generated/prisma/client";

type ProductSummary = Omit<Product, "price"> & { price: number | null };

const CHECKOUT_FORM_ID = "checkout-form";

const fieldClassName =
  "h-10 rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none focus:border-accent";

export function AddOrderForm({ products }: { products: ProductSummary[] }) {
  const [state, formAction, pending] = useActionState<CreateOrderState, FormData>(
    createOrder,
    undefined,
  );
  const [cart, setCart] = useState<Record<string, number>>({});
  const [formKey, setFormKey] = useState(0);
  const overlay = useOverlayState();

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setCart({});
      setFormKey((key) => key + 1);
      overlay.close();
    }
  }

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }

  function incrementItem(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }

  function decrementItem(productId: string) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) - 1;
      if (nextQuantity <= 0) {
        const { [productId]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [productId]: nextQuantity };
    });
  }

  function removeFromCart(productId: string) {
    setCart((current) => {
      const { [productId]: _removed, ...rest } = current;
      return rest;
    });
  }

  const cartEntries = Object.entries(cart)
    .map(([productId, quantity]) => ({
      product: products.find((product) => product.id === productId),
      quantity,
    }))
    .filter((entry) => entry.product);

  const total = cartEntries.reduce(
    (sum, entry) => sum + (entry.product?.price ?? 0) * entry.quantity,
    0,
  );
  const hasUnpricedItems = cartEntries.some((entry) => entry.product?.price == null);

  if (products.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Add an order</Card.Title>
          <Card.Description>Quickly ring up a customer in person.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-muted">
            Add a product first so you have something to ring up.
          </p>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Add an order</Card.Title>
        <Card.Description>Quickly ring up a customer in person.</Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <form key={formKey} id={CHECKOUT_FORM_ID} action={formAction}>
          {cartEntries.map((entry) => (
            <span key={entry.product!.id}>
              <input type="hidden" name="productId[]" value={entry.product!.id} />
              <input type="hidden" name="quantity[]" value={entry.quantity} />
            </span>
          ))}
        </form>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Tap to add</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product.id)}
                className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 text-center transition-colors hover:bg-surface-secondary active:bg-surface-tertiary"
              >
                <span className="text-sm font-medium text-foreground">{product.title}</span>
                {product.price != null && (
                  <span className="text-xs text-muted">
                    ${product.price.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border p-3">
          <p className="mb-2 text-sm font-medium text-foreground">Cart</p>
          {cartEntries.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {cartEntries.map((entry) => (
                <li
                  key={entry.product!.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="text-foreground">{entry.product!.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrementItem(entry.product!.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted hover:bg-surface-secondary"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-foreground">{entry.quantity}</span>
                    <button
                      type="button"
                      onClick={() => incrementItem(entry.product!.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted hover:bg-surface-secondary"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(entry.product!.id)}
                      className="text-xs text-danger"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Tap a product above to add it to the cart.</p>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-medium">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">
              $
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {hasUnpricedItems && "+"}
            </span>
          </div>
        </div>

        {state?.errors?.items && <p className="text-xs text-danger">{state.errors.items[0]}</p>}
        {!state?.success && state?.message && (
          <p className="text-sm text-danger">{state.message}</p>
        )}

        <Button
          type="button"
          isDisabled={cartEntries.length === 0}
          onPress={overlay.open}
          className="self-start"
        >
          Checkout
        </Button>
      </Card.Content>

      <Modal state={overlay}>
        <Modal.Backdrop variant="opaque">
          <Modal.Container size="sm" placement="center">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Checkout</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body key={formKey} className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg bg-surface-secondary px-3 py-2 text-sm font-medium">
                  <span className="text-muted">Total</span>
                  <span className="text-foreground">
                    $
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {hasUnpricedItems && "+"}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="customerName" className="text-sm text-foreground">
                    Customer name (optional)
                  </label>
                  <input
                    id="customerName"
                    form={CHECKOUT_FORM_ID}
                    name="customerName"
                    placeholder="Walk-in Customer"
                    className={fieldClassName}
                  />
                  {state?.errors?.customerName && (
                    <p className="text-xs text-danger">{state.errors.customerName[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="customerEmail" className="text-sm text-foreground">
                    Email (optional)
                  </label>
                  <input
                    id="customerEmail"
                    form={CHECKOUT_FORM_ID}
                    name="customerEmail"
                    type="email"
                    placeholder="you@example.com"
                    className={fieldClassName}
                  />
                  {state?.errors?.customerEmail && (
                    <p className="text-xs text-danger">{state.errors.customerEmail[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="customerPhone" className="text-sm text-foreground">
                    Phone (optional)
                  </label>
                  <input
                    id="customerPhone"
                    form={CHECKOUT_FORM_ID}
                    name="customerPhone"
                    placeholder="+1 (555) 019-2288"
                    className={fieldClassName}
                  />
                  {state?.errors?.customerPhone && (
                    <p className="text-xs text-danger">{state.errors.customerPhone[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes" className="text-sm text-foreground">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    form={CHECKOUT_FORM_ID}
                    name="notes"
                    rows={2}
                    placeholder="Anything worth noting?"
                    className={fieldClassName}
                  />
                  {state?.errors?.notes && (
                    <p className="text-xs text-danger">{state.errors.notes[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="status" className="text-sm text-foreground">
                    Status
                  </label>
                  <select
                    id="status"
                    form={CHECKOUT_FORM_ID}
                    name="status"
                    defaultValue={OrderStatus.NEW}
                    className={fieldClassName}
                  >
                    <option value={OrderStatus.NEW}>New</option>
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.FINISHED}>Finished</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    form={CHECKOUT_FORM_ID}
                    type="checkbox"
                    name="paid"
                    className="h-4 w-4"
                  />
                  Paid
                </label>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" form={CHECKOUT_FORM_ID} isDisabled={pending}>
                  {pending ? "Completing…" : "Complete order"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </Card>
  );
}
