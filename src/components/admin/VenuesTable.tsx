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
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Venue {
  id: number;
  name: string;
  city: string;
  created_at: string;
}

export function VenuesTable() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/venues");
      if (!response.ok) throw new Error("Failed to fetch venues");
      const data = await response.json();
      setVenues(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormError("");
    try {
      const response = await fetch("/api/admin/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, city: formCity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create venue");
      }

      setIsCreateOpen(false);
      setFormName("");
      setFormCity("");
      fetchVenues();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleEdit = async () => {
    if (!selectedVenue) return;
    setFormError("");
    try {
      const response = await fetch("/api/admin/venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedVenue.id,
          name: formName,
          city: formCity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update venue");
      }

      setIsEditOpen(false);
      setSelectedVenue(null);
      setFormName("");
      setFormCity("");
      fetchVenues();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedVenue) return;
    try {
      const response = await fetch("/api/admin/venues", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedVenue.id }),
      });

      if (!response.ok) throw new Error("Failed to delete venue");

      setIsDeleteOpen(false);
      setSelectedVenue(null);
      fetchVenues();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openCreate = () => {
    setFormName("");
    setFormCity("");
    setFormError("");
    setIsCreateOpen(true);
  };

  const openEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    setFormName(venue.name);
    setFormCity(venue.city);
    setFormError("");
    setIsEditOpen(true);
  };

  const openDelete = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsDeleteOpen(true);
  };

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Venues
        </h2>
        <Button onClick={openCreate} color="indigo">
          <PlusIcon data-slot="icon" />
          Add Venue
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>City</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell>{venue.id}</TableCell>
              <TableCell>{venue.name}</TableCell>
              <TableCell>{venue.city}</TableCell>
              <TableCell>
                {new Date(venue.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button plain onClick={() => openEdit(venue)}>
                    <PencilIcon data-slot="icon" />
                  </Button>
                  <Button plain onClick={() => openDelete(venue)}>
                    <TrashIcon data-slot="icon" className="text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onClose={setIsCreateOpen}>
        <DialogTitle>Add Venue</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <Field>
              <Label>Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter venue name"
              />
            </Field>
            <Field>
              <Label>City</Label>
              <Input
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Enter city name"
              />
            </Field>
          </div>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsCreateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} color="indigo">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onClose={setIsEditOpen}>
        <DialogTitle>Edit Venue</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <Field>
              <Label>Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter venue name"
              />
            </Field>
            <Field>
              <Label>City</Label>
              <Input
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Enter city name"
              />
            </Field>
          </div>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit} color="indigo">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onClose={setIsDeleteOpen}>
        <DialogTitle>Delete Venue</DialogTitle>
        <DialogBody>
          Are you sure you want to delete {selectedVenue?.name}? This action
          cannot be undone.
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
