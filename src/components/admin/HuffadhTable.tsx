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

interface Hafidh {
  id: number;
  name: string;
  created_at: string;
}

export function HuffadhTable() {
  const [huffadh, setHuffadh] = useState<Hafidh[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedHafidh, setSelectedHafidh] = useState<Hafidh | null>(null);
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchHuffadh();
  }, []);

  const fetchHuffadh = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/huffadh");
      if (!response.ok) throw new Error("Failed to fetch huffadh");
      const data = await response.json();
      setHuffadh(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormError("");
    try {
      const response = await fetch("/api/admin/huffadh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create hafidh");
      }

      setIsCreateOpen(false);
      setFormName("");
      fetchHuffadh();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleEdit = async () => {
    if (!selectedHafidh) return;
    setFormError("");
    try {
      const response = await fetch("/api/admin/huffadh", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedHafidh.id, name: formName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update hafidh");
      }

      setIsEditOpen(false);
      setSelectedHafidh(null);
      setFormName("");
      fetchHuffadh();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedHafidh) return;
    try {
      const response = await fetch("/api/admin/huffadh", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedHafidh.id }),
      });

      if (!response.ok) throw new Error("Failed to delete hafidh");

      setIsDeleteOpen(false);
      setSelectedHafidh(null);
      fetchHuffadh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openCreate = () => {
    setFormName("");
    setFormError("");
    setIsCreateOpen(true);
  };

  const openEdit = (hafidh: Hafidh) => {
    setSelectedHafidh(hafidh);
    setFormName(hafidh.name);
    setFormError("");
    setIsEditOpen(true);
  };

  const openDelete = (hafidh: Hafidh) => {
    setSelectedHafidh(hafidh);
    setIsDeleteOpen(true);
  };

  if (loading) return <div>Loading huffadh...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Huffadh
        </h2>
        <Button onClick={openCreate} color="indigo">
          <PlusIcon data-slot="icon" />
          Add Hafidh
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {huffadh.map((hafidh) => (
            <TableRow key={hafidh.id}>
              <TableCell>{hafidh.id}</TableCell>
              <TableCell>{hafidh.name}</TableCell>
              <TableCell>
                {new Date(hafidh.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button plain onClick={() => openEdit(hafidh)}>
                    <PencilIcon data-slot="icon" />
                  </Button>
                  <Button plain onClick={() => openDelete(hafidh)}>
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
        <DialogTitle>Add Hafidh</DialogTitle>
        <DialogBody>
          <Field>
            <Label>Name</Label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter hafidh name"
            />
          </Field>
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
        <DialogTitle>Edit Hafidh</DialogTitle>
        <DialogBody>
          <Field>
            <Label>Name</Label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter hafidh name"
            />
          </Field>
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
        <DialogTitle>Delete Hafidh</DialogTitle>
        <DialogBody>
          Are you sure you want to delete {selectedHafidh?.name}? This action
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
