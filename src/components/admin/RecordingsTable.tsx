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
  ClipboardDocumentIcon,
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

  // SoundCloud paste-import dialog state
  const [isSCDialogOpen, setIsSCDialogOpen] = useState(false);
  const [scPasteValue, setSCPasteValue] = useState("");
  const [scStatus, setSCStatus] = useState<
    "instructions" | "preview" | "importing" | "error"
  >("instructions");
  const [scTracks, setSCTracks] = useState<{ title: string; url: string }[]>(
    [],
  );
  const [scNewCount, setSCNewCount] = useState(0);
  const [scExistingCount, setSCExistingCount] = useState(0);
  const [scError, setSCError] = useState("");

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

  // The console script the admin runs on SoundCloud to extract tracks
  const SC_EXTRACT_SCRIPT = `JSON.stringify([...document.querySelectorAll('li.soundList__item a.soundTitle__title, article a.soundTitle__title')].map(a=>({title:a.textContent.trim(),url:a.href.startsWith('http')?a.href:'https://soundcloud.com'+a.getAttribute('href')})).filter((v,i,s)=>s.findIndex(t=>t.url===v.url)===i))`;

  const handleFetchFromSoundCloud = () => {
    setSCStatus("instructions");
    setSCPasteValue("");
    setSCTracks([]);
    setSCNewCount(0);
    setSCExistingCount(0);
    setSCError("");
    setFetchResult(null);
    setError("");
    setIsSCDialogOpen(true);
  };

  const handleSCCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(SC_EXTRACT_SCRIPT);
    } catch {
      // Fallback: select the text
    }
  };

  // Parse pasted JSON and check for duplicates against existing recordings
  const handleSCParse = () => {
    setSCError("");
    try {
      const parsed = JSON.parse(scPasteValue);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setSCError("No tracks found in pasted data");
        return;
      }

      // Validate shape
      const tracks: { title: string; url: string }[] = parsed
        .filter(
          (t: any) =>
            typeof t.title === "string" &&
            typeof t.url === "string" &&
            t.title &&
            t.url,
        )
        .map((t: any) => ({ title: t.title, url: t.url }));

      if (tracks.length === 0) {
        setSCError("No valid tracks found in pasted data");
        return;
      }

      // Filter to Taraweeh tracks
      const taraweehTracks = tracks.filter((t) =>
        t.title.includes("Taraweeh 14"),
      );

      // Check which are already in the DB by comparing URLs
      const existingUrls = new Set(recordings.map((r) => r.url));
      let newCount = 0;
      let existingCount = 0;
      for (const t of taraweehTracks) {
        if (existingUrls.has(t.url)) {
          existingCount++;
        } else {
          newCount++;
        }
      }

      setSCTracks(taraweehTracks);
      setSCNewCount(newCount);
      setSCExistingCount(existingCount);
      setSCStatus("preview");
    } catch {
      setSCError("Invalid JSON. Make sure you copied the full output.");
    }
  };

  const handleSCImport = async () => {
    setSCStatus("importing");
    setIsFetchingSoundCloud(true);
    try {
      const response = await fetch("/api/admin/soundcloud-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks: scTracks }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to import SoundCloud tracks");
      }

      const result = await response.json();
      setFetchResult({ ...result, source: "SoundCloud" });
      setIsSCDialogOpen(false);
      fetchData();
    } catch (err: any) {
      setSCError(err.message);
      setSCStatus("error");
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
          <Button
            onClick={handleFetchFromYouTube}
            color="red"
            disabled={isFetchingYouTube || isFetchingSoundCloud}
          >
            <CloudArrowDownIcon data-slot="icon" />
            {isFetchingYouTube ? "Fetching..." : "Fetch from YouTube"}
          </Button>
          {/* SoundCloud fetch uses client-side widget — works in production */}
          <Button
            onClick={handleFetchFromSoundCloud}
            color="zinc"
            disabled={isFetchingSoundCloud || isFetchingYouTube}
          >
            <CloudArrowDownIcon data-slot="icon" />
            {isFetchingSoundCloud ? "Fetching..." : "Fetch from SoundCloud"}
          </Button>
          <Button onClick={openCreate} color="indigo">
            <PlusIcon data-slot="icon" />
            Add Recording
          </Button>
        </div>
      </div>

      {/* Fetch Result Alert */}
      {fetchResult && (
        <div className="mb-4 rounded-[var(--radius-md)] bg-notification-success-soft p-4 dark:bg-[#003320]">
          <h3 className="text-sm font-medium text-notification-success dark:text-[#09d087]">
            {fetchResult.source || "Import"} Import Complete
          </h3>
          <div className="mt-2 text-sm text-notification-success dark:text-[#09d087]">
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

      {/* SoundCloud Paste-Import Dialog */}
      <Dialog
        open={isSCDialogOpen}
        onClose={() => {
          if (scStatus !== "importing") setIsSCDialogOpen(false);
        }}
        size="2xl"
      >
        <DialogTitle>Fetch from SoundCloud</DialogTitle>
        <DialogBody>
          {scStatus === "instructions" && (
            <div className="space-y-4">
              <div className="rounded-[var(--radius-md)] bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-white">
                  Steps:
                </p>
                <ol className="list-inside list-decimal space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>
                    Open{" "}
                    <a
                      href="https://soundcloud.com/aswaatulqurraa/tracks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline dark:text-indigo-400"
                    >
                      soundcloud.com/aswaatulqurraa/tracks
                    </a>{" "}
                    in a new tab
                  </li>
                  <li>Scroll to the bottom to load all tracks</li>
                  <li>Open the browser console (F12) and paste this script:</li>
                </ol>
                <div className="mt-3 flex items-start gap-2">
                  <code className="block flex-1 overflow-x-auto rounded bg-zinc-900 p-2 text-xs text-zinc-100 dark:bg-black">
                    copy({SC_EXTRACT_SCRIPT})
                  </code>
                  <Button
                    plain
                    onClick={handleSCCopyScript}
                    title="Copy script"
                  >
                    <ClipboardDocumentIcon data-slot="icon" />
                  </Button>
                </div>
                <ol
                  start={4}
                  className="mt-2 list-inside list-decimal space-y-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <li>The track data is now on your clipboard</li>
                  <li>Paste it in the box below</li>
                </ol>
              </div>

              <Field>
                <Label>Paste track data (JSON)</Label>
                <Textarea
                  value={scPasteValue}
                  onChange={(e) => setSCPasteValue(e.target.value)}
                  placeholder='[{"title":"...","url":"..."},...]'
                  rows={4}
                />
              </Field>

              {scError && (
                <div className="rounded-[var(--radius-md)] bg-red-50 p-3 dark:bg-red-950/30">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {scError}
                  </p>
                </div>
              )}
            </div>
          )}

          {scStatus === "preview" && (
            <div className="space-y-3">
              <div className="flex gap-4 text-sm">
                <span className="text-zinc-900 dark:text-white">
                  Total Taraweeh tracks: <strong>{scTracks.length}</strong>
                </span>
                <span className="text-green-700 dark:text-green-400">
                  New: <strong>{scNewCount}</strong>
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Already imported: <strong>{scExistingCount}</strong>
                </span>
              </div>
              {scNewCount === 0 ? (
                <div className="rounded-[var(--radius-md)] bg-yellow-50 p-3 dark:bg-yellow-950/30">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    All {scTracks.length} tracks are already in the database.
                    Nothing new to import.
                  </p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-[var(--radius-md)] border border-zinc-200 dark:border-zinc-700">
                  <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {scTracks.map((t, i) => {
                      const isExisting = recordings.some(
                        (r) => r.url === t.url,
                      );
                      return (
                        <li
                          key={i}
                          className={`px-3 py-2 text-xs ${isExisting ? "text-zinc-400 line-through dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}
                        >
                          {t.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}

          {scStatus === "importing" && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Importing {scNewCount} new tracks to database...
            </p>
          )}

          {scStatus === "error" && scTracks.length > 0 && (
            <div className="rounded-[var(--radius-md)] bg-red-50 p-3 dark:bg-red-950/30">
              <p className="text-sm text-red-700 dark:text-red-400">
                {scError}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsSCDialogOpen(false)}
            disabled={scStatus === "importing"}
          >
            Cancel
          </Button>
          {scStatus === "instructions" && (
            <Button
              onClick={handleSCParse}
              color="indigo"
              disabled={!scPasteValue.trim()}
            >
              Preview
            </Button>
          )}
          {scStatus === "preview" && (
            <>
              <Button
                plain
                onClick={() => {
                  setSCStatus("instructions");
                  setSCTracks([]);
                }}
              >
                Back
              </Button>
              {scNewCount > 0 && (
                <Button onClick={handleSCImport} color="indigo">
                  Import {scNewCount} new tracks
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
