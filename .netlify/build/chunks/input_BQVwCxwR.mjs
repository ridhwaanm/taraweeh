import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { forwardRef, useId, useState, useEffect, createContext, useContext } from 'react';
import { u as useSession, a as signOut } from './auth-client_BWDXSOd9.mjs';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { RectangleStackIcon, UserGroupIcon, MapPinIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { motion, LayoutGroup } from 'motion/react';

const Link = forwardRef(function Link2(props, ref) {
  return /* @__PURE__ */ jsx(Headless.DataInteractive, { children: /* @__PURE__ */ jsx("a", { ...props, ref }) });
});

const styles = {
  base: [
    // Base
    "relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold",
    // Sizing
    "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6",
    // Focus
    "focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",
    // Disabled
    "data-disabled:opacity-50",
    // Icon
    "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]"
  ],
  solid: [
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-(--btn-border)",
    // Dark mode: border is rendered on `after` so background is set to button background
    "dark:bg-(--btn-bg)",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)",
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    "before:shadow-sm",
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    "dark:before:hidden",
    // Dark mode: Subtle white outline is applied using a border
    "dark:border-white/5",
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]",
    // Inner highlight shadow
    "after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
    // White overlay on hover
    "data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)",
    // Dark mode: `after` layer expands to cover entire button
    "dark:after:-inset-px dark:after:rounded-lg",
    // Disabled
    "data-disabled:before:shadow-none data-disabled:after:shadow-none"
  ],
  outline: [
    // Base
    "border-zinc-950/10 text-zinc-950 data-active:bg-zinc-950/2.5 data-hover:bg-zinc-950/2.5",
    // Dark mode
    "dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5",
    // Icon
    "[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]"
  ],
  plain: [
    // Base
    "border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5",
    // Dark mode
    "dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10",
    // Icon
    "[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]"
  ],
  colors: {
    "dark/zinc": [
      "text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
      "dark:text-white dark:[--btn-bg:var(--color-zinc-600)] dark:[--btn-hover-overlay:var(--color-white)]/5",
      "[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]"
    ],
    light: [
      "text-zinc-950 [--btn-bg:white] [--btn-border:var(--color-zinc-950)]/10 [--btn-hover-overlay:var(--color-zinc-950)]/2.5 data-active:[--btn-border:var(--color-zinc-950)]/15 data-hover:[--btn-border:var(--color-zinc-950)]/15",
      "dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-zinc-800)]",
      "[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]"
    ],
    "dark/white": [
      "text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
      "dark:text-zinc-950 dark:[--btn-bg:white] dark:[--btn-hover-overlay:var(--color-zinc-950)]/5",
      "[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]"
    ],
    dark: [
      "text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
      "dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-zinc-800)]",
      "[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]"
    ],
    white: [
      "text-zinc-950 [--btn-bg:white] [--btn-border:var(--color-zinc-950)]/10 [--btn-hover-overlay:var(--color-zinc-950)]/2.5 data-active:[--btn-border:var(--color-zinc-950)]/15 data-hover:[--btn-border:var(--color-zinc-950)]/15",
      "dark:[--btn-hover-overlay:var(--color-zinc-950)]/5",
      "[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-500)] data-hover:[--btn-icon:var(--color-zinc-500)]"
    ],
    zinc: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-zinc-600)] [--btn-border:var(--color-zinc-700)]/90",
      "dark:[--btn-hover-overlay:var(--color-white)]/5",
      "[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]"
    ],
    indigo: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-indigo-500)] [--btn-border:var(--color-indigo-600)]/90",
      "[--btn-icon:var(--color-indigo-300)] data-active:[--btn-icon:var(--color-indigo-200)] data-hover:[--btn-icon:var(--color-indigo-200)]"
    ],
    cyan: [
      "text-cyan-950 [--btn-bg:var(--color-cyan-300)] [--btn-border:var(--color-cyan-400)]/80 [--btn-hover-overlay:var(--color-white)]/25",
      "[--btn-icon:var(--color-cyan-500)]"
    ],
    red: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-red-600)] [--btn-border:var(--color-red-700)]/90",
      "[--btn-icon:var(--color-red-300)] data-active:[--btn-icon:var(--color-red-200)] data-hover:[--btn-icon:var(--color-red-200)]"
    ],
    orange: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-orange-500)] [--btn-border:var(--color-orange-600)]/90",
      "[--btn-icon:var(--color-orange-300)] data-active:[--btn-icon:var(--color-orange-200)] data-hover:[--btn-icon:var(--color-orange-200)]"
    ],
    amber: [
      "text-amber-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-amber-400)] [--btn-border:var(--color-amber-500)]/80",
      "[--btn-icon:var(--color-amber-600)]"
    ],
    yellow: [
      "text-yellow-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-yellow-300)] [--btn-border:var(--color-yellow-400)]/80",
      "[--btn-icon:var(--color-yellow-600)] data-active:[--btn-icon:var(--color-yellow-700)] data-hover:[--btn-icon:var(--color-yellow-700)]"
    ],
    lime: [
      "text-lime-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-lime-300)] [--btn-border:var(--color-lime-400)]/80",
      "[--btn-icon:var(--color-lime-600)] data-active:[--btn-icon:var(--color-lime-700)] data-hover:[--btn-icon:var(--color-lime-700)]"
    ],
    green: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90",
      "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80"
    ],
    emerald: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-emerald-600)] [--btn-border:var(--color-emerald-700)]/90",
      "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80"
    ],
    teal: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-teal-600)] [--btn-border:var(--color-teal-700)]/90",
      "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80"
    ],
    sky: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-sky-500)] [--btn-border:var(--color-sky-600)]/80",
      "[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80"
    ],
    blue: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-blue-600)] [--btn-border:var(--color-blue-700)]/90",
      "[--btn-icon:var(--color-blue-400)] data-active:[--btn-icon:var(--color-blue-300)] data-hover:[--btn-icon:var(--color-blue-300)]"
    ],
    violet: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-violet-500)] [--btn-border:var(--color-violet-600)]/90",
      "[--btn-icon:var(--color-violet-300)] data-active:[--btn-icon:var(--color-violet-200)] data-hover:[--btn-icon:var(--color-violet-200)]"
    ],
    purple: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-purple-500)] [--btn-border:var(--color-purple-600)]/90",
      "[--btn-icon:var(--color-purple-300)] data-active:[--btn-icon:var(--color-purple-200)] data-hover:[--btn-icon:var(--color-purple-200)]"
    ],
    fuchsia: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-fuchsia-500)] [--btn-border:var(--color-fuchsia-600)]/90",
      "[--btn-icon:var(--color-fuchsia-300)] data-active:[--btn-icon:var(--color-fuchsia-200)] data-hover:[--btn-icon:var(--color-fuchsia-200)]"
    ],
    pink: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-pink-500)] [--btn-border:var(--color-pink-600)]/90",
      "[--btn-icon:var(--color-pink-300)] data-active:[--btn-icon:var(--color-pink-200)] data-hover:[--btn-icon:var(--color-pink-200)]"
    ],
    rose: [
      "text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-rose-500)] [--btn-border:var(--color-rose-600)]/90",
      "[--btn-icon:var(--color-rose-300)] data-active:[--btn-icon:var(--color-rose-200)] data-hover:[--btn-icon:var(--color-rose-200)]"
    ]
  }
};
const Button = forwardRef(function Button2({ color, outline, plain, className, children, ...props }, ref) {
  let classes = clsx(
    className,
    styles.base,
    outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color ?? "dark/zinc"])
  );
  return typeof props.href === "string" ? /* @__PURE__ */ jsx(Link, { ...props, className: classes, ref, children: /* @__PURE__ */ jsx(TouchTarget, { children }) }) : /* @__PURE__ */ jsx(Headless.Button, { ...props, className: clsx(classes, "cursor-default"), ref, children: /* @__PURE__ */ jsx(TouchTarget, { children }) });
});
function TouchTarget({ children }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden",
        "aria-hidden": "true"
      }
    ),
    children
  ] });
}

