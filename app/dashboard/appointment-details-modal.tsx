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
  addAppointmentNote,
  updateAppointmentStatus,
  type AppointmentNoteState,
} from "./appointment-actions";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import type { Appointment, AppointmentNote } from "@/lib/generated/prisma/client";

export type AppointmentWithDetails = Appointment & {
  user_notes: AppointmentNote[];
};

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.NEW]: "New",
  [AppointmentStatus.ACCEPTED]: "Accepted",
  [AppointmentStatus.FINISHED]: "Finished",
};

export function AppointmentDetailsModal({
  appointment,
  onClose,
}: {
  appointment: AppointmentWithDetails | null;
  onClose: () => void;
}) {
  const overlay = useOverlayState({
    isOpen: appointment !== null,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose();
    },
  });

  return (
    <Modal state={overlay}>
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg" placement="center">
          <Modal.Dialog className="sm:max-w-2xl">
            {appointment && (
              <AppointmentDetailsContent key={appointment.id} appointment={appointment} />
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

const COMMENTS_PER_PAGE = 5;

function AppointmentDetailsContent({
  appointment,
}: {
  appointment: AppointmentWithDetails;
}) {
  const router = useRouter();
  const [isMutating, startTransition] = useTransition();

  const action = addAppointmentNote.bind(null, appointment.id);
  const [state, formAction, pending] = useActionState<AppointmentNoteState, FormData>(
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
    Math.ceil(appointment.user_notes.length / COMMENTS_PER_PAGE),
  );
  const visibleNotes = appointment.user_notes.slice(
    (commentsPage - 1) * COMMENTS_PER_PAGE,
    commentsPage * COMMENTS_PER_PAGE,
  );

  function moveAppointment(status: AppointmentStatus) {
    startTransition(async () => {
      await updateAppointmentStatus(appointment.id, status);
      router.refresh();
    });
  }

  return (
    <>
      <Modal.Header>
        <Modal.Heading>{appointment.customerName}</Modal.Heading>
        <Modal.CloseTrigger />
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Chip size="sm">{statusLabels[appointment.status]}</Chip>
        </div>

        <div>
          <p className="text-sm text-muted">{appointment.customerEmail}</p>
          {appointment.customerPhone && (
            <p className="text-sm text-muted">{appointment.customerPhone}</p>
          )}
        </div>

        <p className="text-sm text-muted">
          Requested for{" "}
          {appointment.requestedAt.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>

        {appointment.notes && (
          <p className="text-sm text-muted">Request notes: {appointment.notes}</p>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          {appointment.status !== AppointmentStatus.NEW && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={isMutating}
              onPress={() =>
                moveAppointment(
                  appointment.status === AppointmentStatus.FINISHED
                    ? AppointmentStatus.ACCEPTED
                    : AppointmentStatus.NEW,
                )
              }
            >
              {appointment.status === AppointmentStatus.FINISHED
                ? "Move back to Accepted"
                : "Move back to New"}
            </Button>
          )}
          {appointment.status !== AppointmentStatus.FINISHED && (
            <Button
              type="button"
              size="sm"
              isDisabled={isMutating}
              onPress={() =>
                moveAppointment(
                  appointment.status === AppointmentStatus.NEW
                    ? AppointmentStatus.ACCEPTED
                    : AppointmentStatus.FINISHED,
                )
              }
            >
              {appointment.status === AppointmentStatus.NEW
                ? "Mark as Accepted"
                : "Mark as Finished"}
            </Button>
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

          {appointment.user_notes.length > COMMENTS_PER_PAGE && (
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
              <TextArea rows={3} placeholder="Internal note about this appointment…" />
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
