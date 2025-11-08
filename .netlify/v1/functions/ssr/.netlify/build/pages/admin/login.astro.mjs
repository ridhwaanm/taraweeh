import { c as createComponent, i as renderHead, j as renderComponent, r as renderTemplate } from '../../chunks/astro/server_VjCsmGoa.mjs';
/* empty css                                    */
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as signIn } from '../../chunks/auth-client_BWDXSOd9.mjs';
export { renderers } from '../../renderers.mjs';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({
        email,
        password
      });
      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      method: "post",
      action: "#",
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
            "input",
            {
              id: "email-address",
              type: "email",
              name: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
              placeholder: "Email address",
              autoComplete: "email",
              "aria-label": "Email address",
              disabled: loading,
              className: "block w-full rounded-t-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-teal-500"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "-mt-px", children: /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              type: "password",
              name: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
              placeholder: "Password",
              autoComplete: "current-password",
              "aria-label": "Password",
              disabled: loading,
              className: "block w-full rounded-b-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-teal-500"
            }
          ) })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-red-50 p-3 dark:bg-red-900/20", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800 dark:text-red-400", children: error }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-6 shrink-0 items-center", children: /* @__PURE__ */ jsxs("div", { className: "group grid size-4 grid-cols-1", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "remember-me",
                  type: "checkbox",
                  name: "remember-me",
                  checked: rememberMe,
                  onChange: (e) => setRememberMe(e.target.checked),
                  className: "col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-teal-600 checked:bg-teal-600 indeterminate:border-teal-600 indeterminate:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-teal-500 dark:checked:bg-teal-500 dark:indeterminate:border-teal-500 dark:indeterminate:bg-teal-500 dark:focus-visible:outline-teal-500 forced-colors:appearance-auto"
                }
              ),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  viewBox: "0 0 14 14",
                  fill: "none",
                  className: "pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M3 8L6 11L11 3.5",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      className: "opacity-0 group-has-checked:opacity-100"
                    }
                  )
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "remember-me",
                className: "block text-sm/6 text-gray-900 dark:text-gray-300",
                children: "Remember me"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm/6", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300",
              children: "Forgot password?"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal-500 dark:shadow-none dark:hover:bg-teal-400 dark:focus-visible:outline-teal-500",
            children: loading ? "Signing in..." : "Sign in"
          }
        ) })
      ]
    }
  );
}

const prerender = false;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" class="h-full bg-white dark:bg-gray-900"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Login - Taraweeh Recordings</title>${renderHead()}</head> <body class="h-full"> <div class="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8"> <div class="w-full max-w-sm space-y-10"> <div> <img src="/logo.png" alt="Taraweeh" class="mx-auto h-16 w-auto dark:hidden"> <img src="/logo.png" alt="Taraweeh" class="mx-auto hidden h-16 w-auto dark:block"> <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
Sign in to your account
</h2> </div> ${renderComponent($$result, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/LoginForm", "client:component-export": "LoginForm" })} </div> </div> </body></html>`;
}, "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/login.astro", void 0);

const $$file = "/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
