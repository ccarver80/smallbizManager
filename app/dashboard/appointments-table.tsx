"use client";

import { useState } from "react";
import { Chip, Pagination, Tabs, Typography } from "@heroui/react";
import {
  AppointmentDetailsModal,
  type AppointmentWithDetails,
} from "./appointment-details-modal";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";

const ROWS_PER_PAGE = 10;

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.NEW]: "New",
  [AppointmentStatus.ACCEPTED]: "Accepted",
  [AppointmentStatus.FINISHED]: "Finished",
};

const tabs = [
  { id: "new", label: "New", status: AppointmentStatus.NEW as AppointmentStatus | null },
  {
    id: "accepted",
    label: "Accepted",
    status: AppointmentStatus.ACCEPTED as AppointmentStatus | null,
  },
  {
    id: "finished",
    label: "Finished",
    status: AppointmentStatus.FINISHED as AppointmentStatus | null,
  },
  { id: "all", label: "All", status: null },
];

type SortColumn = "customer" | "requested" | "status" | "created";

const columns: { key: SortColumn; label: string }[] = [
  { key: "customer", label: "Customer" },
  { key: "requested", label: "Requested for" },
  { key: "status", label: "Status" },
  { key: "created", label: "Date" },
];

function getSortValue(appointment: AppointmentWithDetails, column: SortColumn) {
  switch (column) {
    case "customer":
      return appointment.customerName.toLowerCase();
    case "requested":
      return appointment.requestedAt.getTime();
    case "status":
      return statusLabels[appointment.status];
    case "created":
      return appointment.createdAt.getTime();
  }
}

export function AppointmentsTable({
  appointments,
}: {
  appointments: AppointmentWithDetails[];
}) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [pageByTab, setPageByTab] = useState<Record<string, number>>({});
  const [sort, setSort] = useState<{ column: SortColumn; direction: "asc" | "desc" }>({
    column: "requested",
    direction: "desc",
  });

  const selectedAppointment =
    appointments.find((appointment) => appointment.id === selectedAppointmentId) ?? null;

  function toggleSort(column: SortColumn) {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { column, direction: "asc" },
    );
    setPageByTab({});
  }

  return (
    <div>
      <Tabs>
        <Tabs.ListContainer>
          <Tabs.List aria-label="Appointments">
            {tabs.map((tab) => {
              const count = tab.status
                ? appointments.filter((appointment) => appointment.status === tab.status)
                    .length
                : appointments.length;
              return (
                <Tabs.Tab key={tab.id} id={tab.id}>
                  {tab.label} ({count})
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs.ListContainer>

        {tabs.map((tab) => {
          const filtered = tab.status
            ? appointments.filter((appointment) => appointment.status === tab.status)
            : appointments;
          const sorted = [...filtered].sort((a, b) => {
            const av = getSortValue(a, sort.column);
            const bv = getSortValue(b, sort.column);
            if (av < bv) return sort.direction === "asc" ? -1 : 1;
            if (av > bv) return sort.direction === "asc" ? 1 : -1;
            return 0;
          });
          const currentPage = pageByTab[tab.id] ?? 1;
          const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE));
          const visible = sorted.slice(
            (currentPage - 1) * ROWS_PER_PAGE,
            currentPage * ROWS_PER_PAGE,
          );

          function setPage(page: number) {
            setPageByTab((pages) => ({ ...pages, [tab.id]: page }));
          }

          return (
            <Tabs.Panel key={tab.id} id={tab.id} className="pt-4">
              {visible.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted uppercase">
                          {columns.map((column) => (
                            <th key={column.key} className="px-4 py-2 font-medium">
                              <button
                                type="button"
                                className="flex items-center gap-1 uppercase"
                                onClick={() => toggleSort(column.key)}
                              >
                                {column.label}
                                {sort.column === column.key && (
                                  <span aria-hidden="true">
                                    {sort.direction === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </button>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((appointment) => (
                          <tr
                            key={appointment.id}
                            className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-secondary"
                            onClick={() => setSelectedAppointmentId(appointment.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground">
                                {appointment.customerName}
                              </p>
                              <p className="text-xs text-muted">
                                {appointment.customerEmail}
                              </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted">
                              {appointment.requestedAt.toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <Chip size="sm">{statusLabels[appointment.status]}</Chip>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted">
                              {appointment.createdAt.toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <Pagination size="sm" className="mt-4">
                      <Pagination.Content>
                        <Pagination.Item>
                          <Pagination.Previous
                            isDisabled={currentPage === 1}
                            onPress={() => setPage(currentPage - 1)}
                          >
                            Previous
                          </Pagination.Previous>
                        </Pagination.Item>
                        <Pagination.Item>
                          <Pagination.Summary>
                            Page {currentPage} of {totalPages}
                          </Pagination.Summary>
                        </Pagination.Item>
                        <Pagination.Item>
                          <Pagination.Next
                            isDisabled={currentPage === totalPages}
                            onPress={() => setPage(currentPage + 1)}
                          >
                            Next
                          </Pagination.Next>
                        </Pagination.Item>
                      </Pagination.Content>
                    </Pagination>
                  )}
                </>
              ) : (
                <Typography.Paragraph size="sm" className="py-8 text-center text-muted">
                  No appointments
                </Typography.Paragraph>
              )}
            </Tabs.Panel>
          );
        })}
      </Tabs>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointmentId(null)}
      />
    </div>
  );
}
