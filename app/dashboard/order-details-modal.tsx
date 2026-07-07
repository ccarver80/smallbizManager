"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Label,
  Modal,
  Pagination,
  TextArea,
  TextField,
  Typography,
  useOverlayState,
} from "@heroui/react";
import {
  addOrderNote,
  markOrderPaid,
  markOrderUnpaid,
  replyToCustomer,
  updateOrderStatus,
  type OrderNoteState,
  type OrderReplyState,
} from "./order-actions";
import { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Order, OrderItem, OrderNote, Product } from "@/lib/generated/prisma/client";

type ProductSummary = Omit<Product, "price"> & { price: number | null };

export type OrderWithDetails = Order & {
  items: (OrderItem & { product: ProductSummary | null })[];
  user_notes: OrderNote[];
};

export function OrderDetailsModal({
  order,
  onClose,
}: {
  order: OrderWithDetails | null;
  onClose: () => void;
}) {
  const overlay = useOverlayState({
    isOpen: order !== null,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose();
    },
  });

  return (
    <Modal state={overlay}>
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg" placement="center">
          <Modal.Dialog className="sm:max-w-2xl">
            {order && <OrderDetailsContent key={order.id} order={order} />}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

const COMMENTS_PER_PAGE = 5;

function OrderDetailsContent({ order }: { order: OrderWithDetails }) {
  const router = useRouter();
  const [isMutating, startTransition] = useTransition();

  const action = addOrderNote.bind(null, order.id);
  const [state, formAction, pending] = useActionState<OrderNoteState, FormData>(
    action,
    undefined,
  );
  const [formKey, setFormKey] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setFormKey((key) => key + 1);
      setCommentsPage(1);
    }
  }

  const totalCommentPages = Math.max(
    1,
    Math.ceil(order.user_notes.length / COMMENTS_PER_PAGE),
  );
  const visibleNotes = order.user_notes.slice(
    (commentsPage - 1) * COMMENTS_PER_PAGE,
    commentsPage * COMMENTS_PER_PAGE,
  );

  const replyAction = replyToCustomer.bind(null, order.id);
  const [replyState, replyFormAction, replyPending] = useActionState<
    OrderReplyState,
    FormData
  >(replyAction, undefined);
  const [replyFormKey, setReplyFormKey] = useState(0);

  const [prevReplyState, setPrevReplyState] = useState(replyState);
  if (replyState !== prevReplyState) {
    setPrevReplyState(replyState);
    if (replyState?.success) {
      setReplyFormKey((key) => key + 1);
    }
  }

  function moveOrder(status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatus(order.id, status);
      router.refresh();
    });
  }

  function markPaid() {
    startTransition(async () => {
      await markOrderPaid(order.id);
      router.refresh();
    });
  }

  function markUnpaid() {
    startTransition(async () => {
      await markOrderUnpaid(order.id);
      router.refresh();
    });
  }

  return (
    <>
      <Modal.Header>
        <Modal.Heading>{order.customerName}</Modal.Heading>
        <Modal.CloseTrigger />
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Chip size="sm">
            {order.status === OrderStatus.NEW
              ? "New"
              : order.status === OrderStatus.PENDING
                ? "Pending"
                : "Finished"}
          </Chip>
          {order.paid && (
            <Chip size="sm" color="success">
              Paid
            </Chip>
          )}
        </div>

        <div>
          {order.customerEmail && (
            <p className="text-sm text-muted">{order.customerEmail}</p>
          )}
          {order.customerPhone && <p className="text-sm text-muted">{order.customerPhone}</p>}
        </div>

        <ul className="list-inside list-disc text-sm text-muted">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product?.title ?? "Item"} × {item.quantity}
            </li>
          ))}
        </ul>

        {order.notes && (
          <p className="text-sm text-muted">Request notes: {order.notes}</p>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          {order.status !== OrderStatus.NEW && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={isMutating}
              onPress={() =>
                moveOrder(
                  order.status === OrderStatus.FINISHED
                    ? OrderStatus.PENDING
                    : OrderStatus.NEW,
                )
              }
            >
              {order.status === OrderStatus.FINISHED ? "Move back to Pending" : "Move back to New"}
            </Button>
          )}
          {order.status !== OrderStatus.FINISHED && (
            <Button
              type="button"
              size="sm"
              isDisabled={isMutating}
              onPress={() =>
                moveOrder(
                  order.status === OrderStatus.NEW
                    ? OrderStatus.PENDING
                    : OrderStatus.FINISHED,
                )
              }
            >
              {order.status === OrderStatus.NEW ? "Mark as Pending" : "Mark as Finished"}
            </Button>
          )}
          {order.paid ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={isMutating}
              onPress={markUnpaid}
            >
              Mark as Unpaid
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={isMutating}
              onPress={markPaid}
            >
              Mark as Paid
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Typography.Heading level={4} className="text-sm">
            Reply to customer
          </Typography.Heading>
          {order.customerEmail ? (
            <>
              <Typography.Paragraph size="xs" className="text-muted">
                Sends a message to {order.customerEmail}.
              </Typography.Paragraph>

              <form
                key={replyFormKey}
                action={replyFormAction}
                className="flex flex-col gap-2"
              >
                <TextField name="message" isRequired>
                  <Label>Message</Label>
                  <TextArea rows={3} placeholder="Let them know what's next…" />
                </TextField>
                <div className="flex items-center gap-3">
                  <Button type="submit" size="sm" isDisabled={replyPending}>
                    {replyPending ? "Sending…" : "Send reply"}
                  </Button>
                  {replyState?.success && (
                    <span className="text-sm text-success">{replyState.message}</span>
                  )}
                  {!replyState?.success && replyState?.message && (
                    <span className="text-sm text-danger">{replyState.message}</span>
                  )}
                </div>
              </form>
            </>
          ) : (
            <Typography.Paragraph size="xs" className="text-muted">
              No email on file for this customer.
            </Typography.Paragraph>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Typography.Heading level={4} className="text-sm">
            Comments
          </Typography.Heading>

          {visibleNotes.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {visibleNotes.map((note) => (
                <li key={note.id} className="rounded-lg border border-border p-2 text-sm">
                  <p className="text-foreground">{note.note}</p>
                  <p className="mt-1 text-xs text-muted">
                    {note.createdAt.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <Typography.Paragraph size="sm" className="text-muted">
              No comments yet
            </Typography.Paragraph>
          )}

          {order.user_notes.length > COMMENTS_PER_PAGE && (
            <Pagination size="sm">
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={commentsPage === 1}
                    onPress={() => setCommentsPage((page) => page - 1)}
                  >
                    Previous
                  </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                  <Pagination.Summary>
                    Page {commentsPage} of {totalCommentPages}
                  </Pagination.Summary>
                </Pagination.Item>
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={commentsPage === totalCommentPages}
                    onPress={() => setCommentsPage((page) => page + 1)}
                  >
                    Next
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          )}

          <form key={formKey} action={formAction} className="mt-2 flex flex-col gap-2">
            <TextField name="note" isRequired>
              <Label>Add a comment</Label>
              <TextArea rows={3} placeholder="Internal note about this order…" />
            </TextField>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" isDisabled={pending}>
                {pending ? "Adding…" : "Add comment"}
              </Button>
              {!state?.success && state?.message && (
                <span className="text-sm text-danger">{state.message}</span>
              )}
            </div>
          </form>
        </div>
      </Modal.Body>
    </>
  );
}