function Navbar({ className, ...props }) {
  return /* @__PURE__ */ jsx("nav", { ...props, className: clsx(className, "flex flex-1 items-center gap-4 py-2.5") });
}
function NavbarSection({ className, ...props }) {
  let id = useId();
  return /* @__PURE__ */ jsx(LayoutGroup, { id, children: /* @__PURE__ */ jsx("div", { ...props, className: clsx(className, "flex items-center gap-3") }) });
}
function NavbarSpacer({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { "aria-hidden": "true", ...props, className: clsx(className, "-ml-4 flex-1") });
}
const NavbarItem = forwardRef(function NavbarItem2({
  current,
  className,
  children,
  ...props
}, ref) {
  let classes = clsx(
    // Base
    "relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5",
    // Leading icon/icon-only
    "*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5",
    // Trailing icon (down chevron or similar)
    "*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4",
    // Avatar
    "*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)] sm:*:data-[slot=avatar]:size-6",
    // Hover
    "data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950",
    // Active
    "data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950",
    // Dark mode
    "dark:text-white dark:*:data-[slot=icon]:fill-zinc-400",
    "dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white",
    "dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white"
  );
  return /* @__PURE__ */ jsxs("span", { className: clsx(className, "relative"), children: [
    current && /* @__PURE__ */ jsx(
      motion.span,
      {
        layoutId: "current-indicator",
        className: "absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
      }
    ),
    typeof props.href === "string" ? /* @__PURE__ */ jsx(
      Link,
      {
        ...props,
        className: classes,
        "data-current": current ? "true" : void 0,
        ref,
        children: /* @__PURE__ */ jsx(TouchTarget, { children })
      }
    ) : /* @__PURE__ */ jsx(
      Headless.Button,
      {
        ...props,
        className: clsx("cursor-default", classes),
        "data-current": current ? "true" : void 0,
        ref,
        children: /* @__PURE__ */ jsx(TouchTarget, { children })
      }
    )
  ] });
});

