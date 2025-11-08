import { c as createComponent, d as createAstro, i as renderHead, j as renderComponent, r as renderTemplate } from '../../chunks/astro/server_VjCsmGoa.mjs';
/* empty css                                    */
import { B as Button, T as Table, a as TableHead, b as TableRow, c as TableHeader, d as TableBody, e as TableCell, D as Dialog, f as DialogTitle, g as DialogBody, F as Field, L as Label, I as Input, E as ErrorMessage, h as DialogActions, A as AdminLayout } from '../../chunks/input_BQVwCxwR.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { g as getAuth } from '../../chunks/auth_BXYO-Ari.mjs';
export { renderers } from '../../renderers.mjs';

function VenuesTable() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
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
    } catch (err) {
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
        body: JSON.stringify({ name: formName, city: formCity })
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(error2.error || "Failed to create venue");
      }
      setIsCreateOpen(false);
      setFormName("");
      setFormCity("");
      fetchVenues();
    } catch (err) {
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
          city: formCity
        })
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(error2.error || "Failed to update venue");
      }
      setIsEditOpen(false);
      setSelectedVenue(null);
      setFormName("");
      setFormCity("");
      fetchVenues();
    } catch (err) {
      setFormError(err.message);
    }
  };
  const handleDelete = async () => {
    if (!selectedVenue) return;
    try {
      const response = await fetch("/api/admin/venues", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedVenue.id })
      });
      if (!response.ok) throw new Error("Failed to delete venue");
      setIsDeleteOpen(false);
      setSelectedVenue(null);
      fetchVenues();
    } catch (err) {
      setError(err.message);
    }
  };
  const openCreate = () => {
    setFormName("");
    setFormCity("");
    setFormError("");
    setIsCreateOpen(true);
  };
  const openEdit = (venue) => {
    setSelectedVenue(venue);
    setFormName(venue.name);
    setFormCity(venue.city);
    setFormError("");
    setIsEditOpen(true);
  };
  const openDelete = (venue) => {
    setSelectedVenue(venue);
    setIsDeleteOpen(true);
  };
  if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading venues..." });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "text-red-600", children: [
    "Error: ",
    error
  ] });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900 dark:text-white", children: "Venues" }),
      /* @__PURE__ */ jsxs(Button, { onClick: openCreate, color: "indigo", children: [
        /* @__PURE__ */ jsx(PlusIcon, { "data-slot": "icon" }),
        "Add Venue"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: "ID" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Name" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "City" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Created" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: venues.map((venue) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: venue.id }),
        /* @__PURE__ */ jsx(TableCell, { children: venue.name }),
        /* @__PURE__ */ jsx(TableCell, { children: venue.city }),
        /* @__PURE__ */ jsx(TableCell, { children: new Date(venue.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => openEdit(venue), children: /* @__PURE__ */ jsx(PencilIcon, { "data-slot": "icon" }) }),
          /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => openDelete(venue), children: /* @__PURE__ */ jsx(TrashIcon, { "data-slot": "icon", className: "text-red-600" }) })
        ] }) })
      ] }, venue.id)) })
    ] }),
    /* @__PURE__ */ jsxs(Dialog, { open: isCreateOpen, onClose: setIsCreateOpen, children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Add Venue" }),
      /* @__PURE__ */ jsxs(DialogBody, { children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(Field, { children: [
            /* @__PURE__ */ jsx(Label, { children: "Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formName,
                onChange: (e) => setFormName(e.target.value),
                placeholder: "Enter venue name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Field, { children: [
            /* @__PURE__ */ jsx(Label, { children: "City" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formCity,
                onChange: (e) => setFormCity(e.target.value),
                placeholder: "Enter city name"
              }
            )
          ] })
        ] }),
        formError && /* @__PURE__ */ jsx(ErrorMessage, { children: formError })
      ] }),
      /* @__PURE__ */ jsxs(DialogActions, { children: [
        /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => setIsCreateOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleCreate, color: "indigo", children: "Create" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Dialog, { open: isEditOpen, onClose: setIsEditOpen, children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Venue" }),
      /* @__PURE__ */ jsxs(DialogBody, { children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(Field, { children: [
            /* @__PURE__ */ jsx(Label, { children: "Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formName,
                onChange: (e) => setFormName(e.target.value),
                placeholder: "Enter venue name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Field, { children: [
            /* @__PURE__ */ jsx(Label, { children: "City" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formCity,
                onChange: (e) => setFormCity(e.target.value),
                placeholder: "Enter city name"
              }
            )
          ] })
        ] }),
        formError && /* @__PURE__ */ jsx(ErrorMessage, { children: formError })
      ] }),
      /* @__PURE__ */ jsxs(DialogActions, { children: [
        /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => setIsEditOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleEdit, color: "indigo", children: "Save" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Dialog, { open: isDeleteOpen, onClose: setIsDeleteOpen, children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Delete Venue" }),
      /* @__PURE__ */ jsxs(DialogBody, { children: [
        "Are you sure you want to delete ",
        selectedVenue?.name,
        "? This action cannot be undone."
      ] }),
      /* @__PURE__ */ jsxs(DialogActions, { children: [
        /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => setIsDeleteOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleDelete, color: "red", children: "Delete" })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Venues = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Venues;
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: Astro2.request.headers
  });
  if (!session) {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate`<html lang="en" class="h-full"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Venues - Admin</title>${renderHead()}</head> <body class="h-full"> ${renderComponent($$result, "AdminLayout", AdminLayout, { "client:load": true, "currentPage": "venues", "client:component-hydration": "load", "client:component-path": "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/AdminLayout", "client:component-export": "AdminLayout" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "VenuesTable", VenuesTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/VenuesTable", "client:component-export": "VenuesTable" })} ` })} </body></html>`;
}, "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/venues.astro", void 0);

const $$file = "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/venues.astro";
const $$url = "/admin/venues";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Venues,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
