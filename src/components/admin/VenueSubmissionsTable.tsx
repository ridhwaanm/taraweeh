import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogTitle, DialogBody, DialogActions } from "../ui/dialog";
import { Field, Label, ErrorMessage } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  MapPinIcon,
  PencilIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";

interface VenueSubmission {
  id: number;
  venue_name: string;
  sub_venue_name: string | null;
  address_full: string;
  city: string;
  province: string | null;
  latitude: number;
  longitude: number;
  juz_per_night: number | null;
  reader_names: string | null;
  whatsapp_number: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

type StatusTab = "pending" | "approved" | "rejected";

// CSV headers
const CSV_COLUMNS = [
  "venue_name",
  "sub_venue_name",
  "address_full",
  "city",
  "province",
  "latitude",
  "longitude",
  "juz_per_night",
  "reader_names",
  "whatsapp_number",
] as const;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

export function VenueSubmissionsTable() {
  const [submissions, setSubmissions] = useState<VenueSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("pending");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Approve dialog (single)
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<VenueSubmission | null>(
    null,
  );
  const [approveError, setApproveError] = useState("");

  // Reject dialog (single)
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<VenueSubmission | null>(
    null,
  );
  const [rejectNotes, setRejectNotes] = useState("");

  // Delete dialog (single)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VenueSubmission | null>(
    null,
  );

  // Edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<VenueSubmission | null>(null);
  const [editForm, setEditForm] = useState({
    venue_name: "",
    sub_venue_name: "",
    address_full: "",
    city: "",
    province: "",
    latitude: "",
    longitude: "",
    juz_per_night: "",
    reader_names: "",
    whatsapp_number: "",
  });
  const [editError, setEditError] = useState("");

