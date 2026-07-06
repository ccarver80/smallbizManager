import Link from "next/link";
import { Card, EmptyState, Typography, buttonVariants } from "@heroui/react";
import { BusinessType } from "@/lib/generated/prisma/enums";
import type {
  Appointment,
  Business,
  Message,
  Order,
  Photo,
  Product,
} from "@/lib/generated/prisma/client";
import { DashboardHeader } from "./dashboard-header";
import { PhotosSection } from "./photos-section";
import { ProductsSection } from "./products-section";

const calendarIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M8 3v3m8-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
  />
);

const clockIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  />
);

const boxIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4 5h16v14H4V5Zm0 5h16M9 20V10"
  />
);

const clipboardIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 3.75h6a1.5 1.5 0 0 1 1.5 1.5v.75h1.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 6 6h1.5v-.75A1.5 1.5 0 0 1 9 3.75Zm0 3h6v-1.5H9v1.5Z"
  />
);

const messageIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 12a8 8 0 1 1-3.4-6.55L21 4l-1 3.9A7.96 7.96 0 0 1 21 12Z"
  />
);

const serviceSections = [
  {
    title: "Calendar",
    description: "Your booked days and availability will show up here.",
    icon: calendarIcon,
    empty: "No availability set up yet",
  },
];

const productSections = [
  {
    title: "Custom requests",
    description: "Custom order requests from customers will show up here.",
    icon: clipboardIcon,
    empty: "No custom requests yet",
  },
];

export function PublishedDashboard({
  business,
}: {
  business: Business & {
    photos: Photo[];
    appointments: Appointment[];
    messages: Message[];
    products: Product[];
    orders: (Order & { product: Product | null })[];
  };
}) {
  const isService = business.businessType === BusinessType.SERVICE;
  const sections = isService ? serviceSections : productSections;

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <DashboardHeader business={business} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <Card.Header>
              <Card.Title>Page views</Card.Title>
              <Card.Description>Total visits to your public page.</Card.Description>
            </Card.Header>
            <Card.Content>
              <Typography.Heading level={3} className="text-4xl">
                {business.page_views.toLocaleString()}
              </Typography.Heading>
            </Card.Content>
          </Card>

          {isService && (
            <Card>
              <Card.Header>
                <Card.Title>Upcoming appointments</Card.Title>
                <Card.Description>
                  Customer bookings requested through your page.
                </Card.Description>
              </Card.Header>
              <Card.Content>
                {business.appointments.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {business.appointments.map((appointment) => (
                      <li
                        key={appointment.id}
                        className="rounded-lg border border-border p-3 text-sm"
                      >
                        <p className="font-medium text-foreground">
                          {appointment.customerName} ·{" "}
                          {appointment.requestedAt.toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        <p className="text-muted">{appointment.customerEmail}</p>
                        {appointment.notes && (
                          <p className="mt-1 text-muted">{appointment.notes}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState className="flex flex-col items-center gap-2 py-8 text-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-8 w-8 text-muted"
                    >
                      {clockIcon}
                    </svg>
                    <Typography.Paragraph size="sm" className="text-muted">
                      No upcoming appointments
                    </Typography.Paragraph>
                  </EmptyState>
                )}
              </Card.Content>
            </Card>
          )}

          {!isService && (
            <Card>
              <Card.Header>
                <Card.Title>Orders</Card.Title>
                <Card.Description>
                  Orders requested through your page.
                </Card.Description>
              </Card.Header>
              <Card.Content>
                {business.orders.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {business.orders.map((order) => (
                      <li
                        key={order.id}
                        className="rounded-lg border border-border p-3 text-sm"
                      >
                        <p className="font-medium text-foreground">
                          {order.customerName}
                          {order.product && ` · ${order.product.title}`} × {order.quantity}
                        </p>
                        <p className="text-muted">{order.customerEmail}</p>
                        {order.notes && <p className="mt-1 text-muted">{order.notes}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState className="flex flex-col items-center gap-2 py-8 text-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-8 w-8 text-muted"
                    >
                      {boxIcon}
                    </svg>
                    <Typography.Paragraph size="sm" className="text-muted">
                      No orders yet
                    </Typography.Paragraph>
                  </EmptyState>
                )}
              </Card.Content>
            </Card>
          )}

          <Card>
            <Card.Header>
              <Card.Title>Messages</Card.Title>
              <Card.Description>
                Customer inquiries sent through your page.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              {business.messages.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {business.messages.map((message) => (
                    <li
                      key={message.id}
                      className="rounded-lg border border-border p-3 text-sm"
                    >
                      <p className="font-medium text-foreground">
                        {message.contact_email}
                      </p>
                      <p className="mt-1 text-muted">{message.body}</p>
                      <p className="mt-1 text-xs text-muted">
                        {message.createdAt.toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState className="flex flex-col items-center gap-2 py-8 text-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-8 w-8 text-muted"
                  >
                    {messageIcon}
                  </svg>
                  <Typography.Paragraph size="sm" className="text-muted">
                    No messages yet
                  </Typography.Paragraph>
                </EmptyState>
              )}
            </Card.Content>
          </Card>

          {sections.map((section) => (
            <Card key={section.title}>
              <Card.Header>
                <Card.Title>{section.title}</Card.Title>
                <Card.Description>{section.description}</Card.Description>
              </Card.Header>
              <Card.Content>
                <EmptyState className="flex flex-col items-center gap-2 py-8 text-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-8 w-8 text-muted"
                  >
                    {section.icon}
                  </svg>
                  <Typography.Paragraph size="sm" className="text-muted">
                    {section.empty}
                  </Typography.Paragraph>
                </EmptyState>
              </Card.Content>
            </Card>
          ))}
        </div>

        {!isService && <ProductsSection products={business.products} />}

        {isService && <PhotosSection photos={business.photos} />}

        <Card>
          <Card.Header>
            <Card.Title>Business settings</Card.Title>
            <Card.Description>
              Edit your business info, contact details, and business type.
            </Card.Description>
          </Card.Header>
          <Card.Footer>
            <Link href="/dashboard/settings" className={buttonVariants({ size: "sm" })}>
              Edit business info
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
