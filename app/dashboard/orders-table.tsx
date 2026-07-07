"use client";

import { useState } from "react";
import { Chip, Pagination, Tabs, Typography } from "@heroui/react";
import { OrderDetailsModal, type OrderWithDetails } from "./order-details-modal";
import { OrderStatus } from "@/lib/generated/prisma/enums";

const ROWS_PER_PAGE = 10;

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.NEW]: "New",
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.FINISHED]: "Finished",
};

const tabs = [
  { id: "new", label: "New", status: OrderStatus.NEW as OrderStatus | null },
  { id: "pending", label: "Pending", status: OrderStatus.PENDING as OrderStatus | null },
  { id: "finished", label: "Finished", status: OrderStatus.FINISHED as OrderStatus | null },
  { id: "all", label: "All", status: null },
];

type SortColumn = "customer" | "items" | "status" | "paid" | "date";

const columns: { key: SortColumn; label: string }[] = [
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "status", label: "Status" },
  { key: "paid", label: "Paid" },
  { key: "date", label: "Date" },
];

function getSortValue(order: OrderWithDetails, column: SortColumn) {
  switch (column) {
    case "customer":
      return order.customerName.toLowerCase();
    case "items":
      return order.items
        .map((item) => item.product?.title ?? "Item")
        .join(", ")
        .toLowerCase();
    case "status":
      return statusLabels[order.status];
    case "paid":
      return order.paid ? 1 : 0;
    case "date":
      return order.createdAt.getTime();
  }
}

export function OrdersTable({ orders }: { orders: OrderWithDetails[] }) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pageByTab, setPageByTab] = useState<Record<string, number>>({});
  const [sort, setSort] = useState<{ column: SortColumn; direction: "asc" | "desc" }>({
    column: "date",
    direction: "desc",
  });

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

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
          <Tabs.List aria-label="Orders">
            {tabs.map((tab) => {
              const count = tab.status
                ? orders.filter((order) => order.status === tab.status).length
                : orders.length;
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
            ? orders.filter((order) => order.status === tab.status)
            : orders;
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
                        {visible.map((order) => (
                          <tr
                            key={order.id}
                            className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-secondary"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-muted">{order.customerEmail || "—"}</p>
                            </td>
                            <td className="max-w-xs px-4 py-3 text-muted">
                              {order.items
                                .map(
                                  (item) =>
                                    `${item.product?.title ?? "Item"} × ${item.quantity}`,
                                )
                                .join(", ")}
                            </td>
                            <td className="px-4 py-3">
                              <Chip size="sm">{statusLabels[order.status]}</Chip>
                            </td>
                            <td className="px-4 py-3">
                              {order.paid ? (
                                <Chip size="sm" color="success">
                                  Paid
                                </Chip>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted">
                              {order.createdAt.toLocaleString(undefined, {
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
                  No orders
                </Typography.Paragraph>
              )}
            </Tabs.Panel>
          );
        })}
      </Tabs>

      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} />
    </div>
  );
}