function OpenMenuIcon() {
  return /* @__PURE__ */ jsx("svg", { "data-slot": "icon", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" }) });
}
function CloseMenuIcon() {
  return /* @__PURE__ */ jsx("svg", { "data-slot": "icon", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" }) });
}
function MobileSidebar({ open, close, children }) {
  return /* @__PURE__ */ jsxs(Headless.Dialog, { open, onClose: close, className: "lg:hidden", children: [
    /* @__PURE__ */ jsx(
      Headless.DialogBackdrop,
      {
        transition: true,
        className: "fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      }
    ),
    /* @__PURE__ */ jsx(
      Headless.DialogPanel,
      {
        transition: true,
        className: "fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:-translate-x-full",
        children: /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10", children: [
          /* @__PURE__ */ jsx("div", { className: "-mb-3 px-4 pt-3", children: /* @__PURE__ */ jsx(Headless.CloseButton, { as: NavbarItem, "aria-label": "Close navigation", children: /* @__PURE__ */ jsx(CloseMenuIcon, {}) }) }),
          children
        ] })
      }
    )
  ] });
}
function SidebarLayout({
  navbar,
  sidebar,
  children
}) {
  let [showSidebar, setShowSidebar] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-y-0 left-0 w-64 max-lg:hidden", children: sidebar }),
    /* @__PURE__ */ jsx(MobileSidebar, { open: showSidebar, close: () => setShowSidebar(false), children: sidebar }),
    /* @__PURE__ */ jsxs("header", { className: "flex items-center px-4 lg:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "py-2.5", children: /* @__PURE__ */ jsx(NavbarItem, { onClick: () => setShowSidebar(true), "aria-label": "Open navigation", children: /* @__PURE__ */ jsx(OpenMenuIcon, {}) }) }),
      /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: navbar })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64", children: /* @__PURE__ */ jsx("div", { className: "grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl", children }) }) })
  ] });
}

