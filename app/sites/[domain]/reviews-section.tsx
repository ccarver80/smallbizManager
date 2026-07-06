"use client";

import { useActionState, useState } from "react";
import { Button, Card, Chip, Input, Label, TextArea, TextField, Typography } from "@heroui/react";
import { submitReview, type ReviewState } from "./actions";
import type { Review } from "@/lib/generated/prisma/client";

function StarRatingInput({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      <input type="hidden" name="rating" value={rating} />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          className="text-2xl text-warning outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {(hovered || rating) >= star ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection({
  businessId,
  subdomain,
  reviews,
}: {
  businessId: string;
  subdomain: string;
  reviews: Review[];
}) {
  const action = submitReview.bind(null, businessId, subdomain);
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(
    action,
    undefined,
  );
  const [rating, setRating] = useState(0);
  const [formKey, setFormKey] = useState(0);

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setRating(0);
      setFormKey((key) => key + 1);
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  return (
    <section id="reviews" className="border-t border-border py-20">
      <div className="mx-auto w-full max-w-4xl px-6">
        <Typography.Heading level={2} className="text-center text-3xl">
          Reviews
        </Typography.Heading>

        {averageRating !== null && (
          <div className="mt-3 flex justify-center">
            <Chip color="warning">
              ★ {averageRating.toFixed(1)} from {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </Chip>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <Card.Content className="flex flex-col gap-2">
                  <span className="text-warning">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <Typography.Paragraph size="sm" className="flex-1 text-muted">
                    &ldquo;{review.body}&rdquo;
                  </Typography.Paragraph>
                </Card.Content>
                <Card.Footer>
                  <span className="text-sm font-medium text-foreground">
                    {review.authorName}
                  </span>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-12">
          <Card.Header>
            <Card.Title>Leave a review</Card.Title>
          </Card.Header>
          <Card.Content>
            <form key={formKey} action={formAction} className="flex flex-col gap-4">
              <TextField name="authorName" isRequired>
                <Label>Your name</Label>
                <Input placeholder="Jane D." />
                {state?.errors?.authorName && (
                  <p className="mt-1.5 text-xs text-danger">
                    {state.errors.authorName[0]}
                  </p>
                )}
              </TextField>

              <div className="flex flex-col gap-1.5">
                <Label>Rating</Label>
                <StarRatingInput rating={rating} onChange={setRating} />
                {state?.errors?.rating && (
                  <p className="text-xs text-danger">{state.errors.rating[0]}</p>
                )}
              </div>

              <TextField name="body" isRequired>
                <Label>Review</Label>
                <TextArea rows={4} placeholder="Share your experience…" />
                {state?.errors?.body && (
                  <p className="mt-1.5 text-xs text-danger">{state.errors.body[0]}</p>
                )}
              </TextField>

              <div className="flex items-center gap-3">
                <Button type="submit" isDisabled={pending}>
                  {pending ? "Submitting…" : "Submit review"}
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
