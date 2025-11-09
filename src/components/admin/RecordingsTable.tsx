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
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/24/outline";

interface Recording {
  id: number;
  hafidh_id: number;
  venue_id: number;
  hijri_year: number;
  url: string;
  source: string;
  audio_url?: string;
  section?: string;
  title?: string;
  description?: string;
  hafidh_name: string;
  venue_name: string;
  city: string;
}

interface Hafidh {
  id: number;
  name: string;
}

interface Venue {
  id: number;
  name: string;
  city: string;
}

export function RecordingsTable() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [huffadh, setHuffadh] = useState<Hafidh[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null,
  );
  const [formData, setFormData] = useState({
    hafidh_id: "",
    venue_id: "",
    hijri_year: "",
    url: "",
    source: "youtube",
    audio_url: "",
    section: "",
    title: "",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [isFetchingSoundCloud, setIsFetchingSoundCloud] = useState(false);
  const [isFetchingYouTube, setIsFetchingYouTube] = useState(false);
  const [fetchResult, setFetchResult] = useState<{
    total: number;
    imported: number;
    updated?: number;
    skipped: number;
    errors: number;
    source?: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordingsRes, huffadhRes, venuesRes] = await Promise.all([
        fetch("/api/admin/recordings"),
        fetch("/api/admin/huffadh"),
        fetch("/api/admin/venues"),
      ]);

      if (!recordingsRes.ok || !huffadhRes.ok || !venuesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [recordingsData, huffadhData, venuesData] = await Promise.all([
        recordingsRes.json(),
        huffadhRes.json(),
        venuesRes.json(),
      ]);

      setRecordings(recordingsData);
      setHuffadh(huffadhData);
      setVenues(venuesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormError("");
    try {
      const response = await fetch("/api/admin/recordings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hafidh_id: parseInt(formData.hafidh_id),
          venue_id: parseInt(formData.venue_id),
          hijri_year: parseInt(formData.hijri_year),
          url: formData.url,
          source: formData.source,
          audio_url: formData.audio_url || null,
          section: formData.section || null,
          title: formData.title || null,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create recording");
      }

      setIsCreateOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleEdit = async () => {
    if (!selectedRecording) return;
    setFormError("");
    try {
      const response = await fetch("/api/admin/recordings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRecording.id,
          hafidh_id: parseInt(formData.hafidh_id),
          venue_id: parseInt(formData.venue_id),
          hijri_year: parseInt(formData.hijri_year),
          url: formData.url,
          source: formData.source,
          audio_url: formData.audio_url || null,
          section: formData.section || null,
          title: formData.title || null,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update recording");
      }

      setIsEditOpen(false);
      setSelectedRecording(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecording) return;
    try {
      const response = await fetch("/api/admin/recordings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRecording.id }),
      });

      if (!response.ok) throw new Error("Failed to delete recording");

      setIsDeleteOpen(false);
      setSelectedRecording(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      hafidh_id: "",
      venue_id: "",
      hijri_year: "",
      url: "",
      source: "youtube",
      audio_url: "",
      section: "",
      title: "",
      description: "",
    });
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEdit = (recording: Recording) => {
    setSelectedRecording(recording);
    setFormData({
      hafidh_id: recording.hafidh_id.toString(),
      venue_id: recording.venue_id.toString(),
      hijri_year: recording.hijri_year.toString(),
      url: recording.url,
      source: recording.source,
      audio_url: recording.audio_url || "",
      section: recording.section || "",
      title: recording.title || "",
      description: recording.description || "",
    });
    setFormError("");
    setIsEditOpen(true);
  };

  const openDelete = (recording: Recording) => {
    setSelectedRecording(recording);
    setIsDeleteOpen(true);
  };

  const handleFetchFromSoundCloud = async () => {
    setIsFetchingSoundCloud(true);
    setFetchResult(null);
    setError("");
    try {
      const response = await fetch("/api/admin/soundcloud-fetch", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch SoundCloud tracks");
      }

      const result = await response.json();
      setFetchResult({ ...result, source: "SoundCloud" });
      fetchData(); // Refresh the recordings list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFetchingSoundCloud(false);
    }
  };

  const handleFetchFromYouTube = async () => {
    setIsFetchingYouTube(true);
    setFetchResult(null);
    setError("");
    try {
      const response = await fetch("/api/admin/youtube-fetch", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch YouTube videos");
      }

      const result = await response.json();
      setFetchResult({ ...result, source: "YouTube" });
      fetchData(); // Refresh the recordings list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFetchingYouTube(false);
    }
  };

  if (loading) return <div>Loading recordings...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Recordings
        </h2>
        <div className="flex gap-2">
          {/* Fetch buttons only available in development (Puppeteer doesn't work on Netlify) */}
          {import.meta.env.DEV && (
            <>
              <Button
                onClick={handleFetchFromYouTube}
                color="red"
                disabled={isFetchingYouTube || isFetchingSoundCloud}
              >
                <CloudArrowDownIcon data-slot="icon" />
                {isFetchingYouTube ? "Fetching..." : "Fetch from YouTube"}
              </Button>
              <Button
                onClick={handleFetchFromSoundCloud}
                color="teal"
                disabled={isFetchingSoundCloud || isFetchingYouTube}
              >
                <CloudArrowDownIcon data-slot="icon" />
                {isFetchingSoundCloud ? "Fetching..." : "Fetch from SoundCloud"}
              </Button>
            </>
          )}
          <Button onClick={openCreate} color="indigo">
            <PlusIcon data-slot="icon" />
            Add Recording
          </Button>
        </div>
      </div>

      {/* Fetch Result Alert */}
      {fetchResult && (
        <div className="mb-4 rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
          <h3 className="text-sm font-medium text-teal-800 dark:text-teal-200">
            {fetchResult.source || "Import"} Import Complete
          </h3>
          <div className="mt-2 text-sm text-teal-700 dark:text-teal-300">
            <p>Total found: {fetchResult.total}</p>
            <p>✅ Imported (new): {fetchResult.imported}</p>
            {fetchResult.updated !== undefined && fetchResult.updated > 0 && (
              <p>🔄 Updated (existing): {fetchResult.updated}</p>
            )}
            {fetchResult.skipped > 0 && (
              <p>⏭️ Skipped: {fetchResult.skipped}</p>
            )}
            {fetchResult.errors > 0 && (
              <p className="text-red-600">❌ Errors: {fetchResult.errors}</p>
            )}
          </div>
        </div>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Hafidh</TableHeader>
            <TableHeader>Venue</TableHeader>
            <TableHeader>Year</TableHeader>
            <TableHeader>Source</TableHeader>
            <TableHeader>Section</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {recordings.map((recording) => (
            <TableRow key={recording.id}>
              <TableCell>{recording.id}</TableCell>
              <TableCell>{recording.hafidh_name}</TableCell>
              <TableCell>
                {recording.venue_name}, {recording.city}
              </TableCell>
              <TableCell>{recording.hijri_year}</TableCell>
              <TableCell>{recording.source}</TableCell>
              <TableCell>{recording.section || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button plain onClick={() => openEdit(recording)}>
                    <PencilIcon data-slot="icon" />
                  </Button>
                  <Button plain onClick={() => openDelete(recording)}>
                    <TrashIcon data-slot="icon" className="text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateOpen || isEditOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setIsEditOpen(false);
        }}
      >
        <DialogTitle>
          {isCreateOpen ? "Add Recording" : "Edit Recording"}
        </DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <Field>
              <Label>Hafidh</Label>
              <Select
                value={formData.hafidh_id}
                onChange={(e) =>
                  setFormData({ ...formData, hafidh_id: e.target.value })
                }
              >
                <option value="">Select Hafidh</option>
                {huffadh.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>Venue</Label>
              <Select
                value={formData.venue_id}
                onChange={(e) =>
                  setFormData({ ...formData, venue_id: e.target.value })
                }
              >
                <option value="">Select Venue</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}, {v.city}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>Hijri Year</Label>
              <Input
                type="number"
                value={formData.hijri_year}
                onChange={(e) =>
                  setFormData({ ...formData, hijri_year: e.target.value })
                }
                placeholder="e.g., 1445"
              />
            </Field>

            <Field>
              <Label>URL</Label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
            </Field>

            <Field>
              <Label>Source</Label>
              <Select
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
              >
                <option value="youtube">YouTube</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="direct">Direct</option>
              </Select>
            </Field>

            <Field>
              <Label>Audio URL (optional)</Label>
              <Input
                type="url"
                value={formData.audio_url}
                onChange={(e) =>
                  setFormData({ ...formData, audio_url: e.target.value })
                }
                placeholder="https://..."
              />
            </Field>

            <Field>
              <Label>Section (optional)</Label>
              <Input
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                placeholder="e.g., 1-10"
              />
            </Field>

            <Field>
              <Label>Title (optional)</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Recording title"
              />
            </Field>

            <Field>
              <Label>Description (optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Recording description"
                rows={3}
              />
            </Field>
          </div>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsCreateOpen(false);
              setIsEditOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={isCreateOpen ? handleCreate : handleEdit}
            color="indigo"
          >
            {isCreateOpen ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onClose={setIsDeleteOpen}>
        <DialogTitle>Delete Recording</DialogTitle>
        <DialogBody>
          Are you sure you want to delete this recording? This action cannot be
          undone.
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
