import { notFound } from "next/navigation";
import { getMockBusiness } from "@/lib/mock-tenant";

type Props = {
  params: Promise<{ domain: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { domain } = await params;
  const business = getMockBusiness(domain);
  return { title: business ? `${business.name}` : "Site not found" };
}

export default async function TenantHomePage({ params }: Props) {
  const { domain } = await params;
  const business = getMockBusiness(domain);

  if (!business) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-black/8 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {business.name}
          </span>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 sm:flex dark:text-zinc-400">
            <a href="#about" className="hover:text-zinc-950 dark:hover:text-zinc-50">
              About
            </a>
            <a href="#portfolio" className="hover:text-zinc-950 dark:hover:text-zinc-50">
              Portfolio
            </a>
            <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-zinc-50">
              Pricing
            </a>
            <a href="#reviews" className="hover:text-zinc-950 dark:hover:text-zinc-50">
              Reviews
            </a>
          </nav>
          <a
            href="#book"
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Book a session
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden bg-zinc-900 px-6 py-24 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
          <p className="relative text-sm font-medium tracking-wide text-zinc-400 uppercase">
            {business.location}
          </p>
          <h1 className="relative max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {business.tagline}
          </h1>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <a
              href="#book"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Book a session
            </a>
            <a
              href="#portfolio"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              View portfolio
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-black/8 dark:border-white/10">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-3 divide-x divide-black/8 px-6 dark:divide-white/10">
            {[
              { label: "Years shooting", value: `${business.yearsExperience}+` },
              { label: "Sessions delivered", value: `${business.sessionsShot}+` },
              { label: "Based in", value: business.location },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-8 text-center">
                <span className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              About
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">{business.aboutText}</p>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="border-t border-black/8 bg-zinc-50 py-20 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Portfolio
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {business.gallery.map((item, i) => (
                <div
                  key={item.caption}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 p-4"
                  style={{ opacity: 1 - (i % 3) * 0.08 }}
                >
                  <span className="text-xs font-medium text-zinc-300 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className="text-sm font-medium text-white">{item.caption}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Session packages
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {business.packages.map((pkg) => (
                <div
                  key={pkg.title}
                  className="flex flex-col gap-3 rounded-2xl border border-black/8 p-6 dark:border-white/10"
                >
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {pkg.title}
                  </h3>
                  <p className="flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {pkg.description}
                  </p>
                  <p className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                    ${pkg.price.toLocaleString()}
                  </p>
                  <a
                    href="#book"
                    className="mt-2 rounded-full bg-zinc-950 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Inquire
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="border-t border-black/8 bg-zinc-50 py-20 dark:border-white/10 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-4xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Reviews
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {business.reviews.map((review) => (
                <div
                  key={review.authorName}
                  className="flex flex-col gap-2 rounded-2xl border border-black/8 bg-white p-6 dark:border-white/10 dark:bg-black"
                >
                  <span className="text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <p className="flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    &ldquo;{review.body}&rdquo;
                  </p>
                  <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {review.authorName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book / contact */}
        <section id="book" className="py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Ready to book your session?
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            {business.contactEmail} &middot; {business.contactPhone}
          </p>
          <a
            href={`mailto:${business.contactEmail}`}
            className="mt-6 inline-block rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Get in touch
          </a>
        </section>
      </main>

      <footer className="border-t border-black/8 py-8 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-zinc-500 sm:flex-row dark:text-zinc-500">
          <span>© {new Date().getFullYear()} {business.name}</span>
          <span>{business.location}</span>
        </div>
      </footer>
    </div>
  );
}
