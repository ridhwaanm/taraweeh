import { c as createComponent, d as createAstro, i as renderHead, j as renderComponent, r as renderTemplate } from '../../chunks/astro/server_VjCsmGoa.mjs';
/* empty css                                    */
import { B as Button, T as Table, a as TableHead, b as TableRow, c as TableHeader, d as TableBody, e as TableCell, D as Dialog, f as DialogTitle, g as DialogBody, F as Field, L as Label, I as Input, E as ErrorMessage, h as DialogActions, A as AdminLayout } from '../../chunks/input_BQVwCxwR.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { forwardRef, useState, useEffect } from 'react';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { CloudArrowDownIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { g as getAuth } from '../../chunks/auth_DIpvoUV_.mjs';
export { renderers } from '../../renderers.mjs';

const Select = forwardRef(function Select2({ className, multiple, ...props }, ref) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "data-slot": "control",
      className: clsx([
        className,
        // Basic layout
        "group relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-data-focus:after:ring-2 has-data-focus:after:ring-blue-500",
        // Disabled state
        "has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none"
      ]),
      children: [
        /* @__PURE__ */ jsx(
          Headless.Select,
          {
            ref,
            multiple,
            ...props,
            className: clsx([
              // Basic layout
              "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
              // Horizontal padding
              multiple ? "px-[calc(--spacing(3.5)-1px)] sm:px-[calc(--spacing(3)-1px)]" : "pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]",
              // Options (multi-select)
              "[&_optgroup]:font-semibold",
              // Typography
              "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white",
              // Border
              "border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20",
              // Background color
              "bg-transparent dark:bg-white/5 dark:*:bg-zinc-800",
              // Hide default focus styles
              "focus:outline-hidden",
              // Invalid state
              "data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600",
              // Disabled state
              "data-disabled:border-zinc-950/20 data-disabled:opacity-100 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/2.5 dark:data-hover:data-disabled:border-white/15"
            ])
          }
        ),
        !multiple && /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            className: "size-5 stroke-zinc-500 group-has-data-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]",
            viewBox: "0 0 16 16",
            "aria-hidden": "true",
            fill: "none",
            children: [
              /* @__PURE__ */ jsx("path", { d: "M5.75 10.75L8 13L10.25 10.75", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }),
              /* @__PURE__ */ jsx("path", { d: "M10.25 5.25L8 3L5.75 5.25", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })
            ]
          }
        ) })
      ]
    }
  );
});

const Textarea = forwardRef(function Textarea2({
  className,
  resizable = true,
  ...props
}, ref) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "control",
      className: clsx([
        className,
        // Basic layout
        "relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500",
        // Disabled state
        "has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none"
      ]),
      children: /* @__PURE__ */ jsx(
        Headless.Textarea,
        {
          ref,
          ...props,
          className: clsx([
            // Basic layout
            "relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
            // Typography
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
            // Border
            "border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Hide default focus styles
            "focus:outline-hidden",
            // Invalid state
            "data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600",
            // Disabled state
            "disabled:border-zinc-950/20 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:data-hover:disabled:border-white/15",
            // Resizable
            resizable ? "resize-y" : "resize-none"
          ])
        }
      )
    }
  );
});

