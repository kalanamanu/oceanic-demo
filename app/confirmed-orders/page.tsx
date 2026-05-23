"use client";

import * as React from "react";
import { ConfirmedOrderService } from "@/services/confirmed-order.service";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Optional: Define a clean interface for your order item type
interface ConfirmedOrder {
  confirmed_pre_cost_id: string;
  pre_cost_id: string;
  original_total_lkr: number | string;
  original_total_usd: number | string;
  confirmed_total_lkr: number | string;
  confirmed_total_usd: number | string;
  variance_lkr: number | string;
  variance_usd: number | string;
  gm_status: string;
  document_status: string;
  createdAt: string;
}

export default function ConfirmedOrdersPage() {
  const router = useRouter();

  const [data, setData] = React.useState<ConfirmedOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  /* PAGINATION STATE */
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  /* ================= FETCH ================= */
  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await ConfirmedOrderService.getAllConfirmedOrders();
        // service returns a ConfirmedOrder type from a different module copy; cast to local type
        setData((res || []) as unknown as ConfirmedOrder[]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load confirmed orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* PAGINATION MATH */
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading confirmed orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Confirmed Orders
          </h1>
          <p className="text-muted-foreground text-sm">
            PreCost confirmation history and financial variance log.
          </p>
        </div>

        <Separator />

        {/* TABLE WRAPPER */}
        <div className="space-y-4">
          <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[120px] py-4 font-medium">
                      Confirmed ID
                    </TableHead>
                    <TableHead className="w-[120px] font-medium">
                      PreCost ID
                    </TableHead>

                    <TableHead className="text-right font-medium">
                      Original LKR
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      Original USD
                    </TableHead>

                    <TableHead className="text-right font-medium">
                      Confirmed LKR
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      Confirmed USD
                    </TableHead>

                    <TableHead className="text-right font-medium">
                      Variance LKR
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      Variance USD
                    </TableHead>

                    <TableHead className="font-medium text-center">
                      GM Status
                    </TableHead>
                    <TableHead className="font-medium text-center">
                      Doc Status
                    </TableHead>

                    <TableHead className="font-medium">Date</TableHead>

                    <TableHead className="text-right font-medium pr-6">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        className="text-center py-16 text-muted-foreground"
                      >
                        No confirmed orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item) => {
                      const isLkrNegative = Number(item.variance_lkr) < 0;
                      const isUsdNegative = Number(item.variance_usd) < 0;

                      return (
                        <TableRow
                          key={item.confirmed_pre_cost_id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-mono text-xs font-medium">
                            {item.confirmed_pre_cost_id}
                          </TableCell>

                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {item.pre_cost_id}
                          </TableCell>

                          {/* ORIGINAL */}
                          <TableCell className="text-right font-mono text-xs">
                            {Number(item.original_total_lkr).toLocaleString()}
                          </TableCell>

                          <TableCell className="text-right font-mono text-xs">
                            ${Number(item.original_total_usd).toLocaleString()}
                          </TableCell>

                          {/* CONFIRMED */}
                          <TableCell className="text-right font-semibold text-green-600 font-mono text-xs">
                            {Number(item.confirmed_total_lkr).toLocaleString()}
                          </TableCell>

                          <TableCell className="text-right font-semibold text-green-600 font-mono text-xs">
                            ${Number(item.confirmed_total_usd).toLocaleString()}
                          </TableCell>

                          {/* VARIANCE */}
                          <TableCell
                            className={`text-right font-mono text-xs font-medium ${
                              isLkrNegative ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {isLkrNegative ? "" : "+"}
                            {Number(item.variance_lkr).toLocaleString()}
                          </TableCell>

                          <TableCell
                            className={`text-right font-mono text-xs font-medium ${
                              isUsdNegative ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {isUsdNegative ? "-$" : "+$"}
                            {Math.abs(
                              Number(item.variance_usd),
                            ).toLocaleString()}
                          </TableCell>

                          {/* STATUS */}
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground capitalize">
                              {item.gm_status}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground capitalize">
                              {item.document_status}
                            </span>
                          </TableCell>

                          {/* DATE */}
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </TableCell>

                          {/* ACTION */}
                          <TableCell className="text-right pr-6">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/confirmed-orders/view/${item.confirmed_pre_cost_id}`,
                                )
                              }
                              className="h-8 gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* UI/UX PAGINATION BAR */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, data.length)}
                </span>{" "}
                of <span className="font-medium">{data.length}</span> entries
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>

                <div className="text-xs font-medium text-muted-foreground px-2">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
