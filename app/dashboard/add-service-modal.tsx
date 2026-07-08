"use client";

import { useActionState, useEffect } from "react";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { updateServices, type UpdateServicesState } from "./actions";

const SERVICES = [
  {
    name: "appointment_service" as const,
    label: "Appointments",
    description: "Let customers book a time with you",
    icon: "🗓️",
  },
  {
    name: "quote_service" as const,
    label: "Quote requests",
    description: "Customers describe a job and you send a price",
    icon: "📋",
  },
  {
    name: "product_service" as const,
    label: "Products & orders",
    description: "Sell products and accept online orders",
    icon: "🛍️",
  },
  {
    name: "message_service" as const,
    label: "Messages",
    description: "Let customers send you a direct message",
    icon: "💬",
  },
  {
    name: "event_service" as const,
    label: "Events",
    description: "Promote vendor shows, craft fairs, and pop-ups",
    icon: "📍",
  },
  {
    name: "gallery_service" as const,
    label: "Photo Gallery",
    description: "Show a browsable photo gallery on your page",
    icon: "🖼️",
  },
];

type ServiceKey =
  | "appointment_service"
  | "quote_service"
  | "product_service"
  | "message_service"
  | "event_service"
  | "gallery_service";

export function AddServiceModal({
  services,
}: {
  services: Record<ServiceKey, boolean>;
}) {
  const overlay = useOverlayState();
  const [state, action, pending] = useActionState<UpdateServicesState, FormData>(
    updateServices,
    undefined,
  );

  useEffect(() => {
    if (state?.success) overlay.close();
  }, [state?.success]);

  return (
    <>
      <Button size="sm" variant="outline" onPress={overlay.open}>
        + Add service
      </Button>

      <Modal state={overlay}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Manage services</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>

              <Modal.Body>
                <p className="mb-4 text-sm text-muted">
                  Enable the features you want on your public page. Changes take effect immediately.
                </p>
                <form id="services-form" action={action} className="flex flex-col gap-2">
                  {SERVICES.map((service) => (
                    <label
                      key={service.name}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors has-checked:border-foreground has-checked:bg-surface-secondary"
                    >
                      <input
                        type="checkbox"
                        name={service.name}
                        defaultChecked={services[service.name]}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="flex flex-1 items-start gap-2">
                        <span className="text-base leading-none">{service.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{service.label}</p>
                          <p className="text-xs text-muted">{service.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="outline" onPress={overlay.close} isDisabled={pending}>
                  Cancel
                </Button>
                <Button type="submit" form="services-form" isDisabled={pending}>
                  {pending ? "Saving…" : "Save"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