function RecordingsTable() {
  const [recordings, setRecordings] = useState([]);
  const [huffadh, setHuffadh] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(
    null
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
    description: ""
  });
  const [formError, setFormError] = useState("");
  const [isFetchingSoundCloud, setIsFetchingSoundCloud] = useState(false);
  const [isFetchingYouTube, setIsFetchingYouTube] = useState(false);
  const [fetchResult, setFetchResult] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordingsRes, huffadhRes, venuesRes] = await Promise.all([
        fetch("/api/admin/recordings"),
        fetch("/api/admin/huffadh"),
        fetch("/api/admin/venues")
      ]);
      if (!recordingsRes.ok || !huffadhRes.ok || !venuesRes.ok) {
        throw new Error("Failed to fetch data");
      }
      const [recordingsData, huffadhData, venuesData] = await Promise.all([
        recordingsRes.json(),
        huffadhRes.json(),
        venuesRes.json()
      ]);
      setRecordings(recordingsData);
      setHuffadh(huffadhData);
      setVenues(venuesData);
    } catch (err) {
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
          description: formData.description || null
        })
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(error2.error || "Failed to create recording");
      }
      setIsCreateOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
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
          description: formData.description || null
        })
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(error2.error || "Failed to update recording");
      }
      setIsEditOpen(false);
      setSelectedRecording(null);
      resetForm();
      fetchData();
    } catch (err) {
      setFormError(err.message);
    }
  };
  const handleDelete = async () => {
    if (!selectedRecording) return;
    try {
      const response = await fetch("/api/admin/recordings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRecording.id })
      });
      if (!response.ok) throw new Error("Failed to delete recording");
      setIsDeleteOpen(false);
      setSelectedRecording(null);
      fetchData();
    } catch (err) {
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
      description: ""
    });
    setFormError("");
  };
  const openCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };
  const openEdit = (recording) => {
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
      description: recording.description || ""
    });
    setFormError("");
    setIsEditOpen(true);
  };
  const openDelete = (recording) => {
    setSelectedRecording(recording);
    setIsDeleteOpen(true);
  };
  const handleFetchFromSoundCloud = async () => {
    setIsFetchingSoundCloud(true);
    setFetchResult(null);
    setError("");
    try {
      const response = await fetch("/api/admin/soundcloud-fetch", {
        method: "POST"
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(error2.error || "Failed to fetch SoundCloud tracks");
      }
      const result = await response.json();
      setFetchResult({ ...result, source: "SoundCloud" });
      fetchData();
    } catch (err) {
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
        method: "POST"
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(error2.error || "Failed to fetch YouTube videos");
      }
      const result = await response.json();
      setFetchResult({ ...result, source: "YouTube" });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetchingYouTube(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading recordings..." });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "text-red-600", children: [
    "Error: ",
    error
  ] });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900 dark:text-white", children: "Recordings" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleFetchFromYouTube,
            color: "red",
            disabled: isFetchingYouTube || isFetchingSoundCloud,
            children: [
              /* @__PURE__ */ jsx(CloudArrowDownIcon, { "data-slot": "icon" }),
              isFetchingYouTube ? "Fetching..." : "Fetch from YouTube"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleFetchFromSoundCloud,
            color: "teal",
            disabled: isFetchingSoundCloud || isFetchingYouTube,
            children: [
              /* @__PURE__ */ jsx(CloudArrowDownIcon, { "data-slot": "icon" }),
              isFetchingSoundCloud ? "Fetching..." : "Fetch from SoundCloud"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: openCreate, color: "indigo", children: [
          /* @__PURE__ */ jsx(PlusIcon, { "data-slot": "icon" }),
          "Add Recording"
        ] })
      ] })
    ] }),
    fetchResult && /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-teal-800 dark:text-teal-200", children: [
        fetchResult.source || "Import",
        " Import Complete"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm text-teal-700 dark:text-teal-300", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Total found: ",
          fetchResult.total
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "✅ Imported (new): ",
          fetchResult.imported
        ] }),
        fetchResult.updated !== void 0 && fetchResult.updated > 0 && /* @__PURE__ */ jsxs("p", { children: [
          "🔄 Updated (existing): ",
          fetchResult.updated
        ] }),
        fetchResult.skipped > 0 && /* @__PURE__ */ jsxs("p", { children: [
          "⏭️ Skipped: ",
          fetchResult.skipped
        ] }),
        fetchResult.errors > 0 && /* @__PURE__ */ jsxs("p", { className: "text-red-600", children: [
          "❌ Errors: ",
          fetchResult.errors
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: "ID" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Hafidh" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Venue" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Year" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Source" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Section" }),
        /* @__PURE__ */ jsx(TableHeader, { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: recordings.map((recording) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: recording.id }),
        /* @__PURE__ */ jsx(TableCell, { children: recording.hafidh_name }),
        /* @__PURE__ */ jsxs(TableCell, { children: [
          recording.venue_name,
          ", ",
          recording.city
        ] }),
        /* @__PURE__ */ jsx(TableCell, { children: recording.hijri_year }),
        /* @__PURE__ */ jsx(TableCell, { children: recording.source }),
        /* @__PURE__ */ jsx(TableCell, { children: recording.section || "-" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => openEdit(recording), children: /* @__PURE__ */ jsx(PencilIcon, { "data-slot": "icon" }) }),
          /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => openDelete(recording), children: /* @__PURE__ */ jsx(TrashIcon, { "data-slot": "icon", className: "text-red-600" }) })
        ] }) })
      ] }, recording.id)) })
    ] }),
    /* @__PURE__ */ jsxs(
      Dialog,
      {
        open: isCreateOpen || isEditOpen,
        onClose: () => {
          setIsCreateOpen(false);
          setIsEditOpen(false);
        },
        children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: isCreateOpen ? "Add Recording" : "Edit Recording" }),
          /* @__PURE__ */ jsxs(DialogBody, { children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Hafidh" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.hafidh_id,
                    onChange: (e) => setFormData({ ...formData, hafidh_id: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Hafidh" }),
                      huffadh.map((h) => /* @__PURE__ */ jsx("option", { value: h.id, children: h.name }, h.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Venue" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.venue_id,
                    onChange: (e) => setFormData({ ...formData, venue_id: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Venue" }),
                      venues.map((v) => /* @__PURE__ */ jsxs("option", { value: v.id, children: [
                        v.name,
                        ", ",
                        v.city
                      ] }, v.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Hijri Year" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: formData.hijri_year,
                    onChange: (e) => setFormData({ ...formData, hijri_year: e.target.value }),
                    placeholder: "e.g., 1445"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "URL" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "url",
                    value: formData.url,
                    onChange: (e) => setFormData({ ...formData, url: e.target.value }),
                    placeholder: "https://..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Source" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.source,
                    onChange: (e) => setFormData({ ...formData, source: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "youtube", children: "YouTube" }),
                      /* @__PURE__ */ jsx("option", { value: "soundcloud", children: "SoundCloud" }),
                      /* @__PURE__ */ jsx("option", { value: "direct", children: "Direct" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Audio URL (optional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "url",
                    value: formData.audio_url,
                    onChange: (e) => setFormData({ ...formData, audio_url: e.target.value }),
                    placeholder: "https://..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Section (optional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: formData.section,
                    onChange: (e) => setFormData({ ...formData, section: e.target.value }),
                    placeholder: "e.g., 1-10"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Title (optional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: formData.title,
                    onChange: (e) => setFormData({ ...formData, title: e.target.value }),
                    placeholder: "Recording title"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Field, { children: [
                /* @__PURE__ */ jsx(Label, { children: "Description (optional)" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    value: formData.description,
                    onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                    placeholder: "Recording description",
                    rows: 3
                  }
                )
              ] })
            ] }),
            formError && /* @__PURE__ */ jsx(ErrorMessage, { children: formError })
          ] }),
          /* @__PURE__ */ jsxs(DialogActions, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                plain: true,
                onClick: () => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                },
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: isCreateOpen ? handleCreate : handleEdit,
                color: "indigo",
                children: isCreateOpen ? "Create" : "Save"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Dialog, { open: isDeleteOpen, onClose: setIsDeleteOpen, children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Delete Recording" }),
      /* @__PURE__ */ jsx(DialogBody, { children: "Are you sure you want to delete this recording? This action cannot be undone." }),
      /* @__PURE__ */ jsxs(DialogActions, { children: [
        /* @__PURE__ */ jsx(Button, { plain: true, onClick: () => setIsDeleteOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleDelete, color: "red", children: "Delete" })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Recordings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Recordings;
  const auth = getAuth();
  const session = await auth.api.getSession({
    // Correct await usage
    headers: Astro2.request.headers
  });
  if (!session) {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate`<html lang="en" class="h-full"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Recordings - Admin</title>${renderHead()}</head> <body class="h-full"> ${renderComponent($$result, "AdminLayout", AdminLayout, { "client:load": true, "currentPage": "recordings", "client:component-hydration": "load", "client:component-path": "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/AdminLayout", "client:component-export": "AdminLayout" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "RecordingsTable", RecordingsTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/RecordingsTable", "client:component-export": "RecordingsTable" })} ` })} </body></html>`;
}, "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/recordings.astro", void 0);

const $$file = "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/recordings.astro";
const $$url = "/admin/recordings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Recordings,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
