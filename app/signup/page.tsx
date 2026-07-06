"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "./actions";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "mydomain.com";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-16 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            Bizmanager
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Set up your business and claim your free page.
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="businessName"
              className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50"
            >
              Business name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Acme Photography"
              className="w-full rounded-lg border border-black/12 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-950 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
            />
            {state?.errors?.businessName && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.businessName[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="subdomain"
              className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50"
            >
              Your domain
            </label>
            <div className="flex items-center rounded-lg border border-black/12 bg-white pl-4 text-sm text-zinc-500 focus-within:border-zinc-950 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-400 dark:focus-within:border-zinc-50">
              <input
                id="subdomain"
                name="subdomain"
                type="text"
                placeholder="yourbusiness"
                className="w-full bg-transparent py-2.5 text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
              />
              <span className="whitespace-nowrap pr-4 text-zinc-400">
                .{ROOT_DOMAIN}
              </span>
            </div>
            {state?.errors?.subdomain && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.subdomain[0]}
              </p>
            )}
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Business type
            </span>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer flex-col gap-1 rounded-lg border border-black/12 p-3 has-checked:border-zinc-950 dark:border-white/15 dark:has-checked:border-zinc-50">
                <input
                  type="radio"
                  name="businessType"
                  value="SERVICE"
                  defaultChecked
                  className="sr-only"
                />
                <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Service
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Appointments &amp; bookings
                </span>
              </label>
              <label className="flex cursor-pointer flex-col gap-1 rounded-lg border border-black/12 p-3 has-checked:border-zinc-950 dark:border-white/15 dark:has-checked:border-zinc-50">
                <input
                  type="radio"
                  name="businessType"
                  value="PRODUCT"
                  className="sr-only"
                />
                <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Product
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Orders &amp; custom requests
                </span>
              </label>
            </div>
            {state?.errors?.businessType && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.businessType[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-black/12 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-950 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
            />
            {state?.errors?.email && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-black/12 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
            />
            {state?.errors?.password && (
              <ul className="mt-1.5 list-inside list-disc text-xs text-red-600 dark:text-red-400">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-zinc-950 dark:text-zinc-50"
            >
              Verify password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full rounded-lg border border-black/12 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
            />
            {state?.errors?.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
          )}

          <button
            disabled={pending}
            type="submit"
            className="mt-2 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
