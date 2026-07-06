const features = [
  {
    title: "About Us",
    description:
      "Tell your story with a page that's already laid out — just add your words and photos.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-3.31 0-8 1.66-8 4.5V21h16v-2.5c0-2.84-4.69-4.5-8-4.5Z"
      />
    ),
  },
  {
    title: "Portfolio & Products",
    description:
      "Show off what you make or sell in a clean gallery your customers can browse on any device.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5h16v14H4V5Zm0 5h16M9 20V10"
      />
    ),
  },
  {
    title: "Book & Order",
    description:
      "Let customers request an appointment or place an order right from your site — no phone tag.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3v3m8-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
      />
    ),
  },
  {
    title: "Reviews",
    description:
      "Collect and display real feedback from real customers to build trust with new ones.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.2 6.1-.6L12 3Z"
      />
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Sign up",
    description: "Create your account and pick a name — you'll get yourname.mydomain.com instantly.",
  },
  {
    number: "02",
    title: "Customize",
    description: "Add your About text, photos, products or services, and contact details.",
  },
  {
    number: "03",
    title: "Go live",
    description: "Share your link. Customers can browse, book, and leave reviews right away.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-black/8 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Bizmanager
          </span>
          <nav className="flex items-center gap-3">
            <a
              href="#"
              className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-950 sm:block dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign in
            </a>
            <a
              href="#"
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 pt-20 pb-24 text-center sm:pt-28">
          <span className="rounded-full border border-black/8 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/15 dark:text-zinc-400">
            Built for small businesses
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
            Your business, online in minutes
          </h1>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            A homepage with About Us, your portfolio or products, booking or
            ordering, and reviews — all on your own{" "}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              name.mydomain.com
            </span>
            .
          </p>

          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center rounded-full border border-black/12 bg-white pl-4 text-sm text-zinc-500 focus-within:border-zinc-950 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-400 dark:focus-within:border-zinc-50">
              <input
                type="text"
                placeholder="yourbusiness"
                className="w-full bg-transparent py-3 text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
              />
              <span className="whitespace-nowrap pr-4 text-zinc-400">
                .mydomain.com
              </span>
            </div>
            <button
              type="submit"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Claim it — it&apos;s free
            </button>
          </form>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            No credit card required. Set up your page in about 5 minutes.
          </p>
        </section>

        {/* Features */}
        <section className="border-t border-black/8 bg-zinc-50 py-20 dark:border-white/8 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Everything your customers look for
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                One page, four essentials — already designed for you.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-black/8 bg-white p-6 dark:border-white/10 dark:bg-black"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-9 w-9 text-zinc-950 dark:text-zinc-50"
                  >
                    {feature.icon}
                  </svg>
                  <h3 className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Live in three steps
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-600">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="border-t border-black/8 bg-zinc-50 py-20 dark:border-white/8 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-4xl px-6">
            <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm dark:border-white/10 dark:bg-black">
              <div className="flex items-center gap-2 border-b border-black/8 bg-zinc-100 px-4 py-3 dark:border-white/10 dark:bg-zinc-900">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-3 rounded-md bg-white px-3 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  acme.mydomain.com
                </span>
              </div>
              <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    Acme Pottery Studio
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    Handcrafted ceramics, made in small batches since 2015.
                    Every piece is wheel-thrown and fired in our backyard
                    kiln.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="text-amber-500">★★★★★</span>
                    <span>4.9 from 32 reviews</span>
                  </div>
                  <button className="mt-6 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black">
                    Book an appointment
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Mug", "Bowl", "Vase set", "Plate"].map((item) => (
                    <div
                      key={item}
                      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
              Example only — your page, your content.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Ready to get your business online?
          </h2>
          <a
            href="#"
            className="mt-6 inline-block rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Get started for free
          </a>
        </section>
      </main>

      <footer className="border-t border-black/8 py-8 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-zinc-500 sm:flex-row dark:text-zinc-500">
          <span>© {new Date().getFullYear()} Bizmanager</span>
          <span>Every business deserves a home online.</span>
        </div>
      </footer>
    </div>
  );
}
