import Link from "next/link";
import {
  Button,
  Card,
  Chip,
  Link as HeroLink,
  InputGroup,
  Typography,
  buttonVariants,
} from "@heroui/react";

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
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Bizmanager
          </span>
          <nav className="flex items-center gap-4">
            <HeroLink href="/login" className="hidden text-sm sm:block">
              Sign in
            </HeroLink>
            <Link href="/signup" className={buttonVariants({ size: "sm" })}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 pt-20 pb-24 text-center sm:pt-28">
          <Chip>Built for small businesses</Chip>
          <Typography.Heading level={1} className="max-w-2xl text-4xl sm:text-6xl">
            Your business, online in minutes
          </Typography.Heading>
          <Typography.Paragraph className="max-w-xl text-lg text-muted">
            A homepage with About Us, your portfolio or products, booking or
            ordering, and reviews — all on your own{" "}
            <span className="font-medium text-foreground">name.mydomain.com</span>.
          </Typography.Paragraph>

          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <InputGroup className="flex-1">
              <InputGroup.Input placeholder="yourbusiness" />
              <InputGroup.Suffix>.mydomain.com</InputGroup.Suffix>
            </InputGroup>
            <Button type="submit">Claim it — it&apos;s free</Button>
          </form>
          <Typography.Paragraph size="xs" className="text-muted">
            No credit card required. Set up your page in about 5 minutes.
          </Typography.Paragraph>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-surface-secondary py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Typography.Heading level={2} className="text-3xl">
                Everything your customers look for
              </Typography.Heading>
              <Typography.Paragraph className="mt-3 text-muted">
                One page, four essentials — already designed for you.
              </Typography.Paragraph>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <Card.Header>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-9 w-9 text-foreground"
                    >
                      {feature.icon}
                    </svg>
                    <Card.Title className="mt-4 text-base">{feature.title}</Card.Title>
                    <Card.Description>{feature.description}</Card.Description>
                  </Card.Header>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Typography.Heading level={2} className="text-3xl">
                Live in three steps
              </Typography.Heading>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-muted">{step.number}</span>
                  <Typography.Heading level={3} className="text-lg">
                    {step.title}
                  </Typography.Heading>
                  <Typography.Paragraph size="sm" className="text-muted">
                    {step.description}
                  </Typography.Paragraph>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="border-t border-border bg-surface-secondary py-20">
          <div className="mx-auto w-full max-w-4xl px-6">
            <Card variant="secondary" className="overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-border bg-surface-tertiary px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <Chip size="sm" className="ml-3">acme.mydomain.com</Chip>
              </div>
              <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2">
                <div>
                  <Typography.Heading level={3} className="text-xl">
                    Acme Pottery Studio
                  </Typography.Heading>
                  <Typography.Paragraph size="sm" className="mt-2 text-muted">
                    Handcrafted ceramics, made in small batches since 2015.
                    Every piece is wheel-thrown and fired in our backyard
                    kiln.
                  </Typography.Paragraph>
                  <div className="mt-4 flex items-center gap-1 text-sm text-muted">
                    <span className="text-warning">★★★★★</span>
                    <span>4.9 from 32 reviews</span>
                  </div>
                  <Button size="sm" className="mt-6">
                    Book an appointment
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Mug", "Bowl", "Vase set", "Plate"].map((item) => (
                    <div
                      key={item}
                      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl bg-default text-xs text-muted"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Typography.Paragraph size="sm" className="mt-4 text-center text-muted">
              Example only — your page, your content.
            </Typography.Paragraph>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <Typography.Heading level={2} className="text-3xl">
            Ready to get your business online?
          </Typography.Heading>
          <Link href="/signup" className={buttonVariants({ className: "mt-6" })}>
            Get started for free
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Bizmanager</span>
          <span>Every business deserves a home online.</span>
        </div>
      </footer>
    </div>
  );
}
