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
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";
import { UploadButton } from "@/lib/uploadthing";
import { addProduct, deleteProduct, type ProductState } from "./product-actions";
import type { Product } from "@/lib/generated/prisma/client";

type ProductSummary = Omit<Product, "price"> & { price: number | null };

export function ProductsSection({ products }: { products: ProductSummary[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction, isSubmitting] = useActionState<ProductState, FormData>(
    addProduct,
    undefined,
  );
  const [formKey, setFormKey] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setFormKey((key) => key + 1);
      setImageUrl(null);
    }
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Products</Card.Title>
        <Card.Description>Add the products you sell.</Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm"
              >
                {product.imageUrl && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.title}</p>
                  {product.description && (
                    <p className="mt-1 text-muted">{product.description}</p>
                  )}
                  {product.price != null && (
                    <p className="mt-1 font-medium text-foreground">
                      ${Number(product.price).toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  isDisabled={isPending}
                  onPress={() =>
                    startTransition(async () => {
                      await deleteProduct(product.id);
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
              No products yet
            </Typography.Paragraph>
          </EmptyState>
        )}

        <Fieldset key={formKey} className="flex flex-col gap-4 border-t border-border pt-4">
          <Fieldset.Legend>Add a product</Fieldset.Legend>
          <form action={formAction} className="flex flex-col gap-4">
            <TextField name="title" isRequired>
              <Label>Title</Label>
              <Input placeholder="Speckled Stoneware Mug" />
              {state?.errors?.title && (
                <p className="mt-1.5 text-xs text-danger">{state.errors.title[0]}</p>
              )}
            </TextField>

            <TextField name="description">
              <Label>Description</Label>
              <TextArea rows={2} placeholder="12oz mug in a warm speckled glaze." />
              {state?.errors?.description && (
                <p className="mt-1.5 text-xs text-danger">
                  {state.errors.description[0]}
                </p>
              )}
            </TextField>

            <TextField name="price">
              <Label>Price (optional)</Label>
              <Input placeholder="28.00" inputMode="decimal" />
              {state?.errors?.price && (
                <p className="mt-1.5 text-xs text-danger">{state.errors.price[0]}</p>
              )}
            </TextField>

            <div className="flex flex-col gap-1.5">
              <Label>Photo (optional)</Label>
              <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
              {imageUrl ? (
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onPress={() => setImageUrl(null)}
                  >
                    Remove photo
                  </Button>
                </div>
              ) : (
                <UploadButton
                  endpoint="productPhoto"
                  onClientUploadComplete={(res) => setImageUrl(res[0]?.ufsUrl ?? null)}
                  onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" isDisabled={isSubmitting}>
                {isSubmitting ? "Adding…" : "Add product"}
              </Button>
              {state?.message && <span className="text-sm text-danger">{state.message}</span>}
            </div>
          </form>
        </Fieldset>
      </Card.Content>
    </Card>
  );
}