function Sidebar({ className, ...props }) {
  return /* @__PURE__ */ jsx("nav", { ...props, className: clsx(className, "flex h-full min-h-0 flex-col") });
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: clsx(
        className,
        "flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5"
      )
    }
  );
}
function SidebarBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: clsx(
        className,
        "flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8"
      )
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: clsx(
        className,
        "flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5"
      )
    }
  );
}
function SidebarSection({ className, ...props }) {
  let id = useId();
  return /* @__PURE__ */ jsx(LayoutGroup, { id, children: /* @__PURE__ */ jsx("div", { ...props, "data-slot": "section", className: clsx(className, "flex flex-col gap-0.5") }) });
}
const SidebarItem = forwardRef(function SidebarItem2({
  current,
  className,
  children,
  ...props
}, ref) {
  let classes = clsx(
    // Base
    "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5",
    // Leading icon/icon-only
    "*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5",
    // Trailing icon (down chevron or similar)
    "*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-5 sm:*:last:data-[slot=icon]:size-4",
    // Avatar
    "*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 sm:*:data-[slot=avatar]:size-6",
    // Hover
    "data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950",
    // Active
    "data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950",
    // Current
    "data-current:*:data-[slot=icon]:fill-zinc-950",
    // Dark mode
    "dark:text-white dark:*:data-[slot=icon]:fill-zinc-400",
    "dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white",
    "dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white",
    "dark:data-current:*:data-[slot=icon]:fill-white"
  );
  return /* @__PURE__ */ jsxs("span", { className: clsx(className, "relative"), children: [
    current && /* @__PURE__ */ jsx(
      motion.span,
      {
        layoutId: "current-indicator",
        className: "absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white"
      }
    ),
    typeof props.href === "string" ? /* @__PURE__ */ jsx(
      Headless.CloseButton,
      {
        as: Link,
        ...props,
        className: classes,
        "data-current": current ? "true" : void 0,
        ref,
        children: /* @__PURE__ */ jsx(TouchTarget, { children })
      }
    ) : /* @__PURE__ */ jsx(
      Headless.Button,
      {
        ...props,
        className: clsx("cursor-default", classes),
        "data-current": current ? "true" : void 0,
        ref,
        children: /* @__PURE__ */ jsx(TouchTarget, { children })
      }
    )
  ] });
});
function SidebarLabel({ className, ...props }) {
  return /* @__PURE__ */ jsx("span", { ...props, className: clsx(className, "truncate") });
}

function Avatar({
  src = null,
  square = false,
  initials,
  alt = "",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "data-slot": "avatar",
      ...props,
      className: clsx(
        className,
        // Basic layout
        "inline-grid shrink-0 align-middle [--avatar-radius:20%] *:col-start-1 *:row-start-1",
        "outline -outline-offset-1 outline-black/10 dark:outline-white/10",
        // Border radius
        square ? "rounded-(--avatar-radius) *:rounded-(--avatar-radius)" : "rounded-full *:rounded-full"
      ),
      children: [
        initials && /* @__PURE__ */ jsxs(
          "svg",
          {
            className: "size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none",
            viewBox: "0 0 100 100",
            "aria-hidden": alt ? void 0 : "true",
            children: [
              alt && /* @__PURE__ */ jsx("title", { children: alt }),
              /* @__PURE__ */ jsx("text", { x: "50%", y: "50%", alignmentBaseline: "middle", dominantBaseline: "middle", textAnchor: "middle", dy: ".125em", children: initials })
            ]
          }
        ),
        src && /* @__PURE__ */ jsx("img", { className: "size-full", src, alt })
      ]
    }
  );
}
forwardRef(function AvatarButton2({
  src,
  square = false,
  initials,
  alt,
  className,
  ...props
}, ref) {
  let classes = clsx(
    className,
    square ? "rounded-[20%]" : "rounded-full",
    "relative inline-grid focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500"
  );
  return typeof props.href === "string" ? /* @__PURE__ */ jsx(Link, { ...props, className: classes, ref, children: /* @__PURE__ */ jsx(TouchTarget, { children: /* @__PURE__ */ jsx(Avatar, { src, square, initials, alt }) }) }) : /* @__PURE__ */ jsx(Headless.Button, { ...props, className: classes, ref, children: /* @__PURE__ */ jsx(TouchTarget, { children: /* @__PURE__ */ jsx(Avatar, { src, square, initials, alt }) }) });
});