  // Bulk action dialogs
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);
  const [bulkRejectNotes, setBulkRejectNotes] = useState("");
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // CSV import dialog
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importStep, setImportStep] = useState<
    "instructions" | "preview" | "importing" | "done" | "error"
  >("instructions");
  const [importRows, setImportRows] = useState<
    { data: Record<string, string>; error?: string }[]
  >([]);
  const [importResult, setImportResult] = useState<{
    total: number;
    imported: number;
    duplicates: number;
    errors: number;
    errorDetails: string[];
  } | null>(null);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success toast
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // Pagination
  const PAGE_SIZE = 25;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  useEffect(() => {
    setSelectedIds(new Set());
    setPage(1);
  }, [activeTab]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/venue-submissions?status=${activeTab}`,
      );
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sorted + paginated data
  const sorted = [...submissions].sort((a, b) =>
    a.venue_name.localeCompare(b.venue_name),
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // --- Selection helpers ---
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = paged.map((s) => s.id);
    const allPageSelected = pageIds.every((id) => selectedIds.has(id));
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => new Set([...prev, ...pageIds]));
    }
  };

  // --- Single actions ---
  const openApprove = (sub: VenueSubmission) => {
    setApproveTarget(sub);
    setApproveError("");
    setIsApproveOpen(true);
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setApproveError("");
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: approveTarget.id,
          action: "approve",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve");
      }
      setIsApproveOpen(false);
      setApproveTarget(null);
      fetchSubmissions();
    } catch (err: any) {
      setApproveError(err.message);
    }
  };

  const openReject = (sub: VenueSubmission) => {
    setRejectTarget(sub);
    setRejectNotes("");
    setIsRejectOpen(true);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectTarget.id,
          action: "reject",
          admin_notes: rejectNotes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      setIsRejectOpen(false);
      setRejectTarget(null);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openDelete = (sub: VenueSubmission) => {
    setDeleteTarget(sub);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Edit ---
  const openEdit = (sub: VenueSubmission) => {
    setEditTarget(sub);
    setEditForm({
      venue_name: sub.venue_name,
      sub_venue_name: sub.sub_venue_name || "",
      address_full: sub.address_full,
      city: sub.city,
      province: sub.province || "",
      latitude: String(sub.latitude),
      longitude: String(sub.longitude),
      juz_per_night: sub.juz_per_night != null ? String(sub.juz_per_night) : "",
      reader_names: sub.reader_names || "",
      whatsapp_number: sub.whatsapp_number || "",
    });
    setEditError("");
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditError("");
    const lat = parseFloat(editForm.latitude);
    const lng = parseFloat(editForm.longitude);
    if (
      !editForm.venue_name.trim() ||
      !editForm.address_full.trim() ||
      !editForm.city.trim()
    ) {
      setEditError("Venue name, address, and city are required");
      return;
    }
    if (!isFinite(lat) || !isFinite(lng)) {
      setEditError("Valid latitude and longitude are required");
      return;
    }
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editTarget.id,
          action: "edit",
          venue_name: editForm.venue_name.trim(),
          sub_venue_name: editForm.sub_venue_name.trim() || null,
          address_full: editForm.address_full.trim(),
          city: editForm.city.trim(),
          province: editForm.province.trim() || null,
          latitude: lat,
          longitude: lng,
          juz_per_night: editForm.juz_per_night
            ? parseFloat(editForm.juz_per_night)
            : null,
          reader_names: editForm.reader_names.trim() || null,
          whatsapp_number: editForm.whatsapp_number.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      setIsEditOpen(false);
      setEditTarget(null);
      fetchSubmissions();
    } catch (err: any) {
      setEditError(err.message);
    }
  };

  // --- Bulk actions ---
  const selectedArray = Array.from(selectedIds);

  const handleBulkApprove = async () => {
    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedArray, action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to bulk approve");
      const data = await res.json();
      setIsBulkApproveOpen(false);
      setSelectedIds(new Set());
      showToast(`${data.count} venue${data.count !== 1 ? "s" : ""} approved`);
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedArray,
          action: "reject",
          admin_notes: bulkRejectNotes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to bulk reject");
      setIsBulkRejectOpen(false);
      setBulkRejectNotes("");
      setSelectedIds(new Set());
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/admin/venue-submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedArray }),
      });
      if (!res.ok) throw new Error("Failed to bulk delete");
      setIsBulkDeleteOpen(false);
      setSelectedIds(new Set());
      fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // --- CSV import ---
  const openImport = () => {
    setImportStep("instructions");
    setImportRows([]);
    setImportResult(null);
    setImportError("");
    setIsImportOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        setImportError("CSV must have a header row and at least one data row");
        return;
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
      const rows: { data: Record<string, string>; error?: string }[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const data: Record<string, string> = {};
        headers.forEach((h, idx) => {
          data[h] = values[idx] || "";
        });

        // Validate required fields
        const missing: string[] = [];
        if (!data.venue_name) missing.push("venue_name");
        if (!data.address_full) missing.push("address_full");
        if (!data.city) missing.push("city");
        if (!data.latitude || !isFinite(parseFloat(data.latitude)))
          missing.push("latitude");
        if (!data.longitude || !isFinite(parseFloat(data.longitude)))
          missing.push("longitude");

        rows.push({
          data,
          error:
            missing.length > 0 ? `Missing: ${missing.join(", ")}` : undefined,
        });
      }

      setImportRows(rows);
      setImportError("");
      setImportStep("preview");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const validRows = importRows.filter((r) => !r.error);
    if (validRows.length === 0) return;

    setImportStep("importing");
    try {
      const res = await fetch("/api/admin/venue-submissions-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissions: validRows.map((r) => r.data),
        }),
      });
      if (!res.ok) throw new Error("Failed to import");
      const result = await res.json();
      setImportResult(result);
      setImportStep("done");
      fetchSubmissions();
    } catch (err: any) {
      setImportError(err.message);
      setImportStep("error");
    }
  };

  const downloadTemplate = () => {
    const csv = CSV_COLUMNS.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "venue_submissions_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = importRows.filter((r) => !r.error).length;
  const invalidCount = importRows.filter((r) => r.error).length;

  const TABS: { label: string; value: StatusTab }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="relative">
      {/* Success toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
          >
            <CheckCircleIcon className="h-5 w-5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Venue Submissions
        </h2>
        <Button onClick={openImport} color="zinc">
          <ArrowUpTrayIcon data-slot="icon" />
          Import CSV
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-700">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-950/30">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            {activeTab === "pending" && (
              <>
                <Button
                  color="green"
                  onClick={() => setIsBulkApproveOpen(true)}
                  className="!text-xs !py-1"
                >
                  Approve All
                </Button>
                <Button
                  color="amber"
                  onClick={() => setIsBulkRejectOpen(true)}
                  className="!text-xs !py-1"
                >
                  Reject All
                </Button>
              </>
            )}
            <Button
              color="red"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="!text-xs !py-1"
            >
              Delete All
            </Button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          >
            Clear selection
          </button>
        </div>
      )}

      {loading && <div>Loading submissions...</div>}
      {error && <div className="text-red-600 mb-3">Error: {error}</div>}

      {!loading && submissions.length === 0 && (
        <div className="text-zinc-500 dark:text-zinc-400 py-8 text-center">
          No {activeTab} submissions
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            {submissions.length} total &middot; Page {page} of {totalPages}
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <Table className="min-w-[900px]">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-10">
                    <Checkbox
                      color="indigo"
                      checked={
                        paged.length > 0 &&
                        paged.every((s) => selectedIds.has(s.id))
                      }
                      indeterminate={
                        paged.some((s) => selectedIds.has(s.id)) &&
                        !paged.every((s) => selectedIds.has(s.id))
                      }
                      onChange={toggleSelectAll}
                    />
                  </TableHeader>
                  <TableHeader>Venue</TableHeader>
                  <TableHeader>City</TableHeader>
                  <TableHeader>Juz</TableHeader>
                  <TableHeader>Readers</TableHeader>
                  <TableHeader>WhatsApp</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <Checkbox
                        color="indigo"
                        checked={selectedIds.has(sub.id)}
                        onChange={() => toggleSelect(sub.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sub.venue_name}</div>
                        {sub.sub_venue_name && (
                          <div className="text-xs text-zinc-500">
                            {sub.sub_venue_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sub.city}</TableCell>
                    <TableCell>{sub.juz_per_night || "—"}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm">
                        {sub.reader_names || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sub.whatsapp_number ? (
                        <a
                          href={`https://wa.me/${sub.whatsapp_number.replace(/^\+/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          {sub.whatsapp_number}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          plain
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${sub.latitude},${sub.longitude}`,
                              "_blank",
                            )
                          }
                          title="View on map"
                        >
                          <MapPinIcon data-slot="icon" />
                        </Button>
                        <Button
                          plain
                          onClick={() => openEdit(sub)}
                          title="Edit"
                        >
                          <PencilIcon data-slot="icon" />
                        </Button>
                        {activeTab === "pending" && (
                          <>
                            <Button
                              plain
                              onClick={() => openApprove(sub)}
                              title="Approve"
                            >
                              <CheckCircleIcon
                                data-slot="icon"
                                className="text-green-600"
                              />
                            </Button>
                            <Button
                              plain
                              onClick={() => openReject(sub)}
                              title="Reject"
                            >
                              <XCircleIcon
                                data-slot="icon"
                                className="text-amber-600"
                              />
                            </Button>
                          </>
                        )}
                        <Button
                          plain
                          onClick={() => openDelete(sub)}
                          title="Delete"
                        >
                          <TrashIcon
                            data-slot="icon"
                            className="text-red-600"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <Button
                plain
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 2,
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1)
                      acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-2 py-1 text-sm text-zinc-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`min-w-[2rem] rounded px-2 py-1 text-sm ${
                          page === p
                            ? "bg-indigo-600 text-white"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
              </div>
              <Button
                plain
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* ===== DIALOGS ===== */}

      {/* Approve Dialog (single) */}
      <Dialog open={isApproveOpen} onClose={setIsApproveOpen}>
        <DialogTitle>Approve Venue Submission</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Approve this venue submission? It will appear on the venues map.
          </p>
          {approveTarget && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm space-y-1">
              <div className="text-zinc-900 dark:text-white font-medium">
                {approveTarget.venue_name}
                {approveTarget.sub_venue_name &&
                  ` — ${approveTarget.sub_venue_name}`}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">
                <strong>City:</strong> {approveTarget.city}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">
                <strong>Address:</strong> {approveTarget.address_full}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">
                <strong>Coords:</strong>{" "}
                <a
                  href={`https://www.google.com/maps?q=${approveTarget.latitude},${approveTarget.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {approveTarget.latitude}, {approveTarget.longitude}
                </a>
              </div>
              {approveTarget.reader_names && (
                <div className="text-zinc-500 dark:text-zinc-400">
                  <strong>Readers:</strong> {approveTarget.reader_names}
                </div>
              )}
            </div>
          )}
          {approveError && <ErrorMessage>{approveError}</ErrorMessage>}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsApproveOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApprove} color="indigo">
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog (single) */}
      <Dialog open={isRejectOpen} onClose={setIsRejectOpen}>
        <DialogTitle>Reject Submission</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Rejecting: <strong>{rejectTarget?.venue_name}</strong>
          </p>
          <Field>
            <Label>Notes (optional)</Label>
            <Textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Duplicate of existing venue"
              rows={3}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsRejectOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleReject} color="red">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog (single) */}
      <Dialog open={isDeleteOpen} onClose={setIsDeleteOpen}>
        <DialogTitle>Delete Submission</DialogTitle>
        <DialogBody>
          Are you sure you want to permanently delete the submission for{" "}
          <strong>{deleteTarget?.venue_name}</strong>? This cannot be undone.
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="red">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onClose={setIsEditOpen} size="2xl">
        <DialogTitle>Edit Submission</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>Venue Name *</Label>
                <Input
                  value={editForm.venue_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, venue_name: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>Sub-venue Name</Label>
                <Input
                  value={editForm.sub_venue_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sub_venue_name: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field>
              <Label>Address *</Label>
              <Input
                value={editForm.address_full}
                onChange={(e) =>
                  setEditForm({ ...editForm, address_full: e.target.value })
                }
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>City *</Label>
                <Input
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>Province</Label>
                <Input
                  value={editForm.province}
                  onChange={(e) =>
                    setEditForm({ ...editForm, province: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>Latitude *</Label>
                <Input
                  type="number"
                  step="any"
                  value={editForm.latitude}
                  onChange={(e) =>
                    setEditForm({ ...editForm, latitude: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>Longitude *</Label>
                <Input
                  type="number"
                  step="any"
                  value={editForm.longitude}
                  onChange={(e) =>
                    setEditForm({ ...editForm, longitude: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>Juz per Night</Label>
                <Input
                  type="number"
                  step="0.25"
                  value={editForm.juz_per_night}
                  onChange={(e) =>
                    setEditForm({ ...editForm, juz_per_night: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label>WhatsApp Number</Label>
                <Input
                  value={editForm.whatsapp_number}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      whatsapp_number: e.target.value,
                    })
                  }
                />
              </Field>
            </div>
            <Field>
              <Label>Reader Names</Label>
              <Textarea
                value={editForm.reader_names}
                onChange={(e) =>
                  setEditForm({ ...editForm, reader_names: e.target.value })
                }
                rows={2}
              />
            </Field>
          </div>
          {editError && <ErrorMessage>{editError}</ErrorMessage>}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit} color="indigo">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Approve Dialog */}
      <Dialog
        open={isBulkApproveOpen}
        onClose={bulkActionLoading ? () => {} : setIsBulkApproveOpen}
      >
        <DialogTitle>Bulk Approve</DialogTitle>
        <DialogBody>
          {bulkActionLoading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-8 w-8 rounded-full border-2 border-zinc-200 border-t-green-600 dark:border-zinc-700 dark:border-t-green-400"
              />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Approving {selectedIds.size} submissions...
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Approve <strong>{selectedIds.size}</strong> selected submissions?
              They will appear on the venues map.
            </p>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsBulkApproveOpen(false)}
            disabled={bulkActionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkApprove}
            color="green"
            disabled={bulkActionLoading}
          >
            {bulkActionLoading ? "Approving..." : `Approve ${selectedIds.size}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={isBulkRejectOpen} onClose={setIsBulkRejectOpen}>
        <DialogTitle>Bulk Reject</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Reject <strong>{selectedIds.size}</strong> selected submissions?
          </p>
          <Field>
            <Label>Shared Notes (optional)</Label>
            <Textarea
              value={bulkRejectNotes}
              onChange={(e) => setBulkRejectNotes(e.target.value)}
              placeholder="e.g. Duplicate entries"
              rows={3}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsBulkRejectOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkReject}
            color="red"
            disabled={bulkActionLoading}
          >
            {bulkActionLoading ? "Rejecting..." : `Reject ${selectedIds.size}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={isBulkDeleteOpen} onClose={setIsBulkDeleteOpen}>
        <DialogTitle>Bulk Delete</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Permanently delete <strong>{selectedIds.size}</strong> selected
            submissions? This cannot be undone.
          </p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsBulkDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkDelete}
            color="red"
            disabled={bulkActionLoading}
          >
            {bulkActionLoading ? "Deleting..." : `Delete ${selectedIds.size}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog
        open={isImportOpen}
        onClose={() => {
          if (importStep !== "importing") setIsImportOpen(false);
        }}
        size="2xl"
      >
        <DialogTitle>Import Venue Submissions from CSV</DialogTitle>
        <DialogBody>
          {importStep === "instructions" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-white">
                  Expected CSV columns:
                </p>
                <code className="block overflow-x-auto rounded bg-zinc-900 p-2 text-xs text-zinc-100 dark:bg-black">
                  {CSV_COLUMNS.join(", ")}
                </code>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Required: venue_name, address_full, city, latitude, longitude.
                  Others are optional. Use quotes for values containing commas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Download template CSV
                </button>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 dark:text-zinc-400 dark:file:bg-indigo-950/50 dark:file:text-indigo-300"
                />
              </div>
              {importError && (
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {importError}
                  </p>
                </div>
              )}
            </div>
          )}

          {importStep === "preview" && (
            <div className="space-y-3">
              <div className="flex gap-4 text-sm">
                <span className="text-zinc-900 dark:text-white">
                  Total rows: <strong>{importRows.length}</strong>
                </span>
                <span className="text-green-700 dark:text-green-400">
                  Valid: <strong>{validCount}</strong>
                </span>
                {invalidCount > 0 && (
                  <span className="text-red-600 dark:text-red-400">
                    Invalid: <strong>{invalidCount}</strong>
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                <table className="min-w-full text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left">#</th>
                      <th className="px-2 py-1 text-left">Venue</th>
                      <th className="px-2 py-1 text-left">City</th>
                      <th className="px-2 py-1 text-left">Lat</th>
                      <th className="px-2 py-1 text-left">Lng</th>
                      <th className="px-2 py-1 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {importRows.map((row, i) => (
                      <tr
                        key={i}
                        className={
                          row.error ? "bg-red-50/50 dark:bg-red-950/20" : ""
                        }
                      >
                        <td className="px-2 py-1 text-zinc-400">{i + 1}</td>
                        <td className="px-2 py-1">
                          {row.data.venue_name || "—"}
                        </td>
                        <td className="px-2 py-1">{row.data.city || "—"}</td>
                        <td className="px-2 py-1">
                          {row.data.latitude || "—"}
                        </td>
                        <td className="px-2 py-1">
                          {row.data.longitude || "—"}
                        </td>
                        <td className="px-2 py-1">
                          {row.error ? (
                            <span className="text-red-600 dark:text-red-400">
                              {row.error}
                            </span>
                          ) : (
                            <span className="text-green-600 dark:text-green-400">
                              OK
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importStep === "importing" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-8 w-8 rounded-full border-2 border-zinc-200 border-t-indigo-600 dark:border-zinc-700 dark:border-t-indigo-400"
              />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Importing {validCount} submissions...
              </p>
            </div>
          )}

          {importStep === "done" && importResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30"
            >
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                  Import Complete
                </h3>
              </div>
              <div className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-400">
                <p>Total rows: {importResult.total}</p>
                <p>Imported: {importResult.imported}</p>
                {importResult.duplicates > 0 && (
                  <p className="text-amber-600 dark:text-amber-400">
                    Duplicates skipped: {importResult.duplicates}
                  </p>
                )}
                {importResult.errors > 0 && (
                  <>
                    <p className="text-red-600 dark:text-red-400">
                      Errors: {importResult.errors}
                    </p>
                    <ul className="mt-1 list-inside list-disc text-xs text-red-500 dark:text-red-400">
                      {importResult.errorDetails.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {importStep === "error" && (
            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
              <p className="text-sm text-red-700 dark:text-red-400">
                {importError}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsImportOpen(false)}
            disabled={importStep === "importing"}
          >
            {importStep === "done" ? "Close" : "Cancel"}
          </Button>
          {importStep === "preview" && (
            <>
              <Button
                plain
                onClick={() => {
                  setImportStep("instructions");
                  setImportRows([]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Back
              </Button>
              {validCount > 0 && (
                <Button onClick={handleImport} color="indigo">
                  Import {validCount} submissions
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
