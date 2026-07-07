import Link from "next/link";
import {
  Card,
  EmptyState,
  Tabs,
  Typography,
  buttonVariants,
} from "@heroui/react";
import { BusinessType } from "@/lib/generated/prisma/enums";
import type {
  Appointment,
  AppointmentNote,
  Business,
  Customer,
  Message,
  Order,
  OrderItem,
  OrderNote,
  Photo,
  Product,
} from "@/lib/generated/prisma/client";
import { DashboardHeader } from "./dashboard-header";
import { PhotosSection } from "./photos-section";
import { ProductsSection } from "./products-section";
import { CustomersSection } from "./customers-section";
import { OrdersTable } from "./orders-table";
import { AddOrderForm } from "./add-order-form";
import { AppointmentsTable } from "./appointments-table";

const calendarIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M8 3v3m8-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
  />
);

const messageIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 12a8 8 0 1 1-3.4-6.55L21 4l-1 3.9A7.96 7.96 0 0 1 21 12Z"
  />
);

export function PublishedDashboard({
  business,
}: {
  business: Business & {
    photos: Photo[];
    appointments: (Appointment & { user_notes: AppointmentNote[] })[];
    messages: Message[];
    products: Product[];
    orders: (Order & {
      items: (OrderItem & { product: Product | null })[];
      user_notes: OrderNote[];
    })[];
    customers: Customer[];
  };
}) {
  const isService = business.businessType === BusinessType.SERVICE;
  const catalogTabId = isService ? "photos" : "products";

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <DashboardHeader business={business} />

        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Dashboard sections">
              <Tabs.Tab id="overview">Overview</Tabs.Tab>
              {isService && <Tabs.Tab id="appointments">Appointments</Tabs.Tab>}
              {isService && <Tabs.Tab id="calendar">Calendar</Tabs.Tab>}
              {!isService && <Tabs.Tab id="orders">Orders</Tabs.Tab>}
              <Tabs.Tab id="messages">Messages</Tabs.Tab>
              <Tabs.Tab id={catalogTabId}>
                {isService ? "Photos" : "Products"}
              </Tabs.Tab>
              <Tabs.Tab id="customers">Customers</Tabs.Tab>
              <Tabs.Tab id="settings">Settings</Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          <Tabs.Panel id="overview" className="pt-6">
            <Card>
              <Card.Header>
                <Card.Title>Page views</Card.Title>
                <Card.Description>
                  Total visits to your public page.
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <Typography.Heading level={3} className="text-4xl">
                  {business.page_views.toLocaleString()}
                </Typography.Heading>
              </Card.Content>
            </Card>
          </Tabs.Panel>

          {isService && (
            <Tabs.Panel id="appointments" className="pt-6">
              <AppointmentsTable appointments={business.appointments} />
            </Tabs.Panel>
          )}

          {isService && (
            <Tabs.Panel id="calendar" className="pt-6">
              <Card>
                <Card.Header>
                  <Card.Title>Calendar</Card.Title>
                  <Card.Description>
                    Your booked days and availability will show up here.
                  </Card.Description>
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
                      {calendarIcon}
                    </svg>
                    <Typography.Paragraph size="sm" className="text-muted">
                      No availability set up yet
                    </Typography.Paragraph>
                  </EmptyState>
                </Card.Content>
              </Card>
            </Tabs.Panel>
          )}

          {!isService && (
            <Tabs.Panel id="orders" className="flex flex-col gap-6 pt-6">
              <OrdersTable
                orders={business.orders.map((order) => ({
                  ...order,
                  items: order.items.map((item) => ({
                    ...item,
                    product: item.product
                      ? {
                          ...item.product,
                          price: item.product.price
                            ? Number(item.product.price)
                            : null,
                        }
                      : null,
                  })),
                }))}
              />

              <AddOrderForm
                products={business.products.map((product) => ({
                  ...product,
                  price: product.price ? Number(product.price) : null,
                }))}
              />
            </Tabs.Panel>
          )}

          <Tabs.Panel id="messages" className="pt-6">
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
          </Tabs.Panel>

          <Tabs.Panel id={catalogTabId} className="pt-6">
            {isService ? (
              <PhotosSection photos={business.photos} />
            ) : (
              <ProductsSection
                products={business.products.map((product) => ({
                  ...product,
                  price: product.price ? Number(product.price) : null,
                }))}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel id="customers" className="pt-6">
            <CustomersSection customers={business.customers} />
          </Tabs.Panel>

          <Tabs.Panel id="settings" className="pt-6">
            <Card>
              <Card.Header>
                <Card.Title>Business settings</Card.Title>
                <Card.Description>
                  Edit your business info, contact details, and business type.
                </Card.Description>
              </Card.Header>
              <Card.Footer>
                <Link
                  href="/dashboard/settings"
                  className={buttonVariants({ size: "sm" })}
                >
                  Edit business info
                </Link>
              </Card.Footer>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