function AdminLayout({ children, currentPage }) {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && !isPending && !session) {
      window.location.href = "/admin/login";
    }
  }, [session, isPending, mounted]);
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/admin/login";
  };
  if (!mounted || isPending) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-zinc-600 dark:text-zinc-400", children: "Loading..." }) });
  }
  if (!session) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    SidebarLayout,
    {
      navbar: /* @__PURE__ */ jsxs(Navbar, { children: [
        /* @__PURE__ */ jsx(NavbarSpacer, {}),
        /* @__PURE__ */ jsx(NavbarSection, { children: /* @__PURE__ */ jsx(NavbarItem, { onClick: handleSignOut, "aria-label": "Sign out", children: /* @__PURE__ */ jsx(ArrowRightOnRectangleIcon, {}) }) })
      ] }),
      sidebar: /* @__PURE__ */ jsxs(Sidebar, { children: [
        /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Avatar,
            {
              src: "/logo.png",
              className: "size-10",
              square: true,
              alt: "Taraweeh"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-zinc-950 dark:text-white", children: "Taraweeh Admin" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: session.user?.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(SidebarBody, { children: /* @__PURE__ */ jsxs(SidebarSection, { children: [
          /* @__PURE__ */ jsxs(
            SidebarItem,
            {
              href: "/admin/recordings",
              current: currentPage === "recordings",
              children: [
                /* @__PURE__ */ jsx(RectangleStackIcon, {}),
                /* @__PURE__ */ jsx(SidebarLabel, { children: "Recordings" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            SidebarItem,
            {
              href: "/admin/huffadh",
              current: currentPage === "huffadh",
              children: [
                /* @__PURE__ */ jsx(UserGroupIcon, {}),
                /* @__PURE__ */ jsx(SidebarLabel, { children: "Huffadh" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            SidebarItem,
            {
              href: "/admin/venues",
              current: currentPage === "venues",
              children: [
                /* @__PURE__ */ jsx(MapPinIcon, {}),
                /* @__PURE__ */ jsx(SidebarLabel, { children: "Venues" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsxs(Button, { plain: true, onClick: handleSignOut, className: "w-full", children: [
          /* @__PURE__ */ jsx(ArrowRightOnRectangleIcon, { "data-slot": "icon" }),
          "Sign out"
        ] }) })
      ] }),
      children
    }
  );
}

const TableContext = createContext({
  bleed: false,
  dense: false,
  grid: false,
  striped: false
});
function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TableContext.Provider, { value: { bleed, dense, grid, striped }, children: /* @__PURE__ */ jsx("div", { className: "flow-root", children: /* @__PURE__ */ jsx("div", { ...props, className: clsx(className, "-mx-(--gutter) overflow-x-auto whitespace-nowrap"), children: /* @__PURE__ */ jsx("div", { className: clsx("inline-block min-w-full align-middle", !bleed && "sm:px-(--gutter)"), children: /* @__PURE__ */ jsx("table", { className: "min-w-full text-left text-sm/6 text-zinc-950 dark:text-white", children }) }) }) }) });
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx("thead", { ...props, className: clsx(className, "text-zinc-500 dark:text-zinc-400") });
}
function TableBody(props) {
  return /* @__PURE__ */ jsx("tbody", { ...props });
}
const TableRowContext = createContext({
  href: void 0,
  target: void 0,
  title: void 0
});
function TableRow({
  href,
  target,
  title,
  className,
  ...props
}) {
  let { striped } = useContext(TableContext);
  return /* @__PURE__ */ jsx(TableRowContext.Provider, { value: { href, target, title }, children: /* @__PURE__ */ jsx(
    "tr",
    {
      ...props,
      className: clsx(
        className,
        href && "has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/2.5",
        striped && "even:bg-zinc-950/2.5 dark:even:bg-white/2.5",
        href && striped && "hover:bg-zinc-950/5 dark:hover:bg-white/5",
        href && !striped && "hover:bg-zinc-950/2.5 dark:hover:bg-white/2.5"
      )
    }
  ) });
}
function TableHeader({ className, ...props }) {
  let { bleed, grid } = useContext(TableContext);
  return /* @__PURE__ */ jsx(
    "th",
    {
      ...props,
      className: clsx(
        className,
        "border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2)) dark:border-b-white/10",
        grid && "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
        !bleed && "sm:first:pl-1 sm:last:pr-1"
      )
    }
  );
}
function TableCell({ className, children, ...props }) {
  let { bleed, dense, grid, striped } = useContext(TableContext);
  let { href, target, title } = useContext(TableRowContext);
  let [cellRef, setCellRef] = useState(null);
  return /* @__PURE__ */ jsxs(
    "td",
    {
      ref: href ? setCellRef : void 0,
      ...props,
      className: clsx(
        className,
        "relative px-4 first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
        !striped && "border-b border-zinc-950/5 dark:border-white/5",
        grid && "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-1 sm:last:pr-1"
      ),
      children: [
        href && /* @__PURE__ */ jsx(
          Link,
          {
            "data-row-link": true,
            href,
            target,
            "aria-label": title,
            tabIndex: cellRef?.previousElementSibling === null ? 0 : -1,
            className: "absolute inset-0 focus:outline-hidden"
          }
        ),
        children
      ]
    }
  );
}

const sizes = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl"
};
function Dialog({
  size = "lg",
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(Headless.Dialog, { ...props, children: [
    /* @__PURE__ */ jsx(
      Headless.DialogBackdrop,
      {
        transition: true,
        className: "fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/50"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0", children: /* @__PURE__ */ jsx("div", { className: "grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4", children: /* @__PURE__ */ jsx(
      Headless.DialogPanel,
      {
        transition: true,
        className: clsx(
          className,
          sizes[size],
          "row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-(--gutter) shadow-lg ring-1 ring-zinc-950/10 [--gutter:--spacing(8)] sm:mb-auto sm:rounded-2xl dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline",
          "transition duration-100 will-change-transform data-closed:translate-y-12 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:data-closed:translate-y-0 sm:data-closed:data-enter:scale-95"
        ),
        children
      }
    ) }) })
  ] });
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Headless.DialogTitle,
    {
      ...props,
      className: clsx(className, "text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6 dark:text-white")
    }
  );
}
function DialogBody({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { ...props, className: clsx(className, "mt-6") });
}
function DialogActions({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: clsx(
        className,
        "mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto"
      )
    }
  );
}

function Field({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Headless.Field,
    {
      ...props,
      className: clsx(
        className,
        "[&>[data-slot=label]+[data-slot=control]]:mt-3",
        "[&>[data-slot=label]+[data-slot=description]]:mt-1",
        "[&>[data-slot=description]+[data-slot=control]]:mt-3",
        "[&>[data-slot=control]+[data-slot=description]]:mt-3",
        "[&>[data-slot=control]+[data-slot=error]]:mt-3",
        "*:data-[slot=label]:font-medium"
      )
    }
  );
}
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Headless.Label,
    {
      "data-slot": "label",
      ...props,
      className: clsx(
        className,
        "text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6 dark:text-white"
      )
    }
  );
}
function ErrorMessage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Headless.Description,
    {
      "data-slot": "error",
      ...props,
      className: clsx(className, "text-base/6 text-red-600 data-disabled:opacity-50 sm:text-sm/6 dark:text-red-500")
    }
  );
}

