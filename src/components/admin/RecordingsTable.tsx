import { useState, useEffect } from "react";
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
import { RecordingCard } from "./RecordingCard";
import { ArabesquePattern } from "../patterns/OttomanBorder";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-amber-800 dark:text-amber-200 font-serif">
            Loading recordings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-600 dark:text-red-400 font-semibold">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background arabesque pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10">
        <ArabesquePattern className="w-full h-full text-amber-700" />
      </div>

      {/* Header with Ottoman-inspired styling */}
      <div className="relative mb-8 flex items-center justify-between pb-4 border-b-2 border-amber-600/30">
        <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 font-serif flex items-center gap-3">
          <span className="inline-block w-2 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
          Taraweeh Recordings
          <span className="inline-block w-2 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
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

      {/* Fetch Result Alert - Ottoman styled */}
      {fetchResult && (
        <div className="relative mb-6 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10 p-6 border-2 border-teal-500/30 shadow-lg">
          <div className="absolute top-2 right-2 w-6 h-6 text-teal-600 dark:text-teal-400 opacity-30">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 font-serif mb-3">
            {fetchResult.source || "Import"} Import Complete
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/50 dark:bg-black/20 rounded-md p-3">
              <p className="text-teal-600 dark:text-teal-400 font-semibold">
                Total Found
              </p>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                {fetchResult.total}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-md p-3">
              <p className="text-teal-600 dark:text-teal-400 font-semibold">
                ✅ Imported
              </p>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                {fetchResult.imported}
              </p>
            </div>
            {fetchResult.updated !== undefined && fetchResult.updated > 0 && (
              <div className="bg-white/50 dark:bg-black/20 rounded-md p-3">
                <p className="text-teal-600 dark:text-teal-400 font-semibold">
                  🔄 Updated
                </p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                  {fetchResult.updated}
                </p>
              </div>
            )}
            {fetchResult.errors > 0 && (
              <div className="bg-white/50 dark:bg-black/20 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  ❌ Errors
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {fetchResult.errors}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card Grid - Responsive Ottoman Layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordings.map((recording) => (
          <RecordingCard
            key={recording.id}
            recording={recording}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        ))}
      </div>

      {/* Empty state */}
      {recordings.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block w-24 h-24 mb-4 text-amber-300 dark:text-amber-700 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <p className="text-xl text-amber-800 dark:text-amber-200 font-serif">
            No recordings yet
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Add your first Taraweeh recording to get started
          </p>
        </div>
      )}

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
