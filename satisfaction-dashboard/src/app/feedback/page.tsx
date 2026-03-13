"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, ChevronLeft, ChevronRight, Star, SlidersHorizontal, X } from "lucide-react";
import { formatDate, formatScore } from "@/lib/utils";
import type { FeedbackRecord } from "@/types/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_FEEDBACK } from "@/lib/mock-data";

const PAGE_SIZE = 8;

const SCORE_FILTERS = [
  { label: "All", value: "all" },
  { label: "★★★★★ (5)", value: "5" },
  { label: "★★★★ (4)", value: "4" },
  { label: "★★★ (3)", value: "3" },
  { label: "★★ (≤2)", value: "low" },
];

export default function FeedbackPage() {
  const [selected, setSelected] = useState("all");
  const [allFeedback, setAllFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const getFeedbackCategory = (feedback: FeedbackRecord) => {
    const comment = (feedback.comment ?? "").toLowerCase();
    if (comment.includes("clean") || comment.includes("hygiene")) return "Hygiene";
    if (comment.includes("wifi") || comment.includes("platform") || comment.includes("technical")) return "Infrastructure";
    if (comment.includes("price") || comment.includes("cost")) return "Pricing";
    if (comment.includes("staff") || comment.includes("support")) return "Staff";
    if (comment.includes("time") || comment.includes("wait") || comment.includes("delay")) return "Timeliness";
    return "General";
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = selected !== "all" ? `?serviceId=${selected}&limit=100` : "?limit=100";
    fetch(`/api/feedback${params}`)
      .then((r) => r.json())
      .then((d) => setAllFeedback(d.feedback ?? []))
      .catch(() => {
        // Fallback to mock data
        if (selected !== "all") {
          setAllFeedback(MOCK_FEEDBACK.filter((f) => f.serviceId === selected));
        } else {
          setAllFeedback(MOCK_FEEDBACK);
        }
      })
      .finally(() => setLoading(false));
  }, [selected]);

  // Apply search + score filter
  const filtered = useMemo(() => {
    return allFeedback.filter((f) => {
      const matchesSearch =
        !search ||
        f.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
        f.comment?.toLowerCase().includes(search.toLowerCase()) ||
        f.studentName?.toLowerCase().includes(search.toLowerCase());

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "low" ? f.overallSatisfaction <= 2 : f.overallSatisfaction === Number(scoreFilter));

      const matchesCategory = categoryFilter === "all" || getFeedbackCategory(f) === categoryFilter;

      return matchesSearch && matchesScore && matchesCategory;
    });
  }, [allFeedback, search, scoreFilter, categoryFilter]);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(allFeedback.map(getFeedbackCategory))).sort();
    return ["all", ...categories];
  }, [allFeedback]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters = search || scoreFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setScoreFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  return (
    <AdminOnly>
      <AppShell title="Feedback" description="Browse and filter all submitted feedback">
        <div className="space-y-5">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search feedback…"
                  className="h-10 rounded-xl pl-10"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                className="h-10 gap-2 rounded-xl"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0">
                    {[search && "1", scoreFilter !== "all" && "1", categoryFilter !== "all" && "1"].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-1 rounded-xl text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>
            <ServiceFilter selected={selected} onChange={(v) => { setSelected(v); setPage(1); }} />
          </div>

          {/* Score filter pills */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 rounded-xl border bg-muted/30 p-4">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Star className="h-3.5 w-3.5" /> Score:
                  </span>
                  {SCORE_FILTERS.map((f) => (
                    <Button
                      key={f.value}
                      variant={scoreFilter === f.value ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => { setScoreFilter(f.value); setPage(1); }}
                    >
                      {f.label}
                    </Button>
                  ))}
                  <div className="ml-auto min-w-[170px]">
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-xs"
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                      }}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === "all" ? "All categories" : option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table card */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Feedback Entries</CardTitle>
                    <CardDescription>
                      {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
                    </CardDescription>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Service
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Student
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Score
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Category
                        </th>
                        <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                          Comment
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {pageItems.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <p className="text-sm text-muted-foreground">No feedback found</p>
                              {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                                  <X className="h-3.5 w-3.5" /> Clear filters
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      <AnimatePresence>
                        {pageItems.map((item, rowIdx) => (
                          <motion.tr
                            key={item._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowIdx * 0.03 }}
                            className="transition-colors hover:bg-muted/30"
                          >
                            <td className="px-6 py-4">
                              <span className="font-medium">{item.serviceName ?? item.serviceId}</span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground text-sm">
                              {item.studentName ?? item.studentId}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                                  item.overallSatisfaction >= 4
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                    : item.overallSatisfaction >= 3
                                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                      : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                                )}
                              >
                                <Star className="h-3 w-3 fill-current" />
                                {formatScore(item.overallSatisfaction)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="rounded-full text-[11px]">
                                {getFeedbackCategory(item)}
                              </Badge>
                            </td>
                            <td className="hidden max-w-xs px-6 py-4 text-muted-foreground md:table-cell">
                              <span className="line-clamp-1">
                                {item.comment || (
                                  <span className="italic text-muted-foreground/50">No comment</span>
                                )}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(item.submittedAt)}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/50 px-6 py-3">
                <span className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 rounded-lg text-xs"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </AppShell>
    </AdminOnly>
  );
}
