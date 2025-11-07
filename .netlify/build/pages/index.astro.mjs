import { c as createComponent, m as maybeRenderHead, r as renderTemplate, d as createAstro, f as addAttribute, i as renderHead, k as renderSlot, j as renderComponent } from '../chunks/astro/server_VjCsmGoa.mjs';
/* empty css                                 */
import 'clsx';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { a as getRecordings, g as getHuffadh, e as getVenues } from '../chunks/db_Bv8cEppV.mjs';
export { renderers } from '../renderers.mjs';

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-white border-t border-gray-200 mt-16"> <div class="max-w-7xl mx-auto px-4 py-8"> <div class="flex flex-col items-center space-y-4"> <!-- Social Links --> <div class="flex items-center space-x-6"> <a href="https://www.facebook.com/aswaatulqurraa" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="Facebook"> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"> <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path> </svg> </a> <a href="https://x.com/aswaatulqurraa" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition-colors duration-200" aria-label="X (Twitter)"> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path> </svg> </a> <a href="https://www.instagram.com/aswaatulqurraa" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-pink-600 transition-colors duration-200" aria-label="Instagram"> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path> </svg> </a> <a href="https://youtube.com/user/aswaatulqurraa" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-red-600 transition-colors duration-200" aria-label="YouTube"> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"> <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path> </svg> </a> </div> <!-- Copyright --> <div class="text-center text-sm text-gray-500"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Aswaat ul Qurraa. All rights reserved.</p> </div> </div> </div> </footer>`;
}, "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Directory of Taraweeh Recordings"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Favicons --><link rel="icon" href="/favicon-32x32.png" sizes="32x32"><link rel="icon" href="/favicon-192x192.png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><meta name="msapplication-TileImage" content="/mstile-270x270.png"><!-- Open Graph / SEO --><meta property="og:url" content="https://taraweeh.co.za"><meta property="og:site_name" content="Taraweeh.co.za"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:type" content="website"><title>${title}</title>${renderHead()}</head> <body class="bg-white dark:bg-zinc-900"> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/layouts/Layout.astro", void 0);

