import { useState, useEffect } from "react";
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
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

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
  whatsapp_number: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

type StatusTab = "pending" | "approved" | "rejected";

export function VenueSubmissionsTable() {
  const [submissions, setSubmissions] = useState<VenueSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("pending");

  // Approve dialog
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<VenueSubmission | null>(
    null,
  );
  const [approveName, setApproveName] = useState("");
  const [approveCity, setApproveCity] = useState("");
  const [approveError, setApproveError] = useState("");

  // Reject dialog
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<VenueSubmission | null>(
    null,
  );
  const [rejectNotes, setRejectNotes] = useState("");

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VenueSubmission | null>(
    null,
  );

  useEffect(() => {
    fetchSubmissions();
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

  const openApprove = (sub: VenueSubmission) => {
    setApproveTarget(sub);
    setApproveName(
      sub.sub_venue_name
        ? `${sub.venue_name} — ${sub.sub_venue_name}`
        : sub.venue_name,
    );
    setApproveCity(sub.city);
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
          final_name: approveName,
          city: approveCity,
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

  const TABS: { label: string; value: StatusTab }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
          Venue Submissions
        </h2>
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

      {loading && <div>Loading submissions...</div>}
      {error && <div className="text-red-600 mb-3">Error: {error}</div>}

      {!loading && submissions.length === 0 && (
        <div className="text-zinc-500 dark:text-zinc-400 py-8 text-center">
          No {activeTab} submissions
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
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
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
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
                    <a
                      href={`https://wa.me/${sub.whatsapp_number.replace(/^\+/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      {sub.whatsapp_number}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm">
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
                        <TrashIcon data-slot="icon" className="text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onClose={setIsApproveOpen}>
        <DialogTitle>Approve Venue Submission</DialogTitle>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Confirm the final venue name and city. This will create a new entry
            in the venues directory.
          </p>
          <div className="space-y-4">
            <Field>
              <Label>Venue Name</Label>
              <Input
                value={approveName}
                onChange={(e) => setApproveName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>City</Label>
              <Input
                value={approveCity}
                onChange={(e) => setApproveCity(e.target.value)}
              />
            </Field>
          </div>
          {approveTarget && (
            <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm">
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
          <Button
            onClick={handleApprove}
            color="indigo"
            disabled={!approveName.trim() || !approveCity.trim()}
          >
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
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

      {/* Delete Dialog */}
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
    </div>
  );
}
