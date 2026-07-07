"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  EmptyState,
  Fieldset,
  Input,
  Label,
  TextField,
  Typography,
} from "@heroui/react";
import { addCustomer, deleteCustomer, type CustomerState } from "./customer-actions";
import type { Customer } from "@/lib/generated/prisma/client";

export function CustomersSection({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction, isSubmitting] = useActionState<CustomerState, FormData>(
    addCustomer,
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
    <Card>
      <Card.Header>
        <Card.Title>Customers</Card.Title>
        <Card.Description>Keep track of the people you work with.</Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        {customers.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {customers.map((customer) => (
              <li
                key={customer.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {customer.first_name} {customer.last_name}
                  </p>
                  {customer.email && <p className="mt-1 text-muted">{customer.email}</p>}
                  {customer.phone && <p className="text-muted">{customer.phone}</p>}
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  isDisabled={isPending}
                  onPress={() =>
                    startTransition(async () => {
                      await deleteCustomer(customer.id);
                      router.refresh();
                    })
                  }
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState className="flex flex-col items-center gap-2 py-8 text-center">
            <Typography.Paragraph size="sm" className="text-muted">
              No customers yet
            </Typography.Paragraph>
          </EmptyState>
        )}

        <Fieldset key={formKey} className="flex flex-col gap-4 border-t border-border pt-4">
          <Fieldset.Legend>Add a customer</Fieldset.Legend>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField name="first_name" isRequired>
                <Label>First name</Label>
                <Input placeholder="Jane" />
                {state?.errors?.first_name && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.first_name[0]}
                  </p>
                )}
              </TextField>

              <TextField name="last_name" isRequired>
                <Label>Last name</Label>
                <Input placeholder="Doe" />
                {state?.errors?.last_name && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.last_name[0]}
                  </p>
                )}
              </TextField>
            </div>

            <TextField name="email" type="email">
              <Label>Email (optional)</Label>
              <Input placeholder="jane@example.com" />
              {state?.errors?.email && (
                <p className="mt-1.5 text-xs text-danger">{state.errors.email[0]}</p>
              )}
            </TextField>

            <TextField name="phone">
              <Label>Phone (optional)</Label>
              <Input placeholder="+1 (555) 019-2288" />
              {state?.errors?.phone && (
                <p className="mt-1.5 text-xs text-danger">{state.errors.phone[0]}</p>
              )}
            </TextField>

            <div className="flex items-center gap-3">
              <Button type="submit" isDisabled={isSubmitting}>
                {isSubmitting ? "Adding…" : "Add customer"}
              </Button>
              {state?.message && <span className="text-sm text-danger">{state.message}</span>}
            </div>
          </form>
        </Fieldset>
      </Card.Content>
    </Card>
  );
}