function RecordingsPlayer({
  recordings,
  huffadh,
  venues,
  cities,
  years
}) {
  const [selectedHafidh, setSelectedHafidh] = useState("All");
  const [selectedVenue, setSelectedVenue] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentRecording, setCurrentRecording] = useState(null);
  const filteredRecordings = recordings.filter((recording) => {
    if (selectedHafidh !== "All" && recording.hafidh_name !== selectedHafidh)
      return false;
    if (selectedVenue !== "All" && recording.venue_name !== selectedVenue)
      return false;
    if (selectedCity !== "All" && recording.city !== selectedCity) return false;
    if (selectedYear !== "All" && recording.hijri_year.toString() !== selectedYear)
      return false;
    return true;
  });
  const getYouTubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/shorts\/([^&\s]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };
  const playRecording = (recording) => {
    setCurrentRecording(recording);
  };
  const closePlayer = () => {
    setCurrentRecording(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-linear-to-br from-teal-50 to-blue-50 text-gray-900 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Taraweeh", className: "h-12 w-auto" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-teal-800", children: "Taraweeh" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Directory of Taraweeh Recordings" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(
          FilterSelect,
          {
            label: "Hafidh",
            options: ["All", ...huffadh],
            selected: selectedHafidh,
            onChange: setSelectedHafidh
          }
        ),
        /* @__PURE__ */ jsx(
          FilterSelect,
          {
            label: "Venue",
            options: ["All", ...venues],
            selected: selectedVenue,
            onChange: setSelectedVenue
          }
        ),
        /* @__PURE__ */ jsx(
          FilterSelect,
          {
            label: "City",
            options: ["All", ...cities],
            selected: selectedCity,
            onChange: setSelectedCity
          }
        ),
        /* @__PURE__ */ jsx(
          FilterSelect,
          {
            label: "Year",
            options: ["All", ...years.map(String)],
            selected: selectedYear,
            onChange: setSelectedYear
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-8 py-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold mb-6", children: [
        filteredRecordings.length,
        " Recording",
        filteredRecordings.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredRecordings.map((recording, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `grid grid-cols-12 gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${currentRecording?.id === recording.id ? "bg-teal-100 shadow-md" : "bg-white hover:bg-teal-50 shadow-sm hover:shadow"}`,
          onClick: () => playRecording(recording),
          children: [
            /* @__PURE__ */ jsx("div", { className: "col-span-1 flex items-center justify-center text-gray-500", children: currentRecording?.id === recording.id ? /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 text-teal-600",
                fill: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", { d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z" })
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-sm", children: index + 1 }) }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-5 flex flex-col justify-center", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `font-medium ${currentRecording?.id === recording.id ? "text-teal-700" : "text-gray-900"}`,
                  children: recording.hafidh_name
                }
              ),
              recording.title && /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: recording.title })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "col-span-3 flex items-center text-sm text-gray-700", children: recording.venue_name }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 flex items-center text-sm text-gray-700", children: recording.city }),
            /* @__PURE__ */ jsx("div", { className: "col-span-1 flex items-center justify-end", children: /* @__PURE__ */ jsx(
              "span",
              {
                className: `px-2 py-1 text-xs font-medium rounded ${recording.source === "youtube" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`,
                children: recording.source
              }
            ) })
          ]
        },
        recording.id
      )) })
    ] }),
    currentRecording && currentRecording.source === "youtube" && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg",
        style: { height: "320px" },
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm truncate text-gray-900", children: currentRecording.hafidh_name }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 truncate", children: [
                currentRecording.venue_name,
                ", ",
                currentRecording.city,
                " •",
                " ",
                currentRecording.hijri_year,
                " AH"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: closePlayer,
                className: "ml-4 text-gray-600 hover:text-gray-900 p-2",
                "aria-label": "Close player",
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              width: "100%",
              height: "100%",
              src: `https://www.youtube.com/embed/${getYouTubeId(currentRecording.url)}?autoplay=1`,
              title: currentRecording.title || `${currentRecording.hafidh_name} - ${currentRecording.hijri_year} AH`,
              frameBorder: "0",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true
            }
          ) })
        ] })
      }
    ),
    currentRecording && currentRecording.source === "soundcloud" && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg",
        style: { height: "200px" },
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm truncate text-gray-900", children: currentRecording.hafidh_name }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 truncate", children: [
                currentRecording.venue_name,
                ", ",
                currentRecording.city,
                " •",
                " ",
                currentRecording.hijri_year,
                " AH",
                currentRecording.section && ` • Section ${currentRecording.section}`
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: closePlayer,
                className: "ml-4 text-gray-600 hover:text-gray-900 p-2",
                "aria-label": "Close player",
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "w-5 h-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              width: "100%",
              height: "100%",
              scrolling: "no",
              frameBorder: "no",
              allow: "autoplay",
              src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(currentRecording.url)}&color=%2314b8a6&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`,
              title: currentRecording.title || `${currentRecording.hafidh_name} - ${currentRecording.hijri_year} AH`
            }
          ) })
        ] })
      }
    )
  ] });
}
function FilterSelect({
  label,
  options,
  selected,
  onChange
}) {
  return /* @__PURE__ */ jsx(Listbox, { value: selected, onChange, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(Listbox.Label, { className: "block text-xs text-gray-600 mb-1 font-medium", children: label }),
    /* @__PURE__ */ jsxs(Listbox.Button, { className: "w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-left text-sm transition-all flex items-center justify-between shadow-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "truncate text-gray-900", children: selected }),
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-4 h-4 text-gray-500",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M19 9l-7 7-7-7"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Listbox.Options, { className: "absolute z-20 mt-1 w-full bg-white rounded-lg shadow-xl max-h-60 overflow-auto border border-gray-200", children: options.map((option) => /* @__PURE__ */ jsx(
      Listbox.Option,
      {
        value: option,
        className: ({ active }) => `cursor-pointer select-none px-4 py-2 text-sm ${active ? "bg-teal-50" : ""} ${selected === option ? "text-teal-700 font-medium bg-teal-50" : "text-gray-900"}`,
        children: option
      },
      option
    )) })
  ] }) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const recordings = getRecordings.all();
  const huffadh = getHuffadh.all().map((h) => h.name);
  const venues = getVenues.all().map((v) => v.name);
  const cities = [...new Set(getVenues.all().map((v) => v.city))];
  const years = [...new Set(recordings.map((r) => r.hijri_year))].sort(
    (a, b) => b - a
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Taraweeh Recordings" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "RecordingsPlayer", RecordingsPlayer, { "recordings": recordings, "huffadh": huffadh, "venues": venues, "cities": cities, "years": years, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/RecordingsPlayer", "client:component-export": "default" })} ` })}`;
}, "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/index.astro", void 0);

const $$file = "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