const dateTypes = ["date", "datetime-local", "month", "time", "week"];
const Input = forwardRef(function Input2({
  className,
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
        Headless.Input,
        {
          ref,
          ...props,
          className: clsx([
            // Date classes
            props.type && dateTypes.includes(props.type) && [
              "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
              "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
              "[&::-webkit-datetime-edit]:inline-flex",
              "[&::-webkit-datetime-edit]:p-0",
              "[&::-webkit-datetime-edit-year-field]:p-0",
              "[&::-webkit-datetime-edit-month-field]:p-0",
              "[&::-webkit-datetime-edit-day-field]:p-0",
              "[&::-webkit-datetime-edit-hour-field]:p-0",
              "[&::-webkit-datetime-edit-minute-field]:p-0",
              "[&::-webkit-datetime-edit-second-field]:p-0",
              "[&::-webkit-datetime-edit-millisecond-field]:p-0",
              "[&::-webkit-datetime-edit-meridiem-field]:p-0"
            ],
            // Basic layout
            "relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
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
            "data-disabled:border-zinc-950/20 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/2.5 dark:data-hover:data-disabled:border-white/15",
            // System icons
            "dark:scheme-dark"
          ])
        }
      )
    }
  );
});

export { AdminLayout as A, Button as B, Dialog as D, ErrorMessage as E, Field as F, Input as I, Label as L, Table as T, TableHead as a, TableRow as b, TableHeader as c, TableBody as d, TableCell as e, DialogTitle as f, DialogBody as g, DialogActions as h };
