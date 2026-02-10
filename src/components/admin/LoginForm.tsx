import { useState } from "react";
import { signIn } from "../../lib/auth-client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        // Redirect to admin dashboard
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      action="#"
      className="space-y-6"
    >
      <div>
        <div className="col-span-2">
          <input
            id="email-address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            autoComplete="email"
            aria-label="Email address"
            disabled={loading}
            className="block w-full rounded-t-[var(--radius-md)] bg-background-base px-3 py-1.5 text-base text-primary outline-1 -outline-offset-1 outline-contrast-low placeholder:text-contrast-medium focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-state-focus sm:text-sm/6 dark:bg-[#0e0e12] dark:text-[#fbfcff] dark:outline-[#404044] dark:placeholder:text-[#88898c] dark:focus:outline-state-focus"
          />
        </div>
        <div className="-mt-px">
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            autoComplete="current-password"
            aria-label="Password"
            disabled={loading}
            className="block w-full rounded-b-[var(--radius-md)] bg-background-base px-3 py-1.5 text-base text-primary outline-1 -outline-offset-1 outline-contrast-low placeholder:text-contrast-medium focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-state-focus sm:text-sm/6 dark:bg-[#0e0e12] dark:text-[#fbfcff] dark:outline-[#404044] dark:placeholder:text-[#88898c] dark:focus:outline-state-focus"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] bg-notification-error-soft p-3 dark:bg-[#3a0f0f]">
          <p className="text-sm text-notification-error dark:text-[#fc4040]">
            {error}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                id="remember-me"
                type="checkbox"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="col-start-1 row-start-1 appearance-none rounded border border-contrast-low bg-background-base checked:border-state-focus checked:bg-state-focus indeterminate:border-state-focus indeterminate:bg-state-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-state-focus disabled:border-contrast-low disabled:bg-background-surface disabled:checked:bg-background-surface dark:border-[#404044] dark:bg-[#0e0e12] dark:checked:border-state-focus dark:checked:bg-state-focus dark:indeterminate:border-state-focus dark:indeterminate:bg-state-focus dark:focus-visible:outline-state-focus forced-colors:appearance-auto"
              />
              <svg
                viewBox="0 0 14 14"
                fill="none"
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
              >
                <path
                  d="M3 8L6 11L11 3.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-has-checked:opacity-100"
                />
              </svg>
            </div>
          </div>
          <label
            htmlFor="remember-me"
            className="block text-sm/6 text-primary dark:text-[#cecfd1]"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm/6">
          <a
            href="#"
            className="font-semibold text-state-focus hover:opacity-80 dark:text-state-focus dark:hover:opacity-80"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-[var(--radius-md)] bg-primary px-3 py-1.5 text-sm/6 font-semibold text-background-base shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-state-focus disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#fbfcff] dark:text-[#0e0e12] dark:shadow-none dark:hover:opacity-90 dark:focus-visible:outline-state-focus"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
